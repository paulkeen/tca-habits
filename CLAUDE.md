# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A full-stack habit tracking app: React/TypeScript frontend (Vite) + FastAPI backend + SQLite. Starter project for the Tech Council Australia Agentic Engineer course.

## Commands

```bash
# One-time setup (creates backend/.venv + node_modules)
make setup          # or: ./scripts/setup.sh

# Development (runs both servers in parallel; Ctrl-C stops both)
make dev            # or: ./scripts/dev.sh
# Backend: :8000, Frontend: :5173 (proxies /habits, /stats, /encouragement to backend)

# Tests (backend only; frontend has no test suite)
make test           # or: cd backend && uv run pytest tests -q

# Single test
cd backend && uv run pytest tests/test_api.py::test_name -v

# The full harness the Stop hook runs each turn: lint + types + tests
make check          # = make lint + make typecheck + make test

# Production frontend build
make build          # or: cd frontend && npm run build
```

Prerequisites: Python 3.11+, Node.js 18+, npm 9+, `uv` (https://docs.astral.sh/uv/)

## Architecture

```
frontend/src/          React 18 + TypeScript 5.5 + Tailwind v4
  App.tsx              Root: all state lives here, view routing
  api.ts               Typed fetch wrapper; throws on non-OK
  types.ts             Shared TS interfaces
  components/          HabitTile, ProgressRing, modals, nav
  lib/theme.ts         Dark mode: persisted, system-watch, pre-paint toggle in index.html
  lib/colors.ts        9-color palette with base/on pairs

backend/
  main.py              FastAPI app + all routes + streak/calendar logic
  models.py            SQLAlchemy ORM: Habit, Completion
  database.py          Engine, session factory, run_migrations()
  schemas.py           Pydantic input/output schemas + validators
  ai.py                Optional Claude text generation with template fallback
```

## Key Patterns

**Weekday encoding:** `target_days` stores 0=Sun...6=Sat (API convention). Python's `date.weekday()` is Mon=0...Sun=6. `compute_streak()` in `main.py` converts between them explicitly.

**Streak computation:** Calculated fresh from `Completion` rows on every request. No denormalization. `enrich_habit()` in `main.py` wraps a SQLAlchemy model into `HabitOut` with all derived fields.

**Database migrations:** `run_migrations()` in `database.py` runs at startup and adds missing columns (e.g., `color` was added post-launch). When adding a new column, add it to the model and add a migration here.

**Adding a new habit field:** (1) `models.Habit`, (2) `schemas.HabitCreate`/`HabitOut` + validator, (3) `database.run_migrations()`, (4) `types.ts`, (5) `AddHabitModal.tsx` if user-editable.

**Optimistic updates:** `optimisticToggle()` in `App.tsx` mutates state immediately, then reconciles with server. On error it calls `fetchHabits()` to restore truth.

**Completion idempotency:** POST `/habits/{id}/complete` checks if today already exists before inserting. DELETE removes today's record only.

**Theme flash prevention:** A small inline script in `index.html` sets `.dark` on `<html>` before React renders, reading from localStorage. Don't move this to a module.

**Tailwind v4:** Uses `@tailwindcss/vite` plugin, not the classic PostCSS config. Theme tokens are CSS custom properties in `index.css`, not `tailwind.config.js`.

**AI features (optional):** `GET /stats/weekly-summary` and `GET /encouragement` return copy that is model-written when `ANTHROPIC_API_KEY` is set (and `uv sync --extra ai` has installed the `anthropic` package), and a deterministic template otherwise. All model calls go through `ai.generate()` in `backend/ai.py`, which never raises — any failure returns the template. Responses carry a `source` field (`"model"` or `"template"`) so the UI can badge AI-written text. The clean-clone default is template mode; **never make these endpoints require a key.** Model defaults to `claude-haiku-4-5`, overridable via `ANTHROPIC_MODEL`.

**Streak logic is guarded:** `.claude/hooks/guard_streak.py` (a committed `PreToolUse` hook) blocks edits to `compute_streak`/streak logic in `main.py` unless a test under `backend/tests/` also changes. Never change the streak calculation without a test — this is enforced, not just documented.

**Models are SQLAlchemy 2.0 typed:** `models.py` uses `Mapped[...]` / `mapped_column`, so `mypy` sees real attribute types. Keep that style when adding columns. `make check` (ruff + mypy + pytest) must stay green — CI enforces it.

**Sub-agents:** `.claude/agents/` defines `test-writer` (failing tests first), `reviewer` (read-only, no write tools), and `verifier` (runs `make check` + smoke test). Keep each prompt narrow and its tools minimal.
