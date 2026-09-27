# Implementation plan: Decision-Aware Uncertainty Engine

Status: **ready to implement**. Architecture is fixed by this document; implement it as written.
Branch: `feature/decision-aware-uncertainty`. **Never commit to or merge into `main`.**

## 1. What the feature is (one paragraph)

Forecasting papers judge a model by its error; IntelliCare also judges it by the cost of the decisions it
produces. The engine (a) builds **split-conformal prediction intervals** from out-of-sample errors,
(b) lets the resource optimizer plan at a chosen **risk level** (a quantile of demand), (c) **replays the
optimizer over held-out days** for every forecasting model × risk level and scores each plan against what
actually happened, and (d) reports **decision regret** versus a perfect-foresight plan and recommends the
lowest-regret model + risk level.

### Claims already printed in the review deck: these MUST be true when you finish

- Conformal prediction ranges at **50%, 80%, 90%, 95%**, built from real out-of-sample errors and
  **verified on separate held-out days**.
- The optimizer **plans for a chosen case**, e.g. "the 90% case".
- **Every model (Persistence, XGBoost, LSTM, Ensemble) at every risk level** is replayed on held-out days and
  scored on **patients without a bed, nurse-ratio breaches, overtime, idle beds**.
- Each plan is compared with a **perfect-foresight plan**; the **lowest-regret setting becomes IntelliCare's
  recommendation**.
- The engine is part of the Python intelligence service and visible in the app.

## 2. Hard constraints

1. **Do not change model training or the headline metrics.** `app/forecasting.py` training logic,
   `app/appointments.py`, the data generator and `app/config.py` stay as they are. The forecasting MAE/MAPE
   numbers in `ml-service/reports/metrics.json` are quoted in the deck.
2. **Do not commit regenerated reports.** Model artifacts are gitignored, so you must run `train.py` in your
   environment to get models, but PyTorch on a different machine can produce slightly different numbers.
   Before every commit run
   `git restore ml-service/reports/metrics.json ml-service/reports/metrics.md` and do **not** add
   `ml-service/reports/decision_backtest.json`. The maintainer regenerates reports on the reference machine.
3. Everything must be **deterministic**: same inputs → same outputs (no unseeded randomness; SCIP is
   deterministic).
4. Keep the existing code style: small typed functions, short docstrings, no new heavy dependencies
   (numpy/pandas/scikit-learn/ortools/torch/xgboost are already available). `pytest` may be added as a
   **dev** dependency.
5. Do not change the resource-optimizer objective or constraints in `app/optimization.py`.

## 3. Data windows (use exactly these)

`app/forecasting.py` already defines the held-out test period:
`n = len(census)`, `max_h = 24`, `split = n - TEST_HOURS - max_h` with `TEST_HOURS = 1440`.
Forecast **origins** are hours `t` with `split <= t < n - max_h` (1,440 origins); the target for horizon `h`
is `census[unit][t + h]`. Models never trained on these origins.

| Window | Origins | Purpose |
|---|---|---|
| Calibration | `split <= t < split + 720` (first 30 days) | conformal residual quantiles |
| Gap | next 24 origins | prevents calibration targets overlapping evaluation targets |
| Evaluation | `split + 744 <= t < n - max_h` (696 origins) | coverage check + decision backtest |
| Decision points | evaluation origins where `timestamp.hour % 6 == 0` | optimizer replays (~116 points) |

## 4. Backend: new module `ml-service/app/uncertainty.py`

### 4.1 Held-out predictions

`holdout_predictions(df) -> dict[unit][horizon] -> DataFrame` with columns
`origin, timestamp, actual, persistence, xgboost, lstm, ensemble` for every origin in section 3.

