"""Constraint-based optimization with Google OR-Tools.

1. allocate_resources: MILP that turns forecast bed demand into concrete actions
   (open surge beds, move float nurses, approve overtime, assign ventilators).
2. schedule_appointments: CP-SAT integer model that builds a conflict-free outpatient
   schedule using predicted consultation durations and no-show risk.

Each has a deterministic priority-rule fallback (Safety: fail-safe operation) used if
the solver errors, times out or is disabled.
"""
import math
import time

from ortools.linear_solver import pywraplp
from ortools.sat.python import cp_model

from .config import CLINIC_CLOSE_MIN, CLINIC_OPEN_MIN, DEPARTMENTS, UNITS

DEFAULT_POOLS = {
    "surge_beds": 30,        # flexible beds that can be opened in GENERAL or EMERGENCY
    "icu_convertible": 6,    # step-down beds that can be upgraded to ICU
    "float_nurses": 12,
    "overtime_cap": 4,       # max overtime nurses per unit per shift
    "ventilators": 26,
}
UNIT_LABEL = {"ICU": "ICU", "GENERAL": "General Ward", "EMERGENCY": "Emergency"}
STANDING_VENTILATORS = {"ICU": 18, "EMERGENCY": 3, "GENERAL": 0}  # routinely stationed; only extra moves are decisions
VENT_NEED = {"ICU": 0.45, "EMERGENCY": 0.08, "GENERAL": 0.0}  # ventilators per patient
DEFAULT_WEIGHTS = {"unmet_demand": 10.0, "ratio_violation": 8.0, "overtime": 2.0, "transfer": 1.0, "idle": 0.5}


def _n(count: int, noun: str) -> str:
    return f"{count} {noun}{'' if count == 1 else 's'}"


def _unit_inputs(demand: dict, beds: dict | None, nurses: dict | None):
    beds = beds or {u: v["beds"] for u, v in UNITS.items()}
    nurses = nurses or {u: v["nurses"] for u, v in UNITS.items()}
    return {u: {"demand": max(0.0, float(demand[u])), "beds": beds[u], "nurses": nurses[u],
                "ratio": UNITS[u]["ratio"], "vent_need": math.ceil(VENT_NEED[u] * demand[u])} for u in UNITS}


def _summarise(inputs, alloc, pools, method, status, solve_ms):
    units, recs = {}, []
    for u, d in inputs.items():
        a = alloc[u]
        beds_total = d["beds"] + a["surge_beds"]
        nurses_total = d["nurses"] + a["float_nurses"] + a["overtime_nurses"]
        served = min(d["demand"], beds_total)
        units[u] = {
            **{k: d[k] for k in ("demand", "beds", "nurses", "ratio")},
            **a,
            "beds_after": beds_total,
            "nurses_after": nurses_total,
            "unmet_beds": round(max(0.0, d["demand"] - beds_total), 1),
            "required_nurses": math.ceil(served / d["ratio"]),
            "ratio_compliant": nurses_total * d["ratio"] >= served - 1e-6,
            "occupancy_before": round(d["demand"] / d["beds"] * 100, 1),
            "occupancy_after": round(d["demand"] / beds_total * 100, 1),
            "ventilators_needed": d["vent_need"],
            "ventilator_shortfall": max(0, d["vent_need"] - a["ventilators"]),
        }
        name = UNIT_LABEL[u]
        if a["surge_beds"]:
            recs.append({"unit": u, "type": "BEDS", "quantity": a["surge_beds"],
                         "action": f"Open {_n(a['surge_beds'], 'surge bed')} in {name}",
                         "reason": f"Forecast demand {d['demand']:.0f} exceeds {d['beds']} staffed beds."})
        if a["float_nurses"]:
            recs.append({"unit": u, "type": "NURSES", "quantity": a["float_nurses"],
                         "action": f"Reassign {_n(a['float_nurses'], 'float nurse')} to {name}",
                         "reason": f"Maintain the 1:{d['ratio']} nurse-to-patient ratio for {served:.0f} patients."})
        if a["overtime_nurses"]:
            recs.append({"unit": u, "type": "OVERTIME", "quantity": a["overtime_nurses"],
                         "action": f"Approve overtime for {_n(a['overtime_nurses'], 'nurse')} in {name}",
                         "reason": "Float pool exhausted; overtime needed to keep the statutory ratio."})
        extra_vents = a["ventilators"] - STANDING_VENTILATORS[u]
        if extra_vents > 0:
            recs.append({"unit": u, "type": "EQUIPMENT", "quantity": extra_vents,
                         "action": f"Move {_n(extra_vents, 'ventilator')} from the central pool to {name}",
                         "reason": f"Expected ventilated patients: {d['vent_need']} (standing allocation {STANDING_VENTILATORS[u]})."})
        if units[u]["unmet_beds"] > 0:
            recs.append({"unit": u, "type": "ESCALATION", "quantity": math.ceil(units[u]["unmet_beds"]),
                         "action": f"Escalate: {_n(math.ceil(units[u]['unmet_beds']), 'patient')} in {name} cannot be bedded",
                         "reason": "All surge capacity used. Consider diversion or elective postponement."})
        if units[u]["ventilator_shortfall"]:
            recs.append({"unit": u, "type": "ESCALATION", "quantity": units[u]["ventilator_shortfall"],
                         "action": f"Escalate: {name} is short {_n(units[u]['ventilator_shortfall'], 'ventilator')}",
                         "reason": "Ventilator pool exhausted. Request transfer from partner facility."})
    used = {k: sum(alloc[u][k] for u in alloc) for k in ("surge_beds", "float_nurses", "overtime_nurses", "ventilators")}
    return {"method": method, "status": status, "solve_ms": solve_ms, "units": units,
            "recommendations": recs, "pools": pools, "pool_usage": used}


