"""Synthetic but realistic hospital datasets.

Real patient-level hospital data is not publicly available, so we simulate data
with known, realistic structure (daily/weekly/seasonal cycles, surge events,
behavioural no-show drivers). The models never see the generating formulas,
only the resulting rows.
"""
import numpy as np
import pandas as pd

from .config import DATA_DIR, DEPARTMENTS, SEED, UNITS


def generate_bed_census(days: int = 730, seed: int = SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    idx = pd.date_range("2024-01-01", periods=days * 24, freq="h")
    hour, dow, doy = idx.hour.values, idx.dayofweek.values, idx.dayofyear.values

    # Shared surge events (epidemics, mass-casualty) that hit all units.
    surge = np.zeros(len(idx))
    for start in rng.choice(len(idx) - 200, size=days // 45, replace=False):
        magnitude, decay = rng.uniform(0.08, 0.25), rng.uniform(24, 96)
        span = np.arange(len(idx) - start)
        surge[start:] += magnitude * np.exp(-span / decay)

    winter = np.cos(2 * np.pi * (doy - 15) / 365)  # peaks mid-January (flu season)
    frames = {"timestamp": idx}
    profiles = {
        # base occupancy fraction, daily amplitude, weekday effect, seasonal amplitude
        "ICU": (0.72, 0.03, 0.02, 0.06),
        "GENERAL": (0.70, 0.06, 0.08, 0.07),
        "EMERGENCY": (0.55, 0.22, 0.05, 0.08),
    }
    for unit, (base, daily, weekly, seasonal) in profiles.items():
        beds = UNITS[unit]["beds"]
        daily_cycle = daily * np.sin(2 * np.pi * (hour - 9) / 24)  # ED peaks early afternoon
        weekday = weekly * np.where(dow < 5, 1.0, -1.2)
        noise = np.zeros(len(idx))
        for t in range(1, len(idx)):  # AR(1) noise gives realistic persistence
            noise[t] = 0.92 * noise[t - 1] + rng.normal(0, 0.012)
        frac = base + daily_cycle + weekday + seasonal * winter + surge * (1.4 if unit == "EMERGENCY" else 1) + noise
        frames[unit] = np.clip(np.round(frac * beds), 0, beds * 1.3).astype(int)  # can exceed beds (corridor overflow)

    return pd.DataFrame(frames)


def generate_appointments(n: int = 40000, seed: int = SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed + 1)
    depts = list(DEPARTMENTS)
    df = pd.DataFrame({
        "department": rng.choice(depts, n, p=[0.35, 0.18, 0.18, 0.17, 0.12]),
        "age": np.clip(rng.gamma(4.0, 11.0, n), 1, 95).astype(int),
        "gender": rng.choice(["F", "M"], n),
        "lead_days": rng.geometric(0.12, n) - 1,
        "sms_reminder": rng.random(n) < 0.6,
        "first_visit": rng.random(n) < 0.3,
        "prior_appointments": rng.poisson(4, n),
        "distance_km": np.round(rng.gamma(2.0, 4.0, n), 1),
        "chronic_conditions": rng.poisson(0.8, n),
        "weekday": rng.integers(0, 6, n),                    # Mon-Sat
        "slot_hour": rng.integers(9, 17, n),
        "insurance": rng.random(n) < 0.55,
    })
    pediatric = df["department"] == "Pediatrics"
    df.loc[pediatric, "age"] = rng.integers(1, 16, pediatric.sum())
    df.loc[df["first_visit"], "prior_appointments"] = 0
    df["prior_no_shows"] = rng.binomial(df["prior_appointments"], 0.18)

    # No-show behaviour. Gender deliberately has no effect (checked by the fairness audit).
    prior_rate = df["prior_no_shows"] / df["prior_appointments"].clip(lower=1)
    logit = (
        -2.1 + 0.035 * df["lead_days"] - 0.6 * df["sms_reminder"] + 2.4 * prior_rate
        + 0.35 * df["age"].between(18, 35) - 0.3 * (df["age"] > 60) + 0.03 * df["distance_km"]
        + 0.25 * (df["weekday"] == 0) + 0.2 * (df["slot_hour"] <= 9) - 0.25 * df["insurance"]
        + 0.3 * df["first_visit"] + rng.normal(0, 0.4, n)
    )
    df["no_show"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)

    # Consultation duration (only meaningful for attended visits, generated for all).
    base = df["department"].map({d: v["base_minutes"] for d, v in DEPARTMENTS.items()})
    minutes = (
        base + 7 * df["first_visit"] + 4 * (df["age"] > 65) + 2.5 * df["chronic_conditions"]
        - 1.5 * (df["slot_hour"] >= 15)  # end-of-day visits run shorter
    ) * rng.lognormal(0, 0.18, n)
    df["duration_min"] = np.round(minutes.clip(5, 60), 1)
    return df


def generate_all() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    generate_bed_census().to_csv(DATA_DIR / "bed_census.csv", index=False)
    generate_appointments().to_csv(DATA_DIR / "appointments.csv", index=False)
