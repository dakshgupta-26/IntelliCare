"""Predictive appointment analytics: no-show classification + consultation-duration regression.

Includes a fairness audit: the no-show model must not flag one gender or age group
at a meaningfully different rate than another (demographic parity), because flagged
patients get overbooked slots / reminder calls.
"""
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (accuracy_score, f1_score, mean_absolute_error, precision_score,
                             r2_score, recall_score, roc_auc_score)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier, XGBRegressor

from .config import ARTIFACT_DIR, DEPARTMENTS, SEED

# Demographic-blind by design: gender and age are NOT model inputs; they are only used
# in the fairness audit. (Including age measurably biases flags against 18-35 year olds
# for <0.01 AUC gain - see "age_ablation" in the metrics report.)
PROTECTED = ["gender", "age"]
FEATURES = ["lead_days", "sms_reminder", "first_visit", "prior_appointments", "prior_no_shows",
            "prior_no_show_rate", "distance_km", "chronic_conditions", "weekday", "slot_hour", "insurance"]
DEPT_COLS = [f"dept_{d}" for d in DEPARTMENTS]
FLAG_THRESHOLD = 0.25  # calibrated probability above which a patient is flagged "high risk" (~ base no-show rate)


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    X = df.copy()
    X["prior_no_show_rate"] = X["prior_no_shows"] / X["prior_appointments"].clip(lower=1)
    for col in ["sms_reminder", "first_visit", "insurance"]:
        X[col] = X[col].astype(int)
    for d in DEPARTMENTS:
        X[f"dept_{d}"] = (X["department"] == d).astype(int)
    return X[FEATURES + DEPT_COLS]


def age_band(age: pd.Series) -> pd.Series:
    return pd.cut(age, [0, 17, 35, 60, 120], labels=["0-17", "18-35", "36-60", "60+"])


def fairness_audit(df_test: pd.DataFrame, proba: np.ndarray, y: np.ndarray) -> dict:
    flagged = proba >= FLAG_THRESHOLD
    out = {}
    for name, groups in {"gender": df_test["gender"], "age_band": age_band(df_test["age"])}.items():
        rows = {}
        for g in groups.unique():
            m = (groups == g).values
            pos = y[m] == 1
            rows[str(g)] = {
                "n": int(m.sum()),
                "flag_rate": round(float(flagged[m].mean()), 3),
                "actual_no_show_rate": round(float(y[m].mean()), 3),
                "true_positive_rate": round(float(flagged[m][pos].mean()), 3) if pos.any() else None,
            }
        rates = [r["flag_rate"] for r in rows.values()]
        tprs = [r["true_positive_rate"] for r in rows.values() if r["true_positive_rate"] is not None]
        out[name] = {
            "groups": rows,
            "demographic_parity_gap": round(max(rates) - min(rates), 3),
            "equal_opportunity_gap": round(max(tprs) - min(tprs), 3),
        }
    out["max_allowed_parity_gap"] = 0.05
    out["passed"] = bool(all(out[k]["demographic_parity_gap"] <= 0.05 for k in ("gender", "age_band")))
    return out