def _greedy_allocation(inputs, pools):
    """Deterministic priority rules: serve ICU first, then EMERGENCY, then GENERAL."""
    alloc = {u: {"surge_beds": 0, "float_nurses": 0, "overtime_nurses": 0, "ventilators": 0} for u in inputs}
    surge, icu_conv, floats, vents = pools["surge_beds"], pools["icu_convertible"], pools["float_nurses"], pools["ventilators"]
    for u in ["ICU", "EMERGENCY", "GENERAL"]:
        d = inputs[u]
        gap = max(0, math.ceil(d["demand"] - d["beds"]))
        take = min(gap, icu_conv if u == "ICU" else surge)
        alloc[u]["surge_beds"] = take
        if u == "ICU":
            icu_conv -= take
        else:
            surge -= take
        served = min(d["demand"], d["beds"] + take)
        need = max(0, math.ceil(served / d["ratio"]) - d["nurses"])
        alloc[u]["float_nurses"] = f = min(need, floats)
        floats -= f
        alloc[u]["overtime_nurses"] = min(need - f, pools["overtime_cap"])
        alloc[u]["ventilators"] = v = min(d["vent_need"], vents)
        vents -= v
    return alloc


def allocate_resources(demand: dict, beds: dict | None = None, nurses: dict | None = None,
                       pools: dict | None = None, weights: dict | None = None, use_solver: bool = True) -> dict:
    pools = {**DEFAULT_POOLS, **(pools or {})}
    w = {**DEFAULT_WEIGHTS, **(weights or {})}
    inputs = _unit_inputs(demand, beds, nurses)
    t0 = time.perf_counter()

    solver = pywraplp.Solver.CreateSolver("SCIP") if use_solver else None
    if solver is None:
        alloc = _greedy_allocation(inputs, pools)
        return _summarise(inputs, alloc, pools, "PRIORITY_RULES_FALLBACK", "FALLBACK",
                          round((time.perf_counter() - t0) * 1000, 1))

    inf = solver.infinity()
    s, f, o, v, U, N, I, V = ({} for _ in range(8))
    for u, d in inputs.items():
        s[u] = solver.IntVar(0, pools["icu_convertible"] if u == "ICU" else pools["surge_beds"], f"surge_{u}")
        f[u] = solver.IntVar(0, pools["float_nurses"], f"float_{u}")
        o[u] = solver.IntVar(0, pools["overtime_cap"], f"overtime_{u}")
        v[u] = solver.IntVar(0, pools["ventilators"], f"vent_{u}")
        U[u] = solver.NumVar(0, inf, f"unmet_{u}")      # patients without a bed
        N[u] = solver.NumVar(0, inf, f"uncovered_{u}")  # bedded patients beyond the nurse ratio
        I[u] = solver.NumVar(0, inf, f"idle_{u}")       # opened-but-unused surge beds
        V[u] = solver.NumVar(0, inf, f"vent_short_{u}")
        solver.Add(d["beds"] + s[u] + U[u] >= d["demand"])                                 # bed capacity
        solver.Add(d["ratio"] * (d["nurses"] + f[u] + o[u]) + N[u] >= d["demand"] - U[u])  # staffing ratio
        solver.Add(I[u] >= s[u] - (d["demand"] - d["beds"]))
        solver.Add(v[u] + V[u] >= d["vent_need"])
        solver.Add(v[u] <= d["vent_need"])  # don't park idle ventilators where they aren't needed
    # Resource conservation: shared pools cannot be over-allocated.
    solver.Add(sum(s[u] for u in inputs if u != "ICU") <= pools["surge_beds"])
    solver.Add(sum(f.values()) <= pools["float_nurses"])
    solver.Add(sum(v.values()) <= pools["ventilators"])

    solver.Minimize(sum(
        w["unmet_demand"] * (U[u] + V[u]) + w["ratio_violation"] * N[u] + w["overtime"] * o[u]
        + w["transfer"] * (s[u] + f[u]) + w["idle"] * I[u]
        for u in inputs
    ))
    solver.SetTimeLimit(5000)
    status = solver.Solve()
    solve_ms = round((time.perf_counter() - t0) * 1000, 1)
    if status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
        return _summarise(inputs, _greedy_allocation(inputs, pools), pools, "PRIORITY_RULES_FALLBACK", "SOLVER_FAILED", solve_ms)

    alloc = {u: {"surge_beds": int(round(s[u].solution_value())), "float_nurses": int(round(f[u].solution_value())),
                 "overtime_nurses": int(round(o[u].solution_value())), "ventilators": int(round(v[u].solution_value()))}
             for u in inputs}
    result = _summarise(inputs, alloc, pools, "MILP_SCIP",
                        "OPTIMAL" if status == pywraplp.Solver.OPTIMAL else "FEASIBLE", solve_ms)
    result["objective"] = round(solver.Objective().Value(), 2)
    result["weights"] = w
    return result


