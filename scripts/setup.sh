#!/usr/bin/env bash
# One-time setup: sync the backend environment with uv and install frontend
# npm packages. Safe to re-run.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Windows: the course supports WSL2 and Codespaces, not native Windows shells.
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    echo "Warning: this looks like Git Bash on native Windows, which the course does not support."
    echo "Use WSL2 (Ubuntu) or GitHub Codespaces instead; see the Prerequisites handout."
    ;;
esac
case "$ROOT" in
  /mnt/[a-z]/*)
    echo "Warning: this repo is on the Windows drive ($ROOT)."
    echo "Clone it inside your Linux home folder (cd ~) instead: npm and Vite are much slower here."
    ;;
esac

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
