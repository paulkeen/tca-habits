#!/usr/bin/env bash
# One-time setup: sync the backend environment with uv and install frontend
# npm packages. Safe to re-run.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v uv >/dev/null 2>&1; then
  echo "Error: 'uv' is not installed."
  echo "Install it with:  curl -LsSf https://astral.sh/uv/install.sh | sh"
  echo "or:               brew install uv"
  echo "Docs: https://docs.astral.sh/uv/getting-started/installation/"
  exit 1
fi

echo "==> Backend: syncing environment with uv (backend/.venv)"
( cd backend && uv sync )

echo "==> Frontend: installing npm packages"
( cd frontend && npm install )

echo ""
echo "Setup complete. Start everything with: ./scripts/dev.sh"
