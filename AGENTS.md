# AGENTS.md

The project contract for TCA Habits. This is the cross-tool standard: **Codex reads
this file directly, and Claude Code reads it via an `@AGENTS.md` import in
`CLAUDE.md`.** Keep the guidance here, not in `CLAUDE.md`.

## What This Is

A full-stack habit tracking app: React/TypeScript frontend (Vite) + FastAPI backend
+ SQLite. Starter project for the Tech Council of Australia Agentic Engineering
course. You can drive it with **Claude Code or OpenAI Codex** — both are supported,
and the agent config below exists in parallel for each.

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

**Streak logic is guarded:** a `PreToolUse` hook blocks edits to `compute_streak`/streak logic in `main.py` unless a test under `backend/tests/` also changes. Never change the streak calculation without a test — this is enforced, not just documented. (Claude Code: `.claude/hooks/guard_streak.py`; Codex: `.codex/hooks/guard_streak.py`.)

**Models are SQLAlchemy 2.0 typed:** `models.py` uses `Mapped[...]` / `mapped_column`, so `mypy` sees real attribute types. Keep that style when adding columns. `make check` (ruff + mypy + pytest) must stay green — CI enforces it.

## Agent tooling (Claude Code and Codex, in parallel)

The Section-3 harness is authored for both agents. Keep the two sides in sync when
you change one.

| Capability | Claude Code | Codex |
|---|---|---|
| Project contract | `CLAUDE.md` → `@AGENTS.md` (this file) | `AGENTS.md` (this file), read directly |
| Sub-agents | `.claude/agents/*.md` | `.codex/agents/*.toml` |
| Reusable "add a feature" workflow | `.claude/commands/add-feature.md` (`/add-feature`) | `.codex/prompts/add-feature.md` (copy to `~/.codex/prompts/`) |
| Guardrail + self-verify hooks | `.claude/settings.json` + `.claude/hooks/guard_streak.py` | `.codex/hooks.json` + `.codex/hooks/guard_streak.py` |

Both toolchains define the same three narrow sub-agents — **test-writer** (failing
tests first), **reviewer** (read-only, reports problems, never edits), and
**verifier** (runs `make check` + a smoke test) — and the same two hooks: a
`PreToolUse` guard on the streak logic and a `Stop` hook that runs `make check`.

### The "add a feature" workflow (tool-neutral)

1. **Explore** the files the change touches before proposing anything.
2. **Plan** the endpoints/components and any migration; surface real decisions.
3. **Implement** following the patterns above (weekday encoding, fresh streaks, the
   "adding a habit field" checklist).
4. **Run** the app or the tests; if you touch streak logic, a test is mandatory.
5. **Summarise** the diff (`git diff --stat`), what you verified, what you left out.