- Load trained models exactly as `Forecaster.__init__` does (`xgb_{unit}.joblib`, `lstm_{unit}.pt`).
- **XGBoost:** `tabular_features(df, unit).iloc[origins]` → `models[h].predict(...)`.
- **LSTM:** `seq = _sequence_inputs(df, unit)`; windows `seq[t-LOOKBACK+1 : t+1]` for each origin, batched
  through the network in `eval()` + `torch.no_grad()`, multiplied by `UNITS[unit]["beds"]`. Output column
  `j` is horizon `FORECAST_HORIZONS[j]`.
- **Persistence:** `census[unit][t]`.
- **Ensemble:** mean of XGBoost and LSTM.

### 4.2 Split-conformal intervals

- Residual `r = actual - prediction` (signed) on the calibration window, per unit × horizon × model.
- Finite-sample quantile: `conformal_quantile(r, p) = np.quantile(r, min(1, ceil((m + 1) * p) / m), method="higher")`
  where `m = len(r)`.
- **Planning quantile** for risk level `τ ∈ {0.50, 0.80, 0.90, 0.95}`: `q_τ = conformal_quantile(r, τ)`;
  planned demand = `max(0, prediction + q_τ)` (one-sided: "plan for the τ case").
- **Two-sided interval** at level `α ∈ {0.50, 0.80, 0.90, 0.95}`:
  `[pred + q_{(1-α)/2}, pred + q_{(1+α)/2}]`.
- **Coverage check** on the evaluation window: empirical coverage and mean width per unit × horizon ×
  model × level.
- Save calibration quantiles to `artifacts/conformal.json`:
  `{unit: {horizon: {model: {"q": {"0.025": x, "0.05": x, "0.1": x, "0.25": x, "0.5": x, "0.75": x, "0.8": x, "0.9": x, "0.95": x, "0.975": x}}}}}`
  (horizon keys as strings).

### 4.3 Realized cost of a plan

`realized_cost(alloc_units: dict, actual: dict[unit, float], weights=DEFAULT_WEIGHTS) -> dict` where
`alloc_units` is the `units` field returned by `allocate_resources`. Per unit, with `d = actual[unit]`:

```
beds_total   = beds + surge_beds
unmet        = max(0, d - beds_total)                          # patients without a bed
bedded       = min(d, beds_total)
nurses_total = nurses + float_nurses + overtime_nurses
uncovered    = max(0, bedded - ratio * nurses_total)           # nurse-ratio breaches (patients)
idle         = max(0, surge_beds - max(0, d - beds))           # opened surge beds left empty
vent_need    = ceil(VENT_NEED[unit] * d)
vent_short   = max(0, vent_need - ventilators)
cost = w.unmet_demand*(unmet + vent_short) + w.ratio_violation*uncovered + w.overtime*overtime_nurses
       + w.transfer*(surge_beds + float_nurses) + w.idle*idle
```

Return totals across units: `cost, unmet, uncovered, overtime, idle, vent_short`. This is the same objective
the MILP minimises, evaluated against actual demand, so the **oracle plan** (optimizer run on the actual
demand) is optimal and **regret ≥ 0** (allow `-1e-6` tolerance).

### 4.4 Decision backtest

`run_backtest(df) -> dict`, for **every horizon** `h ∈ {2, 6, 12, 24}` and every decision point `t`:

- Oracle: `allocate_resources(actual demand at t+h)` → `oracle_cost`.
- For each model in `persistence, xgboost, lstm, ensemble` and each risk level
  `τ ∈ {"point", 0.50, 0.80, 0.90, 0.95}` (`"point"` = raw prediction without conformal adjustment):
  planned demand per unit (all three units solved jointly because pools are shared) →
  `allocate_resources(planned)` → `realized_cost(..., actual)` → `regret = cost - oracle_cost`.
- Record solver fallbacks (`method != "MILP_SCIP"`) in a counter; expected 0.
- Aggregate per (horizon, model, τ): mean regret, mean cost, mean per-decision `unmet`, `uncovered`,
  `overtime`, `idle`, plus the model's MAE on the evaluation window.
