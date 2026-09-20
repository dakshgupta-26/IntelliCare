"""Generate data, train every model, and write reports/metrics.json + reports/metrics.md.

    uv run python train.py
"""
import json
import time

import pandas as pd

from app import appointments, forecasting
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


def main():
    t0 = time.time()
    print("1/3 generating synthetic hospital data ...")
    generate_all()
    print("2/3 training forecasters (XGBoost + LSTM, 3 units x 4 horizons) ...")
    fc = forecasting.train_all(pd.read_csv(DATA_DIR / "bed_census.csv", parse_dates=["timestamp"]))
    print("3/3 training appointment models (no-show + duration) ...")
    ap = appointments.train(pd.read_csv(DATA_DIR / "appointments.csv"))
    metrics = {"generated_at": pd.Timestamp.now().isoformat(timespec="seconds"), "forecasting": fc, "appointments": ap}
    REPORT_DIR.mkdir(exist_ok=True)
    (REPORT_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))
    (REPORT_DIR / "metrics.md").write_text(to_markdown(metrics))
    print(f"done in {time.time() - t0:.0f}s -> reports/metrics.md")


if __name__ == "__main__":
    main()
