"""A simulated outpatient clinic day: predictive scheduling, dynamic rescheduling and wait-time metrics.

Each day is generated with hidden ground truth (actual duration, whether the patient
turns up). The scheduler only sees model predictions; metrics come from replaying the
schedule against the ground truth, so "optimized vs static" comparisons are honest.
"""
import copy

import numpy as np
import pandas as pd

from .appointments import AppointmentPredictor
from .config import CLINIC_CLOSE_MIN, CLINIC_OPEN_MIN, DEPARTMENTS
from .data_gen import generate_appointments
from .optimization import _greedy_schedule, schedule_appointments


def fmt(minutes: int) -> str:
    return f"{int(minutes) // 60:02d}:{int(minutes) % 60:02d}"


def simulate(requests: dict, assignments: list[dict]) -> dict:
    """Replay a schedule with true durations/no-shows. Waits are measured from the booked time."""
    by_doc = {}
    for a in assignments:
        by_doc.setdefault(a["doctor"], []).append(a)
    waits, busy, overtime, seen, no_shows = [], 0.0, 0.0, 0, 0
    for doc, appts in by_doc.items():
        free = CLINIC_OPEN_MIN
        for a in sorted(appts, key=lambda x: x["start_min"]):
            r = requests[a["id"]]
            if r["actual_no_show"]:
                no_shows += 1
                continue
            start = max(a["start_min"], free)
            waits.append(start - a["start_min"])
            free = start + r["actual_duration"]
            busy += r["actual_duration"]
            seen += 1
        overtime += max(0.0, free - CLINIC_CLOSE_MIN)
    n_docs = sum(len(c["doctors"]) for c in DEPARTMENTS.values())
    waits = np.array(waits) if waits else np.zeros(1)
    return {
        "patients_seen": seen,
        "no_shows": no_shows,
        "avg_wait_min": round(float(waits.mean()), 1),
        "p90_wait_min": round(float(np.percentile(waits, 90)), 1),
        "max_wait_min": round(float(waits.max()), 1),
        "doctor_utilization_pct": round(busy / (n_docs * (CLINIC_CLOSE_MIN - CLINIC_OPEN_MIN)) * 100, 1),
        "doctor_overtime_min": round(overtime, 1),
    }


