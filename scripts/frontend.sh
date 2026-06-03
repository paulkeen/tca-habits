#!/usr/bin/env bash
# Run the Vite dev server on http://localhost:5173 (proxies /habits and /stats
# to the backend on :8000).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/frontend"

[ -d node_modules ] || npm install
exec npm run dev
