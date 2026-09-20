from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SOP_DIR = DATA_DIR / "sops"
ARTIFACT_DIR = ROOT / "artifacts"
REPORT_DIR = ROOT / "reports"

SEED = 42

# ---------------------------------------------------------------------------------------
# Capacity calibration (see README "Data provenance")
#
# VERIFIED, from Government of India open data:
#   - Dr. Ram Manohar Lohia Hospital, New Delhi: 1,538 beds
#     (National Health Profile 2023; Rajya Sabha Session 267, Unstarred Q.287, 04-02-2025,
#      data.gov.in "Hospital-wise Total Number of Beds Available in Central Government Hospitals")
#     For scale: Safdarjung 2,995 and Lady Hardinge 1,800 beds in the same table; India has
#     41,245 government hospitals with 825,234 beds (NHP 2021, data.gov.in state/UT table).
#
# ASSUMED, because India does not publish per-hospital unit splits or staffing establishments:
#   - Unit mix: 8% ICU, 6% emergency, the rest general wards.
#   - Nurse establishment: enough nurses to cover ~85% occupancy at the statutory ratios in
#     SOP-STF-02 (ICU 1:2, emergency 1:3, general ward 1:4).
# ---------------------------------------------------------------------------------------
TOTAL_BEDS = 1538  # Dr. RML Hospital, NHP 2023

UNITS = {
    "ICU": {"beds": 123, "nurses": 52, "ratio": 2},        # 8% of beds; 1 nurse : 2 patients
    "GENERAL": {"beds": 1323, "nurses": 281, "ratio": 4},  # remainder; 1 : 4
    "EMERGENCY": {"beds": 92, "nurses": 26, "ratio": 3},   # 6% of beds; 1 : 3
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
