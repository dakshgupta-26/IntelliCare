"""Decision-aware uncertainty: split-conformal prediction intervals plus a decision backtest.

Builds prediction intervals from real out-of-sample residuals (split-conformal, not a Gaussian
assumption), lets the resource optimizer plan for a chosen risk level (a quantile of demand), then
replays the optimizer over held-out days for every forecasting model x risk level and scores each
plan's realized cost against a perfect-foresight oracle plan. The lowest-regret (model, risk level)
becomes the recommendation. See docs/plans/decision-aware-uncertainty.md for the full spec.

Inference-time use lives in forecasting.py (Forecaster.forecast) and main.py (/optimize,
/uncertainty/report); this module only trains/evaluates and writes the two output files.
"""
import json
import math
import time
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
import torch

from .config import ARTIFACT_DIR, FORECAST_HORIZONS, LOOKBACK, REPORT_DIR, UNITS
from .forecasting import LSTMForecaster, TEST_HOURS, _sequence_inputs, tabular_features
from .optimization import DEFAULT_WEIGHTS, VENT_NEED, allocate_resources

MODELS = ["persistence", "xgboost", "lstm", "ensemble"]  # also the tie-break order for recommendations
LEVELS = [0.5, 0.8, 0.9, 0.95]                            # risk levels tau, and two-sided coverage levels alpha
QUANTILE_PROBS = [0.025, 0.05, 0.1, 0.25, 0.5, 0.75, 0.8, 0.9, 0.95, 0.975]
ALPHA_TAILS = {0.5: (0.25, 0.75), 0.8: (0.1, 0.9), 0.9: (0.05, 0.95), 0.95: (0.025, 0.975)}
CALIBRATION_DAYS = 30
GAP_HOURS = 24
DECISION_EVERY_H = 6


def _split(n: int) -> int:
    return n - TEST_HOURS - max(FORECAST_HORIZONS)


def _windows(n: int):
    split = _split(n)
    calib_start, calib_end = split, split + CALIBRATION_DAYS * 24
    eval_start, eval_end = calib_end + GAP_HOURS, n - max(FORECAST_HORIZONS)
    return (calib_start, calib_end), (eval_start, eval_end)


def conformal_quantile(r: np.ndarray, p: float) -> float:
    """Finite-sample split-conformal quantile of residuals r at probability p."""
    m = len(r)
    level = min(1.0, math.ceil((m + 1) * p) / m)
    return float(np.quantile(r, level, method="higher"))


# --------------------------------------------------------------------------------------- 4.1
def holdout_predictions(df: pd.DataFrame) -> dict:
    """dict[unit][horizon] -> DataFrame(origin, timestamp, actual, persistence, xgboost, lstm,
    ensemble) for every origin in the held-out test window. Uses the trained artifacts exactly as
    Forecaster does; never retrains."""
    n = len(df)
    split, max_h = _split(n), max(FORECAST_HORIZONS)
    origins = np.arange(split, n - max_h)
    timestamps = df["timestamp"].to_numpy()

    out = {}
    for unit in UNITS:
        scale = UNITS[unit]["beds"]
        xgb_models = joblib.load(ARTIFACT_DIR / f"xgb_{unit}.joblib")
        net = LSTMForecaster(7, len(FORECAST_HORIZONS))
        net.load_state_dict(torch.load(ARTIFACT_DIR / f"lstm_{unit}.pt"))
        net.eval()

        feats_o = tabular_features(df, unit).iloc[origins]
        seq = _sequence_inputs(df, unit)
        windows = np.stack([seq[t - LOOKBACK + 1: t + 1] for t in origins])
        with torch.no_grad():
            lstm_pred = net(torch.from_numpy(windows)).numpy() * scale

        census = df[unit].to_numpy(dtype=float)
        persistence_pred = census[origins]

        out[unit] = {}
        for j, h in enumerate(FORECAST_HORIZONS):
            xgb_pred = xgb_models[h].predict(feats_o)
            lstm_h = lstm_pred[:, j]
            out[unit][h] = pd.DataFrame({
                "origin": origins,
                "timestamp": timestamps[origins],
                "actual": census[origins + h],
                "persistence": persistence_pred,
                "xgboost": xgb_pred,
                "lstm": lstm_h,
                "ensemble": (xgb_pred + lstm_h) / 2,
            })
    return out


# --------------------------------------------------------------------------------------- 4.2
def calibrate(preds: dict, n: int) -> dict:
    """Per unit x horizon x model: fixed conformal quantiles of calibration-window residuals.
    Shape matches artifacts/conformal.json: {unit: {horizon_str: {model: {"q": {prob_str: value}}}}}."""
    (calib_start, calib_end), _ = _windows(n)
    quantiles = {}
    for unit, by_h in preds.items():
        quantiles[unit] = {}
        for h, frame in by_h.items():
            calib = frame[(frame["origin"] >= calib_start) & (frame["origin"] < calib_end)]
            quantiles[unit][str(h)] = {}
            for model in MODELS:
                r = (calib["actual"] - calib[model]).to_numpy()
                quantiles[unit][str(h)][model] = {"q": {str(p): conformal_quantile(r, p) for p in QUANTILE_PROBS}}
    return quantiles


