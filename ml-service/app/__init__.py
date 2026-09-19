import os

# PyTorch and XGBoost each bundle an OpenMP runtime; on macOS running both
# multi-threaded in one process segfaults. Single-threaded is plenty here.
os.environ.setdefault("OMP_NUM_THREADS", "1")
