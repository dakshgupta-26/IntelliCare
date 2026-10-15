"""Run the decision-aware uncertainty engine against the already-trained models: split-conformal
calibration, coverage check and the full optimizer replay backtest. Does not retrain anything.

    uv run python backtest.py
"""
import time

import pandas as pd

from app import uncertainty
from app.config import DATA_DIR


def main():
    t0 = time.time()
    print("loading data/bed_census.csv ...")
    df = pd.read_csv(DATA_DIR / "bed_census.csv", parse_dates=["timestamp"])
    print("running conformal calibration + decision backtest (a couple of minutes) ...")
    report = uncertainty.run_all(df)
    rec = report["recommended"]["12"]
    print(f"horizon-12 recommendation: {rec['model']} @ {rec['risk_level']*100:.0f}% "
          f"(mean regret {rec['regret']})  ·  solver fallbacks: {report['solver_fallbacks']}")
    print(f"done in {time.time() - t0:.0f}s -> reports/decision_backtest.json, artifacts/conformal.json")


if __name__ == "__main__":
    main()
