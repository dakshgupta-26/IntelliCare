"""Generate data, train every model, and write reports/metrics.json + reports/metrics.md.

    uv run python train.py
"""
import json
import time

import pandas as pd

from app import appointments, forecasting, uncertainty
from app.config import DATA_DIR, REPORT_DIR
from app.data_gen import generate_all


def to_markdown(m: dict) -> str:
    lines = ["# IntelliCare model evaluation", "", f"Generated: {m['generated_at']}", "",
             "## Demand forecasting (test set: last 60 days, never seen in training)", ""]
    for unit, models in m["forecasting"].items():
        horizons = list(next(iter(models.values())))
        lines += [f"### {unit}", "", "| Model | " + " | ".join(f"MAE {h}" for h in horizons) + " | "
                  + " | ".join(f"MAPE {h}" for h in horizons) + " |",
                  "|---|" + "---|" * (2 * len(horizons))]
        for name, hs in models.items():
            lines.append(f"| {name} | " + " | ".join(str(hs[h]["MAE"]) for h in horizons) + " | "
                         + " | ".join(f"{hs[h]['MAPE']}%" for h in horizons) + " |")
        lines.append("")
    a = m["appointments"]
    lines += ["## No-show prediction (20% hold-out)", "", "| Model | ROC-AUC | Accuracy | Precision | Recall | F1 |", "|---|---|---|---|---|---|"]
    for name in ("RandomForest", "XGBoost"):
        r = a["no_show"][name]
        lines.append(f"| {name} | {r['ROC_AUC']} | {r['accuracy']} | {r['precision']} | {r['recall']} | {r['F1']} |")
    lines += ["", f"Selected: **{a['no_show']['selected']}**. Top features: "
              + ", ".join(f"{k} ({v})" for k, v in a["no_show"]["top_features"].items()), "",
              "## Consultation duration (attended visits)", "", "| Model | MAE (min) | R² |", "|---|---|---|"]
    for name in ("RandomForest", "XGBoost", "FixedSlotBaseline"):
        r = a["duration"][name]
        lines.append(f"| {name} | {r['MAE_min']} | {r['R2']} |")
    f = a["fairness"]
    lines += ["", "## Fairness audit (demographic parity of high-risk flags)", "",
              f"Gender parity gap: {f['gender']['demographic_parity_gap']} · Age-band parity gap: "
              f"{f['age_band']['demographic_parity_gap']} · Limit: {f['max_allowed_parity_gap']} · "
              f"**{'PASSED' if f['passed'] else 'FAILED'}**", "",
              f"Ablation: adding age as a feature raises ROC-AUC from {a['age_ablation']['ROC_AUC_without_age']} "
              f"to {a['age_ablation']['ROC_AUC_with_age']} but widens the age parity gap to "
              f"{a['age_ablation']['age_parity_gap_with_age']}, so age is excluded.", ""]
    return "\n".join(lines)


def to_markdown_uncertainty(report: dict) -> str:
    h = "12"
    lines = ["## Decision-aware uncertainty", "",
             "Split-conformal prediction intervals from real out-of-sample residuals, and a backtest that "
             "replays the resource optimizer over held-out days for every model x risk level, scored against "
             "a perfect-foresight oracle plan.", "",
             f"Calibration: {report['windows']['calibration']['origins']} origins "
             f"({report['windows']['calibration']['start']} to {report['windows']['calibration']['end']}). "
             f"Evaluation: {report['windows']['evaluation']['origins']} origins "
             f"({report['windows']['evaluation']['start']} to {report['windows']['evaluation']['end']}), "
             f"{report['windows']['decision_points']} decision points every {report['windows']['decision_every_h']}h. "
             f"Solver fallbacks: {report['solver_fallbacks']}.", "",
             "### 90% conformal coverage per unit, horizon +12h (ensemble)", "",
             "| Unit | Nominal | Empirical coverage | Mean width (beds) |", "|---|---|---|---|"]
    for unit, by_h in report["coverage"].items():
        c = by_h[h]["ensemble"]["0.9"]
        lines.append(f"| {unit} | 90% | {c['coverage'] * 100:.1f}% | {c['mean_width']} |")
    lines += ["", "### Mean decision regret vs the oracle plan, horizon +12h", "",
              "| Model | point | 50% | 80% | 90% | 95% |", "|---|---|---|---|---|---|"]
    for model in report["models"]:
        row = report["backtest"][h][model]
        lines.append(f"| {model} | " + " | ".join(str(row[t]["regret"]) for t in ("point", "0.5", "0.8", "0.9", "0.95")) + " |")
    rec = report["recommended"][h]
    lines += ["", f"**Recommendation (horizon +12h): plan at the {rec['risk_level'] * 100:.0f}% level using "
              f"{rec['model']}** (mean regret {rec['regret']}).", "",
              f"Accuracy rank (by MAE): {' > '.join(report['ranking'][h]['accuracy_rank'])}. "
              f"Decision rank (by best-risk-level regret): {' > '.join(report['ranking'][h]['decision_rank'])}.", ""]
    return "\n".join(lines)


def main():
    t0 = time.time()
    print("1/4 generating synthetic hospital data ...")
    generate_all()
    print("2/4 training forecasters (XGBoost + LSTM, 3 units x 4 horizons) ...")
    fc = forecasting.train_all(pd.read_csv(DATA_DIR / "bed_census.csv", parse_dates=["timestamp"]))
    print("3/4 training appointment models (no-show + duration) ...")
    ap = appointments.train(pd.read_csv(DATA_DIR / "appointments.csv"))
    metrics = {"generated_at": pd.Timestamp.now().isoformat(timespec="seconds"), "forecasting": fc, "appointments": ap}
    REPORT_DIR.mkdir(exist_ok=True)
    (REPORT_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))
    print("4/4 decision-aware backtest (conformal calibration + optimizer replay, a couple of minutes) ...")
    backtest_report = uncertainty.run_all(pd.read_csv(DATA_DIR / "bed_census.csv", parse_dates=["timestamp"]))
    (REPORT_DIR / "metrics.md").write_text(to_markdown(metrics) + "\n" + to_markdown_uncertainty(backtest_report))
    print(f"done in {time.time() - t0:.0f}s -> reports/metrics.md, reports/decision_backtest.json")


if __name__ == "__main__":
    main()
