# IntelliCare model evaluation

Generated: 2026-09-18T19:48:27

## Demand forecasting (test set: last 60 days, never seen in training)

### ICU

| Model | MAE 2h | MAE 6h | MAE 12h | MAE 24h | MAPE 2h | MAPE 6h | MAPE 12h | MAPE 24h |
|---|---|---|---|---|---|---|---|---|
| XGBoost | 0.647 | 0.946 | 1.146 | 1.177 | 2.06% | 2.99% | 3.6% | 3.68% |
| LSTM | 0.998 | 1.063 | 1.116 | 1.206 | 3.11% | 3.32% | 3.49% | 3.78% |
| Persistence | 0.721 | 1.497 | 2.065 | 1.683 | 2.32% | 4.82% | 6.64% | 5.38% |

### GENERAL

| Model | MAE 2h | MAE 6h | MAE 12h | MAE 24h | MAPE 2h | MAPE 6h | MAPE 12h | MAPE 24h |
|---|---|---|---|---|---|---|---|---|
| XGBoost | 3.142 | 4.776 | 5.735 | 6.01 | 2.05% | 3.1% | 3.72% | 3.86% |
| LSTM | 5.302 | 5.624 | 5.657 | 6.333 | 3.4% | 3.61% | 3.64% | 4.07% |
| Persistence | 5.451 | 13.444 | 18.979 | 15.422 | 3.62% | 8.99% | 12.71% | 10.24% |

### EMERGENCY

| Model | MAE 2h | MAE 6h | MAE 12h | MAE 24h | MAPE 2h | MAPE 6h | MAPE 12h | MAPE 24h |
|---|---|---|---|---|---|---|---|---|
| XGBoost | 0.815 | 1.22 | 1.491 | 1.65 | 2.79% | 4.15% | 4.96% | 5.41% |
| LSTM | 1.279 | 1.3 | 1.48 | 1.57 | 4.27% | 4.47% | 4.97% | 5.05% |
| Persistence | 3.707 | 9.935 | 14.105 | 2.926 | 12.5% | 34.2% | 49.67% | 9.91% |

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
