# TCA Habits — Agentic Engineering Course

The reference project for the **Tech Council of Australia · Agentic Engineering** one-day program.
You spend the day building one app — a habit tracker — three times over, at three rising levels of
sophistication. In the morning you make it work without caring how. By lunch you make the agent
reliable and repeatable. In the afternoon you stop trusting the agent by eye and engineer around it
with a test harness, sub-agents, and a small agent team.

> **You are at `checkpoint-0-empty`: the bare scaffold.** There is no app here yet — that is the
> point. In Section 1 you will stand the whole thing up from a single prompt.

## The checkpoint safety net

This repo carries four git tags, one per section boundary. If your app breaks or you fall behind,
you do **not** debug for twenty minutes and miss the next section. You reset to the known-good
checkpoint for the state the next section assumes, and rejoin instantly. Using a checkpoint is the
design, not a failure.

| Tag | State |
|-----|-------|
| `checkpoint-0-empty` | Bare scaffold — the Section 1 start (you are here) |
| `checkpoint-1-working` | End of Section 1: a basic working tracker (add, tick, streak) |
| `checkpoint-2-features` | End of Section 2: `CLAUDE.md`, a reusable workflow, stats, weekly summary, AI encouragement |
| `checkpoint-3-hardened` | End of Section 3: test harness, sub-agents, guardrail hooks, CI |

```bash
# I'm lost / my app is broken / I ran out of time on the last section.
git stash                          # park whatever mess exists
git checkout checkpoint-1-working  # drop into the known-good state
# carry on with the next section from solid ground
```

And at the start of Sections 2 and 3, diff your own work against the checkpoint you are about to
build on — a second pass at the material for anyone who did not need rescuing:

```bash
git diff HEAD checkpoint-1-working --stat
```

## Prerequisites (install before the day — strict)

The day has no time to debug a missing toolchain. Confirm each of these returns a version number in
a terminal **before** you arrive:

```bash
claude --version     # Claude Code:  npm install -g @anthropic-ai/claude-code, then run `claude` and log in
node --version       # Node.js 18+
python3 --version    # Python 3.11+
git --version
uv --version         # https://docs.astral.sh/uv/  (brew install uv)
```

Optional: the OpenAI Codex CLI, for the Section 2 second-opinion exercise.

## Pre-work (15 minutes)

- Read the first two lessons of [Claude Code 101](https://anthropic.skilljar.com/claude-code-101).
  You need the vocabulary — agentic loop, context window, permissions — not mastery.
- Bring **one sentence**: a habit you actually want to build in your life. You will seed the app with
  it, which makes the day yours rather than a toy.
- If your environment is stale after time away (old Node, expired credentials, a wiped laptop), flag
  it the day *before*, not at 09:35.

## The day

| Section | You stop… | You learn to… |
|---------|-----------|---------------|
| 1 · Vibe Coding | writing code by hand | direct an agent: explore, plan, code, commit |
| 2 · Vibe Engineering | re-explaining yourself every session | configure the harness so the agent behaves the same way every time |
| 3 · Agentic Engineering | trusting output by eye | build harnesses, sub-agents, and agent teams that verify their own work |

## Section 1, Block A — the one prompt that starts it all

Once you have Claude Code running in this folder, ask it to plan first, then build:

> Build a habit tracker as a full-stack app. Backend: FastAPI with SQLite via SQLAlchemy, two
> tables — habits (id, name, emoji, created_at) and completions (id, habit_id, completed_date as
> YYYY-MM-DD). Endpoints: GET /habits returning each habit with today's completion status and current
> streak; POST /habits; POST /habits/{id}/complete (idempotent); DELETE /habits/{id}/complete. Streak
> is consecutive days with a completion counting back from today. Seed three example habits. Enable
> CORS for localhost:5173. Frontend: React, TypeScript, Vite, a single page listing habits with a
> checkbox and a streak badge. Show me a plan before you write anything.

Read the plan critically before you approve it. Then watch the tools fire.

---

Shaping Australia's digital foundations together · [techcouncil.com.au](https://techcouncil.com.au)
