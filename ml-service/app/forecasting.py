"""Multi-horizon bed-demand forecasting: XGBoost (direct, per horizon) vs LSTM (multi-output).

Both are compared against a naive persistence baseline ("occupancy stays the same")
on the last 60 days, which are never seen during training.
"""
import json

import joblib
import numpy as np
import pandas as pd
import torch
from torch import nn
from xgboost import XGBRegressor

from .config import ARTIFACT_DIR, FORECAST_HORIZONS, LOOKBACK, SEED, UNITS

TEST_HOURS = 60 * 24
LAGS = [1, 2, 3, 6, 12, 24, 48, 168]


def _calendar(ts: pd.Series) -> pd.DataFrame:
    return pd.DataFrame({
        "hour_sin": np.sin(2 * np.pi * ts.dt.hour / 24), "hour_cos": np.cos(2 * np.pi * ts.dt.hour / 24),
        "dow_sin": np.sin(2 * np.pi * ts.dt.dayofweek / 7), "dow_cos": np.cos(2 * np.pi * ts.dt.dayofweek / 7),
        "doy_sin": np.sin(2 * np.pi * ts.dt.dayofyear / 365), "doy_cos": np.cos(2 * np.pi * ts.dt.dayofyear / 365),
        "weekend": (ts.dt.dayofweek >= 5).astype(int),
    }, index=ts.index)


def tabular_features(df: pd.DataFrame, unit: str) -> pd.DataFrame:
    s = df[unit]
    feats = _calendar(df["timestamp"])
    for lag in LAGS:
        feats[f"lag_{lag}"] = s.shift(lag - 1)  # lag_1 = current observed value
    feats["roll_mean_24"] = s.rolling(24).mean()
    feats["roll_std_24"] = s.rolling(24).std()
    feats["diff_24"] = s - s.shift(24)
    return feats


def metrics(y_true, y_pred) -> dict:
    y_true, y_pred = np.asarray(y_true, float), np.asarray(y_pred, float)
    err = y_pred - y_true
    return {
        "MAE": round(float(np.mean(np.abs(err))), 3),
        "RMSE": round(float(np.sqrt(np.mean(err ** 2))), 3),
        "MAPE": round(float(np.mean(np.abs(err) / np.maximum(y_true, 1)) * 100), 2),
    }


class LSTMForecaster(nn.Module):
    def __init__(self, n_features: int, n_outputs: int, hidden: int = 64):
        super().__init__()
        self.lstm = nn.LSTM(n_features, hidden, num_layers=2, batch_first=True, dropout=0.1)
        self.head = nn.Sequential(nn.Linear(hidden, 32), nn.ReLU(), nn.Linear(32, n_outputs))

    def forward(self, x):
        out, _ = self.lstm(x)
        return self.head(out[:, -1])


def _sequence_inputs(df: pd.DataFrame, unit: str) -> np.ndarray:
    scale = UNITS[unit]["beds"]
    cal = _calendar(df["timestamp"])[["hour_sin", "hour_cos", "dow_sin", "dow_cos", "doy_sin", "doy_cos"]]
    return np.column_stack([df[unit].values / scale, cal.values]).astype(np.float32)


def _windows(seq: np.ndarray, target: np.ndarray, ends: np.ndarray):
    X = np.stack([seq[e - LOOKBACK + 1: e + 1] for e in ends])
    y = np.stack([[target[e + h] for h in FORECAST_HORIZONS] for e in ends])
    return X, y.astype(np.float32)