def coverage_report(preds: dict, quantiles: dict, n: int) -> dict:
    """Empirical coverage and mean width of the two-sided conformal interval at each level, on the
    evaluation window (never used to fit the quantiles)."""
    _, (eval_start, eval_end) = _windows(n)
    report = {}
    for unit, by_h in preds.items():
        report[unit] = {}
        for h, frame in by_h.items():
            ev = frame[(frame["origin"] >= eval_start) & (frame["origin"] < eval_end)]
            report[unit][str(h)] = {}
            for model in MODELS:
                q = quantiles[unit][str(h)][model]["q"]
                report[unit][str(h)][model] = {}
                for alpha in LEVELS:
                    lo_p, hi_p = ALPHA_TAILS[alpha]
                    lower, upper = ev[model] + q[str(lo_p)], ev[model] + q[str(hi_p)]
                    covered = (ev["actual"] >= lower) & (ev["actual"] <= upper)
                    report[unit][str(h)][model][str(alpha)] = {
                        "coverage": round(float(covered.mean()), 4),
                        "mean_width": round(float((upper - lower).mean()), 3),
                    }
    return report


def planned_demand(pred: float, model_q: dict, tau) -> float:
    """Planning quantile for risk level tau: 'point' is the raw prediction; a numeric tau plans for
    the tau case using the one-sided conformal adjustment (prediction + residual quantile)."""
    if tau == "point":
        return max(0.0, pred)
    return max(0.0, pred + model_q["q"][str(tau)])


# --------------------------------------------------------------------------------------- 4.3
def realized_cost(alloc_units: dict, actual: dict, weights: dict | None = None) -> dict:
    """Realized cost of a plan (allocate_resources' `units` field) against what actually happened.
    Same objective the MILP minimises, so the oracle plan (run on the actual demand) is optimal and
    regret = cost - oracle_cost is >= 0 (up to solver tolerance)."""
    w = weights or DEFAULT_WEIGHTS
    totals = {"cost": 0.0, "unmet": 0.0, "uncovered": 0.0, "overtime": 0.0, "idle": 0.0, "vent_short": 0.0}
    for u, a in alloc_units.items():
        d = actual[u]
        beds_total = a["beds"] + a["surge_beds"]
        unmet = max(0.0, d - beds_total)
        bedded = min(d, beds_total)
        nurses_total = a["nurses"] + a["float_nurses"] + a["overtime_nurses"]
        uncovered = max(0.0, bedded - a["ratio"] * nurses_total)
        idle = max(0.0, a["surge_beds"] - max(0.0, d - a["beds"]))
        vent_need = math.ceil(VENT_NEED[u] * d)
        vent_short = max(0, vent_need - a["ventilators"])
        cost = (w["unmet_demand"] * (unmet + vent_short) + w["ratio_violation"] * uncovered
                + w["overtime"] * a["overtime_nurses"] + w["transfer"] * (a["surge_beds"] + a["float_nurses"])
                + w["idle"] * idle)
        totals["cost"] += cost
        totals["unmet"] += unmet
        totals["uncovered"] += uncovered
        totals["overtime"] += a["overtime_nurses"]
        totals["idle"] += idle
        totals["vent_short"] += vent_short
    return totals


