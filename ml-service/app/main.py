"""IntelliCare ML & Optimization API.  Run:  uv run uvicorn app.main:app --reload --port 8000"""
import json
import os
import threading
import uuid
from datetime import datetime, timezone

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .appointments import AppointmentPredictor
from .clinic import ClinicDay
from .config import DATA_DIR, DEPARTMENTS, FORECAST_HORIZONS, REPORT_DIR, UNITS
from .forecasting import Forecaster
from .optimization import allocate_resources, slot_length
from .rag import PolicyEngine
from .scenario import PRESETS, run_scenario

app = FastAPI(title="IntelliCare ML & Optimization Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"], allow_headers=["*"],
)

census = pd.read_csv(DATA_DIR / "bed_census.csv", parse_dates=["timestamp"])
forecaster = Forecaster(census)
predictor = AppointmentPredictor()
policy = PolicyEngine()
clinic = ClinicDay(predictor)
clinic_lock = threading.Lock()
recommendations: dict[str, dict] = {}
audit_log: list[dict] = []
RISK_LEVELS = (0.5, 0.8, 0.9, 0.95)

_backtest_cache: dict = {"mtime": None, "data": None}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def all_forecasts() -> dict:
    return {u: forecaster.forecast(u) for u in UNITS}


def load_backtest_report() -> dict | None:
    """reports/decision_backtest.json, produced by `uv run python backtest.py`. Cached in memory;
    re-read only when the file's mtime changes."""
    path = REPORT_DIR / "decision_backtest.json"
    if not path.exists():
        _backtest_cache["mtime"] = None
        _backtest_cache["data"] = None
        return None
    mtime = path.stat().st_mtime
    if _backtest_cache["mtime"] != mtime:
        _backtest_cache["data"] = json.loads(path.read_text())
        _backtest_cache["mtime"] = mtime
    return _backtest_cache["data"]


load_backtest_report()  # prime the cache at startup


def demand_at(forecasts: dict, horizon_h: int, risk_level: float | None, model: str = "ensemble") -> dict:
    """risk_level=None plans for the model's point forecast; otherwise for that quantile of demand,
    using the same model's split-conformal residual quantile (the backtest's planning rule). Falls
    back to the pre-conformal Gaussian upper bound for risk_level=0.95 if backtest.py has not run."""
    point = lambda u: next(p for p in forecasts[u]["forecast"] if p["horizon_h"] == horizon_h)
    pred = lambda u: float(forecasts[u]["current"]) if model == "persistence" else float(point(u)[model])
    if risk_level is None:
        return {u: round(max(0.0, pred(u)), 1) for u in UNITS}
    conformal = forecaster.conformal
    demand = {}
    for u in UNITS:
        if conformal is not None:
            q = conformal[u][str(horizon_h)][model]["q"][str(risk_level)]
            demand[u] = round(max(0.0, pred(u) + q), 1)
        elif risk_level == 0.95 and model == "ensemble":
            demand[u] = point(u)["upper"]
        else:
            raise HTTPException(409, "Run: uv run python backtest.py")
    return demand


# --------------------------------------------------------------------------- system
@app.get("/health")
def health():
    return {"status": "ok", "units": list(UNITS), "horizons": FORECAST_HORIZONS, "llm_enabled": policy.llm_enabled,
            "sop_chunks": len(policy.chunks)}


@app.get("/metrics")
def model_metrics():
    path = REPORT_DIR / "metrics.json"
    if not path.exists():
        raise HTTPException(404, "Run `uv run python train.py` first")
    return json.loads(path.read_text())


@app.get("/uncertainty/report")
def uncertainty_report():
    report = load_backtest_report()
    if report is None:
        raise HTTPException(404, "Run: uv run python backtest.py")
    return report


# ---------------------------------------------------------------------- forecasting
@app.get("/forecast")
def forecast_all():
    return all_forecasts()


@app.get("/forecast/{unit}")
def forecast_unit(unit: str):
    unit = unit.upper()
    if unit not in UNITS:
        raise HTTPException(404, f"Unknown unit. Choose from {list(UNITS)}")
    return forecaster.forecast(unit)


# --------------------------------------------------------------------- optimization
class OptimizeRequest(BaseModel):
    horizon_h: int = 12
    conservative: bool = Field(False, description="Plan for the 95% risk level instead of the mean (legacy alias for risk_level=0.95)")
    risk_level: float | None = Field(None, description="Plan for this quantile of demand: one of 0.5, 0.8, 0.9, 0.95")
    use_recommended: bool = Field(False, description="Use the lowest-regret (model, risk level) from the decision backtest for this horizon")
    weights: dict[str, float] | None = None
    pools: dict[str, int] | None = None
    use_solver: bool = True