- **Recommendation** per horizon: `(model, τ)` with the lowest mean regret (tie-break: lower τ, then model
  order persistence < xgboost < lstm < ensemble). The **headline recommendation uses horizon 12**.
- Report `accuracy_rank` (by MAE) vs `decision_rank` (by best-τ regret) per model at horizon 12. Do not
  assume they differ; just report both.

Runtime budget: about 116 decision points × 4 horizons × (4 models × 5 levels + oracle) ≈ 9,700 MILP solves
at ~10 ms each, i.e. a couple of minutes. Precompute; never run this per API request.

### 4.5 Output file `reports/decision_backtest.json`

```json
{
  "generated_at": "...",
  "windows": {"calibration": {"start": "...", "end": "...", "origins": 720},
              "evaluation": {"start": "...", "end": "...", "origins": 696},
              "decision_points": 116, "decision_every_h": 6},
  "levels": [0.5, 0.8, 0.9, 0.95],
  "models": ["persistence", "xgboost", "lstm", "ensemble"],
  "coverage": {"<unit>": {"<h>": {"<model>": {"0.5": {"coverage": 0.51, "mean_width": 3.1}, "...": {}}}}},
  "backtest": {"<h>": {"<model>": {"<tau|point>": {"regret": 0.0, "cost": 0.0, "unmet": 0.0, "uncovered": 0.0,
                                                  "overtime": 0.0, "idle": 0.0}}}},
  "mae": {"<h>": {"<model>": 0.0}},
  "ranking": {"12": {"accuracy_rank": ["..."], "decision_rank": ["..."]}},
  "recommended": {"12": {"model": "ensemble", "risk_level": 0.9, "regret": 0.0}, "2": {}, "6": {}, "24": {}},
  "solver_fallbacks": 0
}
```

(`<unit>` = ICU/GENERAL/EMERGENCY, `<h>` = "2"/"6"/"12"/"24"; the numbers above are illustrative only.)

### 4.6 Entry points

- `run_all(df)` in `uncertainty.py`: writes `artifacts/conformal.json` and `reports/decision_backtest.json`.
- New script `ml-service/backtest.py`: loads `data/bed_census.csv` and runs `run_all` using the existing trained
  models (no retraining). Print progress and total time.
- `train.py`: add step `4/4 decision-aware backtest` calling `run_all`, and append a short
  "Decision-aware uncertainty" section to `reports/metrics.md` (coverage at 90% per unit for horizon 12,
  regret table for horizon 12, recommendation).

## 5. Backend: wire into the running service

### 5.1 `Forecaster.forecast` (in `app/forecasting.py`, **inference only**)

- If `artifacts/conformal.json` exists, compute each point's `lower`/`upper` as the **ensemble 95%
  conformal interval** (quantiles 0.025 / 0.975) instead of `1.96 × residual std`. Keep the old code as a
  fallback when the file is missing.
- Add to each forecast point: `"quantiles": {"0.5": x, "0.8": x, "0.9": x, "0.95": x}` (ensemble planned
  demand at each risk level, clipped at 0) and `"interval_method": "conformal" | "gaussian"`.

### 5.2 `POST /optimize` (in `app/main.py`)

- Add optional request fields `risk_level: float | None` (one of 0.5, 0.8, 0.9, 0.95) and
  `use_recommended: bool = False`.
- Precedence: `use_recommended` (read `recommended[str(horizon_h)]` from the backtest report; uses
  its `risk_level` with ensemble quantiles) → `risk_level` → `conservative` (maps to 0.95) → point forecast.
- Response adds `"risk_level"` (number or null) and `"planning_basis"`
  (`"point" | "risk_level" | "recommended"`). Existing fields unchanged. Return 400 for an invalid
  `risk_level`; if `use_recommended` is set but no report exists, return 409 with a message telling the
  user to run `uv run python backtest.py`.

### 5.3 New endpoint

