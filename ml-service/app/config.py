from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SOP_DIR = DATA_DIR / "sops"
ARTIFACT_DIR = ROOT / "artifacts"
REPORT_DIR = ROOT / "reports"

SEED = 42

# Inpatient units tracked by the forecaster and optimizer.
UNITS = {
    "ICU": {"beds": 40, "nurses": 18, "ratio": 2},        # 1 nurse : 2 patients
    "GENERAL": {"beds": 200, "nurses": 48, "ratio": 4},   # 1 : 4
    "EMERGENCY": {"beds": 50, "nurses": 16, "ratio": 3},  # 1 : 3
}

FORECAST_HORIZONS = [2, 6, 12, 24]  # hours ahead
LOOKBACK = 48                       # LSTM input window (hours)

# Outpatient departments: consultation rooms and doctors.
DEPARTMENTS = {
    "General Medicine": {"rooms": 3, "doctors": ["Dr. Mehta", "Dr. Rao", "Dr. Iyer"], "base_minutes": 12},
    "Cardiology": {"rooms": 2, "doctors": ["Dr. Kulkarni", "Dr. Shah"], "base_minutes": 20},
    "Orthopedics": {"rooms": 2, "doctors": ["Dr. Deshpande", "Dr. Nair"], "base_minutes": 15},
    "Pediatrics": {"rooms": 2, "doctors": ["Dr. Joshi", "Dr. Pillai"], "base_minutes": 12},
    "Dermatology": {"rooms": 1, "doctors": ["Dr. Kapoor"], "base_minutes": 10},
}

CLINIC_OPEN_MIN = 9 * 60    # 09:00
CLINIC_CLOSE_MIN = 17 * 60  # 17:00