def train(df: pd.DataFrame) -> dict:
    X, y = build_features(df), df["no_show"].values
    idx_tr, idx_te = train_test_split(np.arange(len(df)), test_size=0.2, random_state=SEED, stratify=y)
    X_tr, X_te, y_tr, y_te = X.iloc[idx_tr], X.iloc[idx_te], y[idx_tr], y[idx_te]

    candidates = {
        # No class re-weighting: probabilities stay calibrated so they can drive overbooking.
        "RandomForest": RandomForestClassifier(n_estimators=300, max_depth=10, min_samples_leaf=20,
                                               random_state=SEED, n_jobs=1),
        "XGBoost": XGBClassifier(n_estimators=300, max_depth=4, learning_rate=0.05, subsample=0.9,
                                 random_state=SEED),
    }
    report, probas = {"no_show": {}}, {}
    for name, model in candidates.items():
        model.fit(X_tr, y_tr)
        p = model.predict_proba(X_te)[:, 1]
        probas[name] = p
        pred = (p >= FLAG_THRESHOLD).astype(int)
        report["no_show"][name] = {
            "ROC_AUC": round(roc_auc_score(y_te, p), 3), "accuracy": round(accuracy_score(y_te, pred), 3),
            "precision": round(precision_score(y_te, pred), 3), "recall": round(recall_score(y_te, pred), 3),
            "F1": round(f1_score(y_te, pred), 3),
        }
    best = max(candidates, key=lambda n: report["no_show"][n]["ROC_AUC"])
    report["no_show"]["selected"] = best
    report["fairness"] = fairness_audit(df.iloc[idx_te], probas[best], y_te)
    importances = pd.Series(candidates[best].feature_importances_, index=X.columns).sort_values(ascending=False)
    # Ablation: how much predictive power would adding age buy, and at what fairness cost?
    X_age = X.assign(age=df["age"].values)
    with_age = RandomForestClassifier(n_estimators=300, max_depth=10, min_samples_leaf=20, random_state=SEED, n_jobs=1)
    with_age.fit(X_age.iloc[idx_tr], y_tr)
    p_age = with_age.predict_proba(X_age.iloc[idx_te])[:, 1]
    report["age_ablation"] = {
        "ROC_AUC_without_age": report["no_show"]["RandomForest"]["ROC_AUC"],
        "ROC_AUC_with_age": round(roc_auc_score(y_te, p_age), 3),
        "age_parity_gap_with_age": fairness_audit(df.iloc[idx_te], p_age, y_te)["age_band"]["demographic_parity_gap"],
    }
    report["no_show"]["top_features"] = {k: round(float(v), 3) for k, v in importances.head(6).items()}

    # Duration: train only on attended visits (a no-show has no real consultation).
    att = df["no_show"].values == 0
    Xd, yd = X[att], df.loc[att, "duration_min"].values
    Xd_tr, Xd_te, yd_tr, yd_te = train_test_split(Xd, yd, test_size=0.2, random_state=SEED)
    reg_candidates = {
        "RandomForest": RandomForestRegressor(n_estimators=200, max_depth=12, min_samples_leaf=10, random_state=SEED, n_jobs=1),
        "XGBoost": XGBRegressor(n_estimators=400, max_depth=4, learning_rate=0.05, random_state=SEED),
    }
    report["duration"] = {}
    for name, model in reg_candidates.items():
        model.fit(Xd_tr, yd_tr)
        pred = model.predict(Xd_te)
        report["duration"][name] = {"MAE_min": round(mean_absolute_error(yd_te, pred), 2), "R2": round(r2_score(yd_te, pred), 3)}
    # Baseline: every visit gets its department's fixed slot length (what a static system assumes).
    dept_of_test = Xd_te[DEPT_COLS].values.argmax(axis=1)
    fixed = np.array([list(DEPARTMENTS.values())[i]["base_minutes"] for i in dept_of_test]) + 5
    report["duration"]["FixedSlotBaseline"] = {"MAE_min": round(mean_absolute_error(yd_te, fixed), 2), "R2": round(r2_score(yd_te, fixed), 3)}
    best_reg = min(reg_candidates, key=lambda n: report["duration"][n]["MAE_min"])
    report["duration"]["selected"] = best_reg

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump({"no_show": candidates[best], "duration": reg_candidates[best_reg]}, ARTIFACT_DIR / "appointment_models.joblib")
    return report


class AppointmentPredictor:
    def __init__(self):
        models = joblib.load(ARTIFACT_DIR / "appointment_models.joblib")
        self.no_show, self.duration = models["no_show"], models["duration"]

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        X = build_features(df)
        out = df.copy()
        out["no_show_prob"] = self.no_show.predict_proba(X)[:, 1].round(3)
        out["predicted_duration"] = self.duration.predict(X).round(1)
        out["high_risk"] = out["no_show_prob"] >= FLAG_THRESHOLD
        return out
