"""What-if scenario simulation: stress the forecast, shrink capacity, re-optimize, compare."""
from .config import FORECAST_HORIZONS, UNITS
from .optimization import DEFAULT_POOLS, allocate_resources

PRESETS = {
    "MASS_CASUALTY": {"label": "Mass casualty incident", "arrival_increase_pct": {"EMERGENCY": 80, "ICU": 30, "GENERAL": 10},
                      "icu_beds_offline": 0, "nurse_shortage_pct": 0},
    "FLU_SURGE": {"label": "Winter viral surge", "arrival_increase_pct": {"EMERGENCY": 25, "ICU": 20, "GENERAL": 25},
                  "icu_beds_offline": 0, "nurse_shortage_pct": 10},
    "STAFF_SHORTAGE": {"label": "Nurse staff shortage", "arrival_increase_pct": {"EMERGENCY": 0, "ICU": 0, "GENERAL": 0},
                       "icu_beds_offline": 0, "nurse_shortage_pct": 25},
    "ICU_OUTAGE": {"label": "ICU wing power failure", "arrival_increase_pct": {"EMERGENCY": 0, "ICU": 0, "GENERAL": 0},
                   "icu_beds_offline": 10, "nurse_shortage_pct": 0},
}


def run_scenario(forecasts: dict, arrival_increase_pct: dict, icu_beds_offline: int = 0,
                 nurse_shortage_pct: float = 0, use_solver: bool = True) -> dict:
    beds = {u: v["beds"] for u, v in UNITS.items()}
    beds_s = {**beds, "ICU": max(0, beds["ICU"] - icu_beds_offline)}
    nurses = {u: v["nurses"] for u, v in UNITS.items()}
    nurses_s = {u: int(round(n * (1 - nurse_shortage_pct / 100))) for u, n in nurses.items()}
    pools_s = {"float_nurses": int(round(DEFAULT_POOLS["float_nurses"] * (1 - nurse_shortage_pct / 100)))}

    trajectory, bottlenecks = {}, {}
    peak_base, peak_scen = {}, {}
    for u in UNITS:
        mult = 1 + arrival_increase_pct.get(u, 0) / 100
        # The event starts now: hour 0 is the observed census; the multiplier applies to future demand.
        points = [{"horizon_h": 0, "baseline": forecasts[u]["current"], "scenario": forecasts[u]["current"]}]
        points += [{"horizon_h": p["horizon_h"], "baseline": p["ensemble"], "scenario": round(p["ensemble"] * mult, 1)}
                   for p in forecasts[u]["forecast"]]
        trajectory[u] = {"staffed_beds_baseline": beds[u], "staffed_beds_scenario": beds_s[u], "points": points}
        breach = next((p["horizon_h"] for p in points if p["scenario"] > beds_s[u]), None)
        bottlenecks[u] = {"breaches_capacity": breach is not None, "first_breach_in_h": breach}
        peak_base[u] = max(p["baseline"] for p in points)
        peak_scen[u] = max(p["scenario"] for p in points)

    baseline = allocate_resources(peak_base, beds, nurses, use_solver=use_solver)
    scenario = allocate_resources(peak_scen, beds_s, nurses_s, pools=pools_s, use_solver=use_solver)
    delta = {u: {
        "extra_surge_beds": scenario["units"][u]["surge_beds"] - baseline["units"][u]["surge_beds"],
        "extra_nurses": (scenario["units"][u]["float_nurses"] + scenario["units"][u]["overtime_nurses"])
                        - (baseline["units"][u]["float_nurses"] + baseline["units"][u]["overtime_nurses"]),
        "unmet_beds": scenario["units"][u]["unmet_beds"],
        "ratio_compliant": scenario["units"][u]["ratio_compliant"],
    } for u in UNITS}
    return {"horizons": [0] + FORECAST_HORIZONS, "trajectory": trajectory, "bottlenecks": bottlenecks,
            "baseline": baseline, "scenario": scenario, "delta": delta}