- `GET /uncertainty/report` returns `reports/decision_backtest.json`; 404 with message
  `"Run: uv run python backtest.py"` if missing. Load once at startup, and re-read if the file's mtime
  changes.

## 6. Frontend

Types in `src/types/ml.ts`, client in `src/services/mlApi.ts` (`uncertaintyReport()`, and extend
`optimize` with `risk_level?` and `use_recommended?`). Reuse existing components (`PageHeader`, `Stat`,
`MLStatus`, `Card`, `Badge`, Recharts, `chartTheme`), and match the existing page style.

1. **Model Evaluation page (`src/pages/app/MLStudioPage.tsx`)**: new section at the top,
   "Decision-Aware Uncertainty Engine", with a horizon selector (2/6/12/24, default 12):
   - **Recommendation callout:** "Recommended: plan at the {τ×100}% level using {Model}" plus its mean
     regret, and the accuracy rank vs decision rank.
   - **Regret chart:** grouped bars, x = risk level (point, 50, 80, 90, 95), one bar per model, y = mean
     regret. Lower is better.
   - **Trade-off chart** for the recommended model: x = risk level, two lines: "patients without a bed per
     decision" and "idle surge beds per decision".
   - **Coverage table:** nominal level vs empirical coverage and mean width for the ensemble, per unit.
   - One sentence of explanation above the charts (plain language; see section 1).
   - If the report is missing, show `MLStatus` with the 404 message.
2. **Optimization page (`src/pages/app/OptimizationPage.tsx`)**: replace the "Plan for worst case"
   checkbox with a **risk-level selector**: `Recommended` (default when the report exists, labelled e.g.
   "Recommended · 90%"), `Expected (point)`, `50%`, `80%`, `90%`, `95%`. Send `use_recommended` or
   `risk_level` accordingly. Update the allocation heading to show the basis actually used (from the response).
3. **Forecasting page (`src/pages/app/ForecastingPage.tsx`)**: interval legend label becomes
   "95% conformal interval" when `interval_method === "conformal"`, and update the subtitle to
   "…with 95% intervals calibrated by split conformal prediction on held-out days."

## 7. Tests: `ml-service/tests/test_uncertainty.py` (pytest, dev dependency)

Must run in under ~2 minutes; use small synthetic arrays or a subset of decision points where possible.

- `conformal_quantile` matches the finite-sample definition on a known array.
- Coverage of conformal intervals on exchangeable synthetic residuals is ≥ nominal − 0.05.
- `realized_cost` of a plan that exactly matches demand has `unmet == 0` and `uncovered == 0`.
- Oracle regret: for a handful of real decision points, every `regret >= -1e-6`.
- Determinism: running the backtest on the first 5 decision points twice gives identical results.
- API smoke tests with FastAPI `TestClient`: `/uncertainty/report` (200 when file exists), `/optimize` with
  `risk_level=0.9` and with `use_recommended=true` returns `planning_basis` as expected, and an invalid
  `risk_level` returns 400.

## 8. Definition of done

1. `cd ml-service && uv sync && uv run python train.py` succeeds and prints step 4/4. Afterwards
   `uv run python backtest.py` also runs standalone.
2. `uv run pytest -q` passes.
3. Frontend: `npx tsc --noEmit -p tsconfig.json` and `npx vite build` pass.
4. Every claim in section 1 is true in the running system.
5. `ml-service/README.md` gains a short "Decision-Aware Uncertainty Engine" section (what it does, how to
   run `backtest.py`, where results show in the app). Root `README.md`: add the engine to "The six
   engines" table as a seventh row, and remove nothing else.
6. Commits are small and conventional (`feat(ml): …`, `feat(app): …`, `test(ml): …`, `docs: …`), on
   `feature/decision-aware-uncertainty` only, pushed to `origin`. No generated reports committed
   (see section 2).
7. Final report back: what was built, test results, backtest headline (the recommendation and regret table
   for horizon 12 **from your environment**, labelled as such), anything deviating from this plan and why.
