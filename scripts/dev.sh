#!/usr/bin/env bash
# Run backend (:8000) and frontend (:5173) together. Ctrl-C stops both.
set -euo pipefail
cd "$(dirname "$0")/.."

(cd backend && uv run uvicorn main:app --reload --port 8000) &
BACKEND_PID=$!

(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT
wait
