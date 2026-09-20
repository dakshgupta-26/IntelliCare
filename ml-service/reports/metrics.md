# IntelliCare model evaluation

Generated: 2026-09-20T16:31:20

## Demand forecasting (test set: last 60 days, never seen in training)

### ICU

| Model | MAE 2h | MAE 6h | MAE 12h | MAE 24h | MAPE 2h | MAPE 6h | MAPE 12h | MAPE 24h |
|---|---|---|---|---|---|---|---|---|
| XGBoost | 1.822 | 2.805 | 3.356 | 3.504 | 1.89% | 2.89% | 3.43% | 3.56% |
| LSTM | 3.034 | 3.245 | 3.377 | 3.643 | 3.07% | 3.28% | 3.43% | 3.7% |
| Persistence | 2.218 | 4.58 | 6.329 | 5.111 | 2.32% | 4.79% | 6.62% | 5.31% |

### GENERAL

| Model | MAE 2h | MAE 6h | MAE 12h | MAE 24h | MAPE 2h | MAPE 6h | MAPE 12h | MAPE 24h |
|---|---|---|---|---|---|---|---|---|
| XGBoost | 20.358 | 31.382 | 38.166 | 39.937 | 2.01% | 3.07% | 3.73% | 3.88% |
| LSTM | 35.589 | 37.907 | 37.741 | 42.765 | 3.44% | 3.67% | 3.67% | 4.16% |
| Persistence | 36.072 | 88.928 | 125.441 | 102.07 | 3.62% | 8.99% | 12.7% | 10.24% |

### EMERGENCY

| Model | MAE 2h | MAE 6h | MAE 12h | MAE 24h | MAPE 2h | MAPE 6h | MAPE 12h | MAPE 24h |
|---|---|---|---|---|---|---|---|---|
| XGBoost | 1.467 | 2.179 | 2.729 | 2.986 | 2.71% | 4.05% | 4.94% | 5.33% |
| LSTM | 2.27 | 2.424 | 2.715 | 2.923 | 4.11% | 4.51% | 4.95% | 5.11% |
| Persistence | 6.813 | 18.262 | 25.948 | 5.431 | 12.46% | 34.16% | 49.63% | 10.0% |

## No-show prediction (20% hold-out)

| Model | ROC-AUC | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|---|
| RandomForest | 0.674 | 0.753 | 0.369 | 0.389 | 0.379 |
| XGBoost | 0.673 | 0.748 | 0.357 | 0.378 | 0.367 |

Selected: **RandomForest**. Top features: prior_no_show_rate (0.238), lead_days (0.171), distance_km (0.133), sms_reminder (0.095), prior_no_shows (0.094), prior_appointments (0.069)

## Consultation duration (attended visits)

| Model | MAE (min) | R² |
|---|---|---|
| RandomForest | 2.89 | 0.655 |
| XGBoost | 2.84 | 0.666 |
| FixedSlotBaseline | 4.4 | 0.284 |

## Fairness audit (demographic parity of high-risk flags)

Gender parity gap: 0.003 · Age-band parity gap: 0.025 · Limit: 0.05 · **PASSED**

Ablation: adding age as a feature raises ROC-AUC from 0.674 to 0.683 but widens the age parity gap to 0.154, so age is excluded.
