#!/usr/bin/env bash
# Run the FastAPI backend on http://localhost:8000.
# `uv run` auto-creates backend/.venv and syncs dependencies on first use.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/backend"

if ! command -v uv >/dev/null 2>&1; then
  echo "Error: 'uv' is not installed. Run ./scripts/setup.sh for instructions."
  exit 1
fi

exec uv run uvicorn main:app --reload --port 8000
