# Security

This is a course reference project, but it models the security discipline of
Section 3: the last gate before merge stays human and stays yours.

## Before merging a change

- Run `/review` and `/security-review` in Claude Code over the diff. Validate
  correctness, security, and licensing — this gate is not automated away.
- `make check` (lint + types + tests) must be green. CI enforces it on every push
  and pull request (`.github/workflows/ci.yml`).
- The guardrail hook (`.claude/hooks/guard_streak.py`) blocks changes to the streak
  logic unless a test changes too.

## Secrets

- The only secret this app uses is `ANTHROPIC_API_KEY`, and it is **optional** —
  the AI features fall back to deterministic templates without it. Never commit a
  key; `.env` and `.env.*` are gitignored.
- The backend needs no other credentials. The SQLite database is local and
  disposable (`*.db` is gitignored).

## Reporting

This is a teaching repo with no production deployment. If you find a genuine issue
in the reference code, open an issue on the GitHub repository.
