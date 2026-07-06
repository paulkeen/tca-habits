#!/usr/bin/env bash
# One-time setup: backend venv + frontend deps.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Backend (uv)"
(cd backend && uv sync)

echo "==> Frontend (npm)"
(cd frontend && npm install)

echo "Done. Run ./scripts/dev.sh to start both servers."
