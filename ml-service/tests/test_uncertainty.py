"""Tests for the decision-aware uncertainty engine (app/uncertainty.py + the /optimize and
/uncertainty/report endpoints it feeds). Uses the trained artifacts and generated data already in
this environment (`uv run python train.py`); the decision-backtest tests replay only a handful of
real decision points to stay well under the ~2 minute budget."""
import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app.config import DATA_DIR, REPORT_DIR
from app.optimization import allocate_resources
from app.uncertainty import conformal_quantile, realized_cost, run_backtest

pytestmark = pytest.mark.skipif(
    not (DATA_DIR / "bed_census.csv").exists(),
    reason="run `uv run python train.py` first to generate data/bed_census.csv and the model artifacts",
)


@pytest.fixture(scope="module")
def census():
    return pd.read_csv(DATA_DIR / "bed_census.csv", parse_dates=["timestamp"])


@pytest.fixture(scope="module")
def small_backtest(census):
    """5 real decision points, horizon 12 only: enough to exercise the full oracle + solver loop
    without paying for the full ~116-point x 4-horizon backtest."""
    return run_backtest(census, horizons=[12], max_decision_points=5)


def test_conformal_quantile_finite_sample():
    r = np.array([1.0, 2.0, 3.0, 4.0, 5.0])  # m=5
    assert conformal_quantile(r, 0.8) == 5.0  # ceil(6*0.8)/5 = ceil(4.8)/5 = 1.0 -> max
    assert conformal_quantile(r, 0.4) == 4.0  # ceil(6*0.4)/5 = ceil(2.4)/5 = 0.6 -> "higher" 0.6-quantile = 4.0


def test_conformal_coverage_on_exchangeable_residuals():
    rng = np.random.default_rng(0)
    calib = rng.normal(0, 1, 2000)
    holdout = rng.normal(0, 1, 2000)  # same distribution as calib: exchangeable
    for alpha, (lo_p, hi_p) in {0.9: (0.05, 0.95), 0.8: (0.1, 0.9), 0.5: (0.25, 0.75)}.items():
        lo, hi = conformal_quantile(calib, lo_p), conformal_quantile(calib, hi_p)
        coverage = np.mean((holdout >= lo) & (holdout <= hi))
        assert coverage >= alpha - 0.05, f"alpha={alpha}: coverage {coverage}"


def test_realized_cost_exact_match_has_no_unmet_or_uncovered():
    demand = {"ICU": 100.0, "GENERAL": 900.0, "EMERGENCY": 60.0}  # comfortably within base capacity
    alloc = allocate_resources(demand)
    assert alloc["method"] == "MILP_SCIP"
    cost = realized_cost(alloc["units"], demand)
    assert cost["unmet"] == 0.0
    assert cost["uncovered"] == 0.0


def test_oracle_regret_nonnegative(small_backtest):
    for model, by_tau in small_backtest["backtest"]["12"].items():
        for tau, stats in by_tau.items():
            assert stats["regret"] >= -1e-6, f"{model} @ {tau}: regret {stats['regret']}"
            assert stats["deployed"] >= 0


def test_backtest_deterministic(census):
    r1 = run_backtest(census, horizons=[12], max_decision_points=5)
    r2 = run_backtest(census, horizons=[12], max_decision_points=5)
    assert r1["backtest"] == r2["backtest"]
    assert r1["recommended"] == r2["recommended"]
    assert r1["coverage"] == r2["coverage"]


@pytest.fixture(scope="module")
def client():
    from app.main import app
    return TestClient(app)


def test_optimize_risk_level(client):
    r = client.post("/optimize", json={"horizon_h": 12, "risk_level": 0.9})
    assert r.status_code == 200
    body = r.json()
    assert body["planning_basis"] == "risk_level"
    assert body["risk_level"] == 0.9


def test_optimize_invalid_risk_level(client):
    r = client.post("/optimize", json={"horizon_h": 12, "risk_level": 0.77})
    assert r.status_code == 400


@pytest.mark.skipif(not (REPORT_DIR / "decision_backtest.json").exists(),
                    reason="run `uv run python backtest.py` first")
class TestBacktestReportEndpoints:
    def test_uncertainty_report(self, client):
        r = client.get("/uncertainty/report")
        assert r.status_code == 200
        assert "recommended" in r.json()

    def test_optimize_use_recommended(self, client):
        r = client.post("/optimize", json={"horizon_h": 12, "use_recommended": True})
        assert r.status_code == 200
        body = r.json()
        assert body["planning_basis"] == "recommended"
        assert body["risk_level"] in (0.5, 0.8, 0.9, 0.95)
        rec = client.get("/uncertainty/report").json()["recommended"]["12"]
        assert body["planning_model"] == rec["model"] and body["risk_level"] == rec["risk_level"]