# --------------------------------------------------------------------------------------
# Appointment scheduling
# --------------------------------------------------------------------------------------
PRIORITY_WEIGHT = {"ROUTINE": 1, "URGENT": 4, "EMERGENCY": 50}
STABILITY_WEIGHT = 3        # per minute a confirmed booking is shifted
DOCTOR_CHANGE_PENALTY = 40  # for handing a booked patient to a different doctor
OVERBOOK_FACTOR = 0.6  # how aggressively high no-show risk shortens the reserved slot


def slot_length(predicted_duration: float, no_show_prob: float, priority: str = "ROUTINE") -> int:
    """Reserve the expected chair time, rounded up to 5 minutes. Emergencies are never compressed."""
    factor = 1.0 if priority == "EMERGENCY" else 1 - OVERBOOK_FACTOR * no_show_prob
    return max(5, int(math.ceil(predicted_duration * factor / 5) * 5))


def schedule_appointments(requests: list[dict], unavailable_doctors: set[str] = frozenset(),
                          time_limit_s: float = 3.0, use_solver: bool = True) -> dict:
    """requests: {id, department, requested_min, predicted_duration, no_show_prob, priority,
    fixed_doctor?, fixed_start?}. Returns assignments + unscheduled ids."""
    t0 = time.perf_counter()
    doctors = {d: [doc for doc in cfg["doctors"] if doc not in unavailable_doctors] for d, cfg in DEPARTMENTS.items()}
    if not use_solver:
        return _greedy_schedule(requests, doctors, t0)

    m = cp_model.CpModel()
    horizon = CLINIC_CLOSE_MIN + 60  # allow up to 1 hour overrun, penalised
    per_doctor, per_dept, vars_, stability = {}, {}, {}, []
    for r in requests:
        dur = slot_length(r["predicted_duration"], r["no_show_prob"], r["priority"])
        earliest = max(CLINIC_OPEN_MIN, r["requested_min"])
        start = m.NewIntVar(earliest, horizon - dur, f"s_{r['id']}")
        end = m.NewIntVar(earliest + dur, horizon, f"e_{r['id']}")
        choices = {}
        for doc in doctors[r["department"]]:
            if r.get("fixed_doctor") and doc != r["fixed_doctor"]:
                continue
            lit = m.NewBoolVar(f"x_{r['id']}_{doc}")
            choices[doc] = lit
            per_doctor.setdefault(doc, []).append(m.NewOptionalIntervalVar(start, dur, end, lit, f"i_{r['id']}_{doc}"))
        scheduled = m.NewBoolVar(f"sched_{r['id']}")
        m.Add(sum(choices.values()) == scheduled)
        if r.get("fixed_start") is not None:
            m.Add(start == r["fixed_start"])
            m.Add(scheduled == 1)
        room_iv = m.NewOptionalIntervalVar(start, dur, end, scheduled, f"room_{r['id']}")
        per_dept.setdefault(r["department"], []).append(room_iv)
        overrun = m.NewIntVar(0, 60, f"over_{r['id']}")
        m.Add(overrun >= end - CLINIC_CLOSE_MIN)
        vars_[r["id"]] = (r, start, choices, scheduled, dur, overrun)
        # Minimal-disruption rescheduling: penalise moving an existing booking.
        if r.get("prev_start") is not None:
            shift = m.NewIntVar(0, horizon, f"shift_{r['id']}")
            m.AddAbsEquality(shift, start - r["prev_start"])
            stability.append(STABILITY_WEIGHT * shift)
            if r.get("prev_doctor") in choices:
                stability.append(DOCTOR_CHANGE_PENALTY * (1 - choices[r["prev_doctor"]]))

    for ivs in per_doctor.values():
        m.AddNoOverlap(ivs)                      # a doctor sees one patient at a time
    for dept, ivs in per_dept.items():           # concurrent consultations <= rooms in department
        m.AddCumulative(ivs, [1] * len(ivs), DEPARTMENTS[dept]["rooms"])

    obj = []
    for r, start, _, scheduled, _, overrun in vars_.values():
        w = PRIORITY_WEIGHT[r["priority"]]
        # Dropping an already-confirmed booking is far worse than not admitting a waitlisted one.
        drop_penalty = 1000 * w * (4 if r.get("prev_start") is not None else 1)
        obj += [w * (start - r["requested_min"]), drop_penalty * (1 - scheduled), 5 * overrun]
    m.Minimize(sum(obj) + sum(stability))

    # Warm start. Fresh schedule: hint the rule-based plan. Rescheduling: hint the previous
    # plan exactly (previously waitlisted patients stay waitlisted) so the solver only improves on it.
    rescheduling = any(r.get("prev_start") is not None for r in requests)
    if rescheduling:
        hint = {r["id"]: {"doctor": r["prev_doctor"], "start_min": r["prev_start"]}
                for r in requests if r.get("prev_start") is not None}
        hint.update({r["id"]: {"doctor": r["fixed_doctor"], "start_min": r["fixed_start"]}
                     for r in requests if r.get("fixed_start") is not None})
    else:
        hint = {a["id"]: a for a in _greedy_schedule(requests, doctors, t0)["assignments"]}
    for rid, (r, start, choices, scheduled, _, _) in vars_.items():
        h = hint.get(rid)
        if h and h["doctor"] in choices:
            m.AddHint(start, h["start_min"])
            m.AddHint(scheduled, 1)
            for doc, lit in choices.items():
                m.AddHint(lit, doc == h["doctor"])
        else:
            m.AddHint(scheduled, 0)
            for lit in choices.values():
                m.AddHint(lit, 0)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit_s
    solver.parameters.num_workers = 8
    status = solver.Solve(m)
    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return _greedy_schedule(requests, doctors, t0, reason="SOLVER_FAILED")

    assignments, unscheduled = [], []
    for rid, (r, start, choices, scheduled, dur, _) in vars_.items():
        if not solver.Value(scheduled):
            unscheduled.append(rid)
            continue
        doc = next(d for d, lit in choices.items() if solver.Value(lit))
        assignments.append({"id": rid, "doctor": doc, "start_min": solver.Value(start), "slot_min": dur})
    return {"method": "CP_SAT", "status": "OPTIMAL" if status == cp_model.OPTIMAL else "FEASIBLE",
            "solve_ms": round((time.perf_counter() - t0) * 1000, 1),
            "assignments": sorted(assignments, key=lambda a: a["start_min"]), "unscheduled": unscheduled}


