# TCA Habits — Habit Streak Tracker

Track family routines, fitness goals, and hobbies as a grid of colored tiles. Tap a tile to complete it for the day and watch it fill with its color; build streaks, and review your history with a 30-day heatmap.

Light and dark themes, responsive from phone to desktop.

> **This is the starter project for the Tech Council Australia Agentic Engineer course.**

---

## Quickstart

```bash
./scripts/setup.sh   # one time: create the backend venv + install all deps
./scripts/dev.sh     # run backend (:8000) and frontend (:5173) together
```

Open **http://localhost:5173**. Press **Ctrl-C** to stop both servers.

The SQLite database (`backend/habits.db`) is created automatically on first run, seeded with 6 example habits.

`make setup` / `make dev` / `make test` are equivalent wrappers.

### Prerequisites

- [uv](https://docs.astral.sh/uv/) (manages Python 3.11+ and backend deps) — `brew install uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Node.js 18+
- npm 9+

### Running services individually

```bash
./scripts/backend.sh    # FastAPI on :8000  (docs at /docs)
./scripts/frontend.sh   # Vite dev server on :5173
```

The Vite dev server proxies `/habits`, `/stats`, and `/encouragement` to the backend, so both must be running.

---

## Tests & checks

```bash
make test     # backend suite (tests/) — isolated temp SQLite DBs
make lint     # ruff
make typecheck # mypy
make check    # lint + types + tests — the harness the agent runs each turn
```

Tests use isolated temporary SQLite databases and never touch your dev database.

## Hardening (Section 3)

This checkpoint adds the engineering that makes the agent's output trustworthy:

- **Test/eval harness** — `backend/tests/` covers the streak edge cases (missed-day
  resets, idempotency, weekday scheduling, month/timezone boundaries) plus the AI
  fallback behaviour. `make check` runs lint + types + tests.
- **Sub-agents** — a `test-writer`, a read-only `reviewer`, and a `verifier`, each
  with a narrow job and minimal tools. Defined for both toolchains:
  `.claude/agents/*.md` (Claude Code) and `.codex/agents/*.toml` (Codex).
- **Guardrail hooks** — a `Stop` hook runs `make check` each turn; a `PreToolUse`
  hook blocks edits to the streak logic unless a test changes too. Wired for both:
  `.claude/settings.json` + `.claude/hooks/guard_streak.py`, and `.codex/hooks.json`
  + `.codex/hooks/guard_streak.py`.
- **CI** — `.github/workflows/ci.yml` runs the backend harness and the frontend
  build on every push and pull request.
- **Security** — see `SECURITY.md`; run a security-review pass before merge.

Whether you drive the project with **Claude Code or OpenAI Codex**, the project
contract (`AGENTS.md`, which `CLAUDE.md` imports), the sub-agents, and the hooks all
exist in parallel — see the "Agent tooling" table in `AGENTS.md`.

---

## Project structure

```
habit-streak-app/
├── scripts/             # setup.sh, dev.sh, backend.sh, frontend.sh
├── Makefile
├── backend/
│   ├── main.py          # FastAPI app, routes, streak/calendar logic
│   ├── models.py        # SQLAlchemy ORM models (Habit, Completion)
│   ├── database.py      # engine, session, idempotent migrations
│   ├── schemas.py       # Pydantic request/response schemas + validation
│   ├── pyproject.toml    # dependencies (managed by uv; uv.lock pins versions)
│   └── tests/test_api.py
└── frontend/
    ├── index.html       # entry; sets the theme before first paint
    ├── vite.config.ts   # Tailwind v4 plugin + API proxy
    └── src/
        ├── App.tsx               # root state, views, optimistic toggle
        ├── api.ts / types.ts     # typed API client + interfaces
        ├── index.css             # Tailwind v4 theme tokens (light/dark)
        ├── lib/theme.ts          # theme persistence + system watch
        ├── lib/colors.ts         # per-habit color palette
        └── components/
            ├── HabitTile.tsx         # the fill-on-complete tile
            ├── ProgressRing.tsx      # weekly progress ring
            ├── HabitDetailModal.tsx  # 30-day heatmap + stats
            ├── AddHabitModal.tsx     # create/edit with color picker
            ├── StatsView.tsx         # summary, week chart, heatmap
            ├── Header.tsx / BottomNav.tsx / ThemeToggle.tsx
            └── Modal.tsx             # shared dialog shell
```

---

## API reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/habits` | All habits with streak + this-week progress |
| POST | `/habits` | Create a habit (`name`, `emoji`, `category`, `color`, `target_days`) |
| PATCH | `/habits/{id}` | Update a habit |
| DELETE | `/habits/{id}` | Delete a habit |
| POST | `/habits/{id}/complete` | Mark done today (idempotent) |
| DELETE | `/habits/{id}/complete` | Unmark today |
| GET | `/habits/{id}/history` | Last 30 days of completion history |
| GET | `/habits/{id}/monthly` | This month's completed-vs-due for the progress ring |
| GET | `/stats` | Global stats (totals, active streaks, perfect days) |
| GET | `/stats/calendar?days=30` | Per-day completed-vs-due totals across all habits |
| GET | `/stats/weekly-summary` | A short human paragraph about the week (AI or template) |
| GET | `/encouragement` | A nudge about the most at-risk streak (AI or template) |

**Habit fields:** `category` is one of `family`, `fitness`, `hobby`, `personal`. `color` is one of `red`, `orange`, `amber`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`. `target_days` is a list of integers `0`–`6` where `0` = Sunday.

---

## AI features (optional)

The weekly summary and the encouragement nudge are written by Claude when an API
key is present, and by a deterministic template otherwise — so the app always
runs from a clean clone with no configuration.

```bash
cd backend && uv sync --extra ai       # install the anthropic package
export ANTHROPIC_API_KEY=sk-ant-...    # then run the app as usual
# optional: export ANTHROPIC_MODEL=claude-haiku-4-5   (the default)
```

Responses include a `source` field (`"model"` or `"template"`); the UI shows an
"✨ AI" badge when the copy came from the model. Never commit your key — `.env`
is gitignored.

