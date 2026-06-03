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
# Backend: :8000, Frontend: :5173 (proxies /habits and /stats to backend)

# Tests (backend only; frontend has no test suite)
make test           # or: cd backend && uv run pytest tests/test_api.py -v

# Single test
cd backend && uv run pytest tests/test_api.py::test_name -v

# Coverage
cd backend && uv run pytest tests/test_api.py -v --cov=. --cov-report=html

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
