import os
import zipfile
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "upload_packages"
UPLOAD_DIR.mkdir(exist_ok=True)

# 1. Package Frontend (dist)
frontend_dist = BASE_DIR / "frontend" / "dist"
frontend_zip = UPLOAD_DIR / "jaheshkar_frontend.zip"

print(f"Compressing frontend from {frontend_dist} to {frontend_zip}...")
if frontend_dist.exists():
    with zipfile.ZipFile(frontend_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(frontend_dist):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(frontend_dist)
                zf.write(file_path, arcname)
    print(f"[OK] Frontend zip created: {frontend_zip.stat().st_size / 1024:.1f} KB")
else:
    print(f"[ERROR] Frontend dist not found at {frontend_dist}")

# 2. Package Backend
backend_dir = BASE_DIR / "backend"
backend_zip = UPLOAD_DIR / "jaheshkar_backend.zip"

exclude_dirs = {"__pycache__", ".git", "venv", ".idea", ".vscode"}
exclude_extensions = {".pyc", ".pyo", ".log"}

print(f"Compressing backend from {backend_dir} to {backend_zip}...")
with zipfile.ZipFile(backend_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(backend_dir):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix in exclude_extensions:
                continue
            arcname = file_path.relative_to(backend_dir)
            zf.write(file_path, arcname)

print(f"[OK] Backend zip created: {backend_zip.stat().st_size / (1024*1024):.2f} MB")
print("\n>>> All deployment packages successfully created! <<<")