@app.post("/optimize")
def optimize(req: OptimizeRequest):
    if req.horizon_h not in FORECAST_HORIZONS:
        raise HTTPException(400, f"horizon_h must be one of {FORECAST_HORIZONS}")
    if req.risk_level is not None and req.risk_level not in RISK_LEVELS:
        raise HTTPException(400, f"risk_level must be one of {RISK_LEVELS}")

    # Precedence: use_recommended -> risk_level -> conservative (= risk_level 0.95) -> point forecast.
    if req.use_recommended:
        report = load_backtest_report()
        if report is None:
            raise HTTPException(409, "Run: uv run python backtest.py")
        rec = report["recommended"].get(str(req.horizon_h))
        if rec is None:
            raise HTTPException(409, f"No recommendation for horizon {req.horizon_h}h. Run: uv run python backtest.py")
        risk_level, planning_basis, planning_model = rec["risk_level"], "recommended", rec["model"]
    elif req.risk_level is not None:
        risk_level, planning_basis, planning_model = req.risk_level, "risk_level", "ensemble"
    elif req.conservative:
        risk_level, planning_basis, planning_model = 0.95, "risk_level", "ensemble"
    else:
        risk_level, planning_basis, planning_model = None, "point", "ensemble"

    demand = demand_at(all_forecasts(), req.horizon_h, risk_level, planning_model)
    result = allocate_resources(demand, pools=req.pools, weights=req.weights, use_solver=req.use_solver)
    # Superseded pending recommendations are expired; each new one gets an SOP justification.
    for rec in recommendations.values():
        if rec["status"] == "PENDING":
            rec["status"] = "EXPIRED"
    run_id = f"OPT-{uuid.uuid4().hex[:6].upper()}"
    for r in result["recommendations"]:
        rid = f"REC-{uuid.uuid4().hex[:6].upper()}"
        r.update({"id": rid, "run_id": run_id, "status": "PENDING", "created_at": now(),
                  "horizon_h": req.horizon_h, **policy.explain(r)})
        recommendations[rid] = r
    result.update({"run_id": run_id, "horizon_h": req.horizon_h, "demand_used": demand,
                  "risk_level": risk_level, "planning_basis": planning_basis, "planning_model": planning_model})
    return result


@app.get("/recommendations")
def list_recommendations(status: str | None = None):
    recs = sorted(recommendations.values(), key=lambda r: r["created_at"], reverse=True)
    return [r for r in recs if status is None or r["status"] == status.upper()]


class Decision(BaseModel):
    decision: str = Field(..., pattern="^(APPROVE|REJECT|MODIFY)$")
    actor: str = "Hospital Administrator"
    note: str = ""
    quantity: int | None = None


@app.post("/recommendations/{rec_id}/decision")
def decide(rec_id: str, d: Decision):
    rec = recommendations.get(rec_id)
    if rec is None:
        raise HTTPException(404, "Recommendation not found")
    if rec["status"] != "PENDING":
        raise HTTPException(409, f"Recommendation is already {rec['status']}")
    if d.decision == "MODIFY" and d.quantity is None:
        raise HTTPException(400, "MODIFY requires a quantity")
    before = rec["quantity"]
    rec["status"] = {"APPROVE": "APPROVED", "REJECT": "REJECTED", "MODIFY": "MODIFIED"}[d.decision]
    if d.decision == "MODIFY":
        rec["quantity"] = d.quantity
    rec.update({"decided_by": d.actor, "decided_at": now(), "note": d.note})
    audit_log.append({"at": now(), "actor": d.actor, "action": d.decision, "recommendation": rec_id,
                      "detail": rec["action"], "quantity_before": before, "quantity_after": rec["quantity"],
                      "note": d.note})
    return rec


@app.get("/audit")
def audit():
    return list(reversed(audit_log))


# ------------------------------------------------------------------------ scenarios
@app.get("/scenario/presets")
def scenario_presets():
    return PRESETS


class ScenarioRequest(BaseModel):
    preset: str | None = None
    arrival_increase_pct: dict[str, float] | float | None = None
    icu_beds_offline: int | None = None
    nurse_shortage_pct: float | None = None
    use_solver: bool = True


