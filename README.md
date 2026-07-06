# TCA Habits — a basic habit tracker

The end-of-Section-1 state for the **Tech Council of Australia · Agentic Engineering** course.
A working full-stack habit tracker: add a habit, tick it off today, watch a streak grow.
Ugly is fine — Sections 2 and 3 make it a real product and then harden it.

> **You are at `checkpoint-1-working`.** See `git tag` for the other checkpoints and
> `git checkout <tag>` to move between them.

## Run it

```bash
./scripts/setup.sh   # one time: backend venv (uv) + frontend deps (npm)
./scripts/dev.sh     # backend on :8000, frontend on :5173
```

Open **http://localhost:5173**. The SQLite database (`backend/habits.db`) is created on first run
and seeded with three example habits.

### Prerequisites

- [uv](https://docs.astral.sh/uv/) (manages Python 3.11+ and backend deps)
- Node.js 18+ and npm 9+

## What's here

```
backend/
  main.py          # FastAPI app + SQLAlchemy models + streak logic (one file, on purpose)
  pyproject.toml   # fastapi, uvicorn, sqlalchemy, pydantic
frontend/
  index.html
  src/App.tsx      # single page: list, checkbox, streak badge, add form
scripts/           # setup.sh, dev.sh
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/habits` | All habits with today's status + current streak |
| POST | `/habits` | Create a habit (`name`, `emoji`) |
| POST | `/habits/{id}/complete` | Mark done today (idempotent) |
| DELETE | `/habits/{id}/complete` | Unmark today |

A streak is the number of consecutive days with a completion, counting back from today. Today not
being done yet does not break it.