# --------------------------------------------------------------------------------------- 4.4
def run_backtest(df: pd.DataFrame, horizons: list[int] | None = None, max_decision_points: int | None = None) -> dict:
    """Replay the optimizer over held-out decision points for every model x risk level and score
    against a perfect-foresight oracle. `horizons`/`max_decision_points` narrow the run for tests;
    omit both for the full spec'd backtest (~9,700 MILP solves, a couple of minutes)."""
    n = len(df)
    horizons = horizons or FORECAST_HORIZONS
    preds = holdout_predictions(df)
    quantiles = calibrate(preds, n)
    coverage = coverage_report(preds, quantiles, n)
    (calib_start, calib_end), (eval_start, eval_end) = _windows(n)

    ref = preds[next(iter(UNITS))][horizons[0]]
    ev_ref = ref[(ref["origin"] >= eval_start) & (ref["origin"] < eval_end)]
    hours = pd.to_datetime(ev_ref["timestamp"]).dt.hour
    decision_points = ev_ref.loc[hours % DECISION_EVERY_H == 0, "origin"].to_numpy()
    if max_decision_points is not None:
        decision_points = decision_points[:max_decision_points]

    lookup = {u: {h: preds[u][h].set_index("origin") for h in horizons} for u in UNITS}
    census = {u: df[u].to_numpy(dtype=float) for u in UNITS}

    taus = ["point"] + LEVELS
    stats = {h: {m: {str(tau): {"regret": 0.0, "cost": 0.0, "unmet": 0.0, "uncovered": 0.0,
                                 "overtime": 0.0, "idle": 0.0, "n": 0} for tau in taus} for m in MODELS}
             for h in horizons}
    fallbacks = 0

    for h in horizons:
        for t in decision_points:
            actual = {u: float(census[u][t + h]) for u in UNITS}
            oracle = allocate_resources(actual)
            if oracle["method"] != "MILP_SCIP":
                fallbacks += 1
            oracle_cost = realized_cost(oracle["units"], actual)["cost"]

            row = {u: lookup[u][h].loc[t] for u in UNITS}
            for m in MODELS:
                pred = {u: float(row[u][m]) for u in UNITS}
                for tau in taus:
                    q = {u: quantiles[u][str(h)][m] for u in UNITS}
                    planned = {u: planned_demand(pred[u], q[u], tau) for u in UNITS}
                    alloc = allocate_resources(planned)
                    if alloc["method"] != "MILP_SCIP":
                        fallbacks += 1
                    rc = realized_cost(alloc["units"], actual)
                    s = stats[h][m][str(tau)]
                    s["regret"] += rc["cost"] - oracle_cost
                    s["cost"] += rc["cost"]
                    s["unmet"] += rc["unmet"]
                    s["uncovered"] += rc["uncovered"]
                    s["overtime"] += rc["overtime"]
                    s["idle"] += rc["idle"]
                    s["n"] += 1

    backtest_out = {}
    for h in horizons:
        backtest_out[str(h)] = {}
        for m in MODELS:
            backtest_out[str(h)][m] = {}
            for tau in taus:
                s = stats[h][m][str(tau)]
                backtest_out[str(h)][m][str(tau)] = {k: round(s[k] / s["n"], 3) for k in
                                                      ("regret", "cost", "unmet", "uncovered", "overtime", "idle")}

    mae_out = {}
    for h in horizons:
        mae_out[str(h)] = {}
        for m in MODELS:
            errs = np.concatenate([
                (lambda ev: (ev["actual"] - ev[m]).abs().to_numpy())(
                    preds[u][h][(preds[u][h]["origin"] >= eval_start) & (preds[u][h]["origin"] < eval_end)])
                for u in UNITS
            ])
            mae_out[str(h)][m] = round(float(errs.mean()), 3)

    def recommend(h):
        candidates = [(backtest_out[str(h)][m][str(tau)]["regret"], tau, mi, m)
                      for mi, m in enumerate(MODELS) for tau in LEVELS]
        candidates.sort(key=lambda c: (c[0], c[1], c[2]))
        regret, tau, _, m = candidates[0]
        return {"model": m, "risk_level": tau, "regret": regret}

    recommended = {str(h): recommend(h) for h in horizons}

    ranking = {}
    if 12 in horizons:
        accuracy_rank = sorted(MODELS, key=lambda m: mae_out["12"][m])
        decision_rank = sorted(MODELS, key=lambda m: min(backtest_out["12"][m][str(tau)]["regret"] for tau in LEVELS))
        ranking["12"] = {"accuracy_rank": accuracy_rank, "decision_rank": decision_rank}

    calib_frame = ref[(ref["origin"] >= calib_start) & (ref["origin"] < calib_end)]
    windows = {
        "calibration": {"start": pd.Timestamp(calib_frame["timestamp"].iloc[0]).isoformat(),
                        "end": pd.Timestamp(calib_frame["timestamp"].iloc[-1]).isoformat(), "origins": len(calib_frame)},
        "evaluation": {"start": pd.Timestamp(ev_ref["timestamp"].iloc[0]).isoformat(),
                       "end": pd.Timestamp(ev_ref["timestamp"].iloc[-1]).isoformat(), "origins": len(ev_ref)},
        "decision_points": len(decision_points), "decision_every_h": DECISION_EVERY_H,
    }

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "windows": windows,
        "levels": LEVELS,
        "models": MODELS,
        "coverage": coverage,
        "backtest": backtest_out,
        "mae": mae_out,
        "ranking": ranking,
        "recommended": recommended,
        "solver_fallbacks": fallbacks,
    }


# --------------------------------------------------------------------------------------- 4.6
def run_all(df: pd.DataFrame) -> dict:
    """Full pipeline: conformal calibration + the decision backtest. Writes artifacts/conformal.json
    and reports/decision_backtest.json; never run per API request."""
    t0 = time.time()
    preds = holdout_predictions(df)
    quantiles = calibrate(preds, len(df))
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    (ARTIFACT_DIR / "conformal.json").write_text(json.dumps(quantiles, indent=2))

    report = run_backtest(df)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    (REPORT_DIR / "decision_backtest.json").write_text(json.dumps(report, indent=2))
    print(f"decision-aware backtest done in {time.time() - t0:.0f}s "
          f"({report['windows']['decision_points']} decision points x {len(report['models'])} models "
          f"x {len(report['levels']) + 1} risk levels x {len(FORECAST_HORIZONS)} horizons)")
    return report
