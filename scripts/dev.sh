#!/usr/bin/env bash
# Start the backend (:8000) and frontend (:5173) together with prefixed,
# color-coded logs. Press Ctrl-C once to stop both cleanly.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CYAN=$'\033[36m'; MAGENTA=$'\033[35m'; RESET=$'\033[0m'

# Recursively terminate a process and everything it spawned (uvicorn's reloader,
# vite's esbuild workers, etc.) so nothing is left listening on a port.
kill_tree() {
  local pid=$1 child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null || true
}

pids=()
cleanup() {
  trap - INT TERM EXIT
  echo ""
  echo "Shutting down…"
  for pid in "${pids[@]}"; do kill_tree "$pid"; done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "Starting TCA Habits…  api → http://localhost:8000   web → http://localhost:5173"
echo "Press Ctrl-C to stop."
echo ""

( "$ROOT/scripts/backend.sh" 2>&1 | sed -u "s/^/${CYAN}[api]${RESET} /" ) &
pids+=($!)

( "$ROOT/scripts/frontend.sh" 2>&1 | sed -u "s/^/${MAGENTA}[web]${RESET} /" ) &
pids+=($!)

wait