@app.post("/scenario")
def scenario(req: ScenarioRequest):
    base = PRESETS.get(req.preset.upper(), {}) if req.preset else {}
    if req.preset and not base:
        raise HTTPException(404, f"Unknown preset. Choose from {list(PRESETS)}")
    arrivals = req.arrival_increase_pct if req.arrival_increase_pct is not None else base.get("arrival_increase_pct", {})
    if isinstance(arrivals, (int, float)):
        arrivals = {u: arrivals for u in UNITS}
    arrivals = {k.upper(): v for k, v in arrivals.items()}
    result = run_scenario(
        all_forecasts(), arrivals,
        icu_beds_offline=req.icu_beds_offline if req.icu_beds_offline is not None else base.get("icu_beds_offline", 0),
        nurse_shortage_pct=req.nurse_shortage_pct if req.nurse_shortage_pct is not None else base.get("nurse_shortage_pct", 0),
        use_solver=req.use_solver,
    )
    for r in result["scenario"]["recommendations"]:
        r.update(policy.explain(r))
    result["parameters"] = {"preset": req.preset, "arrival_increase_pct": arrivals}
    return result


# --------------------------------------------------------------------- appointments
class PatientFeatures(BaseModel):
    department: str
    age: int = Field(..., ge=0, le=120)
    gender: str = "F"
    lead_days: int = Field(7, ge=0)
    sms_reminder: bool = True
    first_visit: bool = False
    prior_appointments: int = Field(3, ge=0)
    prior_no_shows: int = Field(0, ge=0)
    distance_km: float = Field(5.0, ge=0)
    chronic_conditions: int = Field(0, ge=0)
    weekday: int = Field(1, ge=0, le=6)
    slot_hour: int = Field(10, ge=0, le=23)
    insurance: bool = True


@app.post("/appointments/predict")
def predict_patient(p: PatientFeatures):
    if p.department not in DEPARTMENTS:
        raise HTTPException(400, f"Unknown department. Choose from {list(DEPARTMENTS)}")
    row = predictor.predict(pd.DataFrame([p.model_dump()])).iloc[0]
    return {"no_show_prob": float(row.no_show_prob), "high_risk": bool(row.high_risk),
            "predicted_duration_min": round(float(row.predicted_duration), 1),
            "recommended_slot_min": slot_length(row.predicted_duration, row.no_show_prob)}


@app.get("/appointments/schedule")
def get_schedule():
    with clinic_lock:
        return {"clock": clinic.metrics()["clock"], "appointments": clinic.schedule(), "events": clinic.events}


@app.get("/appointments/metrics")
def get_clinic_metrics():
    with clinic_lock:
        return clinic.metrics()


@app.get("/appointments/doctors")
def get_doctors():
    with clinic_lock:
        return clinic.doctors()


class ClockRequest(BaseModel):
    time: str = Field(..., pattern=r"^\d{1,2}:\d{2}$")


class CancelRequest(BaseModel):
    appointment_id: str


class EmergencyRequest(BaseModel):
    department: str
    expected_duration: float = 25.0


class DoctorRequest(BaseModel):
    doctor: str


def _event(fn, *args):
    with clinic_lock:
        try:
            event = fn(*args)
        except KeyError as e:
            raise HTTPException(404, f"Not found: {e}")
        except ValueError as e:
            raise HTTPException(409, str(e))
        return {"event": event, "metrics": clinic.metrics()}


@app.post("/appointments/clock")
def set_clock(req: ClockRequest):
    h, m = map(int, req.time.split(":"))
    with clinic_lock:
        clinic.set_clock(h * 60 + m)
        return {"clock": clinic.metrics()["clock"]}


@app.post("/appointments/cancel")
def cancel(req: CancelRequest):
    return _event(clinic.cancel, req.appointment_id)


@app.post("/appointments/emergency")
def emergency(req: EmergencyRequest):
    return _event(clinic.emergency, req.department, req.expected_duration)


@app.post("/appointments/doctor-unavailable")
def doctor_unavailable(req: DoctorRequest):
    return _event(clinic.doctor_unavailable, req.doctor)


@app.post("/appointments/reset")
def reset_clinic():
    with clinic_lock:
        clinic.reset()
        return clinic.metrics()


# ------------------------------------------------------------------------------ RAG
class Question(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)


@app.post("/rag/query")
def rag_query(q: Question):
    return policy.answer(q.question)


@app.get("/rag/documents")
def rag_documents():
    docs = {}
    for c in policy.chunks:
        docs.setdefault(c["sop_id"], {"sop_id": c["sop_id"], "title": c["title"], "sections": []})["sections"].append(
            {"section": c["section"], "text": c["text"]})
    return list(docs.values())
