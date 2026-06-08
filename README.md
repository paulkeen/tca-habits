# TCA Habits — Habit Streak Tracker

Track family routines, fitness goals, and hobbies as a grid of colored tiles. Tap a tile to complete it for the day and watch it fill with its color; build streaks, and review your history with a 30-day heatmap.

Light and dark themes (follows your OS, with a manual toggle), responsive from phone to desktop.

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

The Vite dev server proxies `/habits` and `/stats` to the backend, so both must be running.

---

## Tests

```bash
cd backend && uv run pytest tests/test_api.py -v   # or: make test
```

Tests use isolated temporary SQLite databases and never touch your dev database.

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
| GET | `/stats` | Global stats (totals, active streaks, perfect days) |
| GET | `/stats/calendar?days=30` | Per-day completed-vs-due totals across all habits |

**Habit fields:** `category` is one of `family`, `fitness`, `hobby`, `personal`. `color` is one of `red`, `orange`, `amber`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`. `target_days` is a list of integers `0`–`6` where `0` = Sunday.