def _greedy_schedule(requests, doctors, t0, reason="FALLBACK"):
    """Priority rules: fixed (emergency) slots first, then first-come-first-served; urgent wins ties."""
    free = {doc: CLINIC_OPEN_MIN for docs in doctors.values() for doc in docs}
    order = sorted(requests, key=lambda r: (r.get("fixed_start") is None, r["requested_min"], -PRIORITY_WEIGHT[r["priority"]]))
    assignments, unscheduled = [], []
    for r in order:
        dur = slot_length(r["predicted_duration"], r["no_show_prob"], r["priority"])
        options = [r["fixed_doctor"]] if r.get("fixed_doctor") else doctors[r["department"]]
        options = [d for d in options if d in free]
        if not options:
            unscheduled.append(r["id"])
            continue
        doc = min(options, key=lambda d: free[d])
        start = max(free[doc], r["requested_min"], CLINIC_OPEN_MIN)
        if r.get("fixed_start") is not None:
            start = r["fixed_start"]
        if start + dur > CLINIC_CLOSE_MIN + 60:
            unscheduled.append(r["id"])
            continue
        free[doc] = start + dur
        assignments.append({"id": r["id"], "doctor": doc, "start_min": start, "slot_min": dur})
    return {"method": "PRIORITY_RULES_FALLBACK", "status": reason,
            "solve_ms": round((time.perf_counter() - t0) * 1000, 1),
            "assignments": sorted(assignments, key=lambda a: a["start_min"]), "unscheduled": unscheduled}