def train_unit(df: pd.DataFrame, unit: str, lstm_epochs: int = 12) -> dict:
    n, scale, max_h = len(df), UNITS[unit]["beds"], max(FORECAST_HORIZONS)
    split = n - TEST_HOURS - max_h
    y_all = df[unit].values.astype(float)
    report = {"XGBoost": {}, "LSTM": {}, "Persistence": {}}
    residual_std = {"XGBoost": {}, "LSTM": {}}

    # ---- XGBoost: one direct model per horizon ----
    feats = tabular_features(df, unit)
    xgb_models = {}
    for h in FORECAST_HORIZONS:
        target = pd.Series(y_all).shift(-h)
        valid = feats.notna().all(axis=1) & target.notna()
        train_idx = valid & (feats.index < split)
        test_idx = valid & (feats.index >= split)
        model = XGBRegressor(n_estimators=400, max_depth=5, learning_rate=0.05, subsample=0.9,
                             colsample_bytree=0.9, random_state=SEED)
        model.fit(feats[train_idx], target[train_idx])
        pred = model.predict(feats[test_idx])
        report["XGBoost"][f"{h}h"] = metrics(target[test_idx], pred)
        report["Persistence"][f"{h}h"] = metrics(target[test_idx], feats.loc[test_idx, "lag_1"])
        residual_std["XGBoost"][h] = float(np.std(pred - target[test_idx]))
        xgb_models[h] = model

    # ---- LSTM: one multi-output network for all horizons ----
    torch.manual_seed(SEED)
    seq = _sequence_inputs(df, unit)
    tgt = (y_all / scale).astype(np.float32)
    ends = np.arange(max(LOOKBACK, 168), n - max_h)
    X_tr, y_tr = _windows(seq, tgt, ends[ends < split])
    X_te, y_te = _windows(seq, tgt, ends[ends >= split])
    net = LSTMForecaster(seq.shape[1], len(FORECAST_HORIZONS))
    opt = torch.optim.Adam(net.parameters(), lr=2e-3)
    loss_fn = nn.MSELoss()
    X_tr_t, y_tr_t = torch.from_numpy(X_tr), torch.from_numpy(y_tr)
    for _ in range(lstm_epochs):
        net.train()
        perm = torch.randperm(len(X_tr_t))
        for b in range(0, len(perm), 256):
            i = perm[b:b + 256]
            opt.zero_grad()
            loss = loss_fn(net(X_tr_t[i]), y_tr_t[i])
            loss.backward()
            opt.step()
    net.eval()
    with torch.no_grad():
        pred = net(torch.from_numpy(X_te)).numpy() * scale
    truth = y_te * scale
    for j, h in enumerate(FORECAST_HORIZONS):
        report["LSTM"][f"{h}h"] = metrics(truth[:, j], pred[:, j])
        residual_std["LSTM"][h] = float(np.std(pred[:, j] - truth[:, j]))

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(xgb_models, ARTIFACT_DIR / f"xgb_{unit}.joblib")
    torch.save(net.state_dict(), ARTIFACT_DIR / f"lstm_{unit}.pt")
    return {"metrics": report, "residual_std": residual_std}


def train_all(df: pd.DataFrame) -> dict:
    results = {unit: train_unit(df, unit) for unit in UNITS}
    with open(ARTIFACT_DIR / "forecast_residuals.json", "w") as f:
        json.dump({u: r["residual_std"] for u, r in results.items()}, f)
    return {u: r["metrics"] for u, r in results.items()}


class Forecaster:
    """Loads trained models and forecasts from the latest observed hour."""

    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.xgb = {u: joblib.load(ARTIFACT_DIR / f"xgb_{u}.joblib") for u in UNITS}
        self.lstm = {}
        for u in UNITS:
            net = LSTMForecaster(7, len(FORECAST_HORIZONS))
            net.load_state_dict(torch.load(ARTIFACT_DIR / f"lstm_{u}.pt"))
            net.eval()
            self.lstm[u] = net
        with open(ARTIFACT_DIR / "forecast_residuals.json") as f:
            self.residuals = json.load(f)

    def forecast(self, unit: str) -> dict:
        df, scale = self.df, UNITS[unit]["beds"]
        latest = tabular_features(df, unit).iloc[[-1]]
        with torch.no_grad():
            window = torch.from_numpy(_sequence_inputs(df, unit)[-LOOKBACK:][None])
            lstm_pred = self.lstm[unit](window).numpy()[0] * scale
        now = df["timestamp"].iloc[-1]
        points = []
        for j, h in enumerate(FORECAST_HORIZONS):
            xgb_val = float(self.xgb[unit][h].predict(latest)[0])
            lstm_val = float(lstm_pred[j])
            ensemble = (xgb_val + lstm_val) / 2
            band = 1.96 * (self.residuals[unit]["XGBoost"][str(h)] + self.residuals[unit]["LSTM"][str(h)]) / 2
            points.append({
                "horizon_h": h,
                "timestamp": (now + pd.Timedelta(hours=h)).isoformat(),
                "xgboost": round(xgb_val, 1),
                "lstm": round(lstm_val, 1),
                "ensemble": round(ensemble, 1),
                "lower": round(ensemble - band, 1),
                "upper": round(ensemble + band, 1),
            })
        history = df[["timestamp", unit]].tail(48)
        return {
            "unit": unit,
            "capacity": scale,
            "current": int(df[unit].iloc[-1]),
            "as_of": now.isoformat(),
            "history": [{"timestamp": t.isoformat(), "value": int(v)} for t, v in history.values],
            "forecast": points,
        }