class ClinicDay:
    def __init__(self, predictor: AppointmentPredictor, n_patients: int = 260, seed: int = 7):
        self.predictor, self.n_patients = predictor, n_patients
        self.reset(seed)

    # ------------------------------------------------------------------ setup
    def reset(self, seed: int = 7):
        rng = np.random.default_rng(seed)
        df = generate_appointments(self.n_patients, seed=seed + 100)
        df = self.predictor.predict(df)
        self.requests = {}
        for i, row in df.iterrows():
            rid = f"A{1001 + i}"
            self.requests[rid] = {
                "id": rid,
                "patient": f"Patient {rid[1:]}",
                "department": row.department,
                "age": int(row.age),
                "requested_min": int(row.slot_hour * 60 + rng.choice([0, 15, 30, 45])),
                "priority": "URGENT" if rng.random() < 0.08 else "ROUTINE",
                "predicted_duration": float(row.predicted_duration),
                "no_show_prob": float(row.no_show_prob),
                "high_risk": bool(row.high_risk),
                # Hidden ground truth - never given to the scheduler.
                "actual_duration": float(row.duration_min),
                "actual_no_show": bool(row.no_show),
            }
        self.unavailable: set[str] = set()
        self.cancelled: set[str] = set()
        self.events: list[dict] = []
        self.clock = CLINIC_OPEN_MIN
        self.baseline = self._static_schedule()
        self.solution = schedule_appointments(self._active_requests())
        self.initial_solution = copy.deepcopy(self.solution)

    def _active_requests(self, frozen: dict | None = None, previous: dict | None = None) -> list[dict]:
        out = []
        for rid, r in self.requests.items():
            if rid in self.cancelled:
                continue
            r = {**r}
            if frozen and rid in frozen:
                r["fixed_doctor"], r["fixed_start"] = frozen[rid]
            else:
                r["requested_min"] = max(r["requested_min"], self.clock)  # cannot move into the past
                prev = (previous or {}).get(rid)
                if prev and prev["doctor"] not in self.unavailable and prev["start_min"] >= self.clock:
                    r["prev_doctor"], r["prev_start"] = prev["doctor"], prev["start_min"]
            out.append(r)
        return out

    def _static_schedule(self) -> dict:
        """What a traditional system does: fixed slot per department, first-come-first-served."""
        fixed = [{**r, "predicted_duration": DEPARTMENTS[r["department"]]["base_minutes"] + 5, "no_show_prob": 0.0}
                 for r in self.requests.values()]
        doctors = {d: c["doctors"] for d, c in DEPARTMENTS.items()}
        return _greedy_schedule(fixed, doctors, 0.0, reason="STATIC_FIXED_SLOTS")

    # ------------------------------------------------------------ rescheduling
    def _resolve(self, event: dict):
        before = {a["id"]: a for a in self.solution["assignments"]}
        # Appointments that already started keep their slot; everything later can move.
        frozen = {rid: (a["doctor"], a["start_min"]) for rid, a in before.items()
                  if a["start_min"] < self.clock and a["doctor"] not in self.unavailable}
        self.solution = schedule_appointments(self._active_requests(frozen, before), unavailable_doctors=self.unavailable)
        after = {a["id"]: a for a in self.solution["assignments"]}
        changes = []
        for rid, a in after.items():
            b = before.get(rid)
            if b is None:
                changes.append({"id": rid, "change": "ADDED", "to": f"{a['doctor']} {fmt(a['start_min'])}"})
            elif (b["doctor"], b["start_min"]) != (a["doctor"], a["start_min"]):
                changes.append({"id": rid, "change": "MOVED", "from": f"{b['doctor']} {fmt(b['start_min'])}",
                                "to": f"{a['doctor']} {fmt(a['start_min'])}"})
        for rid in before.keys() - after.keys():
            changes.append({"id": rid, "change": "REMOVED" if rid in self.cancelled else "UNSCHEDULED"})
        event = {**event, "at": fmt(self.clock), "solve_ms": self.solution["solve_ms"],
                 "method": self.solution["method"], "changes": changes}
        self.events.append(event)
        return event

    def set_clock(self, minute: int):
        self.clock = int(np.clip(minute, CLINIC_OPEN_MIN, CLINIC_CLOSE_MIN))

    def cancel(self, rid: str):
        if rid not in self.requests:
            raise KeyError(rid)
        self.cancelled.add(rid)
        return self._resolve({"type": "CANCELLATION", "detail": f"{rid} cancelled"})

    def doctor_unavailable(self, doctor: str):
        if not any(doctor in c["doctors"] for c in DEPARTMENTS.values()):
            raise KeyError(doctor)
        self.unavailable.add(doctor)
        return self._resolve({"type": "DOCTOR_UNAVAILABLE", "detail": f"{doctor} unavailable from {fmt(self.clock)}"})

    def emergency(self, department: str, expected_duration: float = 25.0):
        """Emergency override: the patient is seen now by the least-loaded doctor, bypassing
        the queue and the predictive buffers; everyone else is re-optimized around them."""
        if department not in DEPARTMENTS:
            raise KeyError(department)
        docs = [d for d in DEPARTMENTS[department]["doctors"] if d not in self.unavailable]
        if not docs:
            raise ValueError(f"No available doctor in {department}")
        # Earliest moment each doctor is free (finishing any consultation already in progress).
        def free_at(doc):
            running = [a["start_min"] + a["slot_min"] for a in self.solution["assignments"]
                       if a["doctor"] == doc and a["start_min"] < self.clock < a["start_min"] + a["slot_min"]]
            return max(running, default=self.clock)
        doctor = min(docs, key=free_at)
        start = free_at(doctor)
        rid = f"E{len([r for r in self.requests if r.startswith('E')]) + 1:03d}"
        self.requests[rid] = {
            "id": rid, "patient": f"Emergency {rid}", "department": department, "age": 0,
            "requested_min": self.clock, "priority": "EMERGENCY", "predicted_duration": expected_duration,
            "no_show_prob": 0.0, "high_risk": False, "actual_duration": expected_duration, "actual_no_show": False,
            "fixed_doctor": doctor, "fixed_start": start,
        }
        return self._resolve({"type": "EMERGENCY_OVERRIDE", "detail": f"{rid} seen by {doctor} at {fmt(start)} (queue bypassed)"})

    # ------------------------------------------------------------------ views
    def schedule(self) -> list[dict]:
        assigned = {a["id"]: a for a in self.solution["assignments"]}
        rows = []
        for rid, r in self.requests.items():
            a = assigned.get(rid)
            status = "CANCELLED" if rid in self.cancelled else ("SCHEDULED" if a else "WAITLISTED")
            rows.append({
                "id": rid, "patient": r["patient"], "department": r["department"], "priority": r["priority"],
                "requested_time": fmt(r["requested_min"]),
                "doctor": a["doctor"] if a else None,
                "start": fmt(a["start_min"]) if a else None, "start_min": a["start_min"] if a else None,
                "slot_min": a["slot_min"] if a else None,
                "predicted_duration": round(r["predicted_duration"], 1),
                "no_show_prob": round(r["no_show_prob"], 3), "high_risk": r["high_risk"], "status": status,
            })
        return sorted(rows, key=lambda x: (x["start_min"] is None, x["start_min"] or 0))

    def metrics(self) -> dict:
        return {
            "static_fixed_slots": {**simulate(self.requests, self.baseline["assignments"]),
                                   "waitlisted": len(self.baseline["unscheduled"])},
            "optimized": {**simulate(self.requests, self.solution["assignments"]),
                          "waitlisted": len(self.solution["unscheduled"])},
            "solver": {k: self.solution[k] for k in ("method", "status", "solve_ms")},
            "predicted_high_risk": sum(r["high_risk"] for r in self.requests.values()),
            "clock": fmt(self.clock),
        }

    def doctors(self) -> list[dict]:
        out = []
        for dept, cfg in DEPARTMENTS.items():
            for doc in cfg["doctors"]:
                appts = [a for a in self.solution["assignments"] if a["doctor"] == doc]
                out.append({"doctor": doc, "department": dept, "available": doc not in self.unavailable,
                            "appointments": len(appts), "booked_min": sum(a["slot_min"] for a in appts)})
        return out
