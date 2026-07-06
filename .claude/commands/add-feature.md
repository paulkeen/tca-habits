---
description: Add a feature to TCA Habits the repeatable way — explore, plan, implement, run, summarise.
---

You are adding a feature to the TCA Habits app. Follow this workflow exactly; do
not skip straight to editing files.

**Feature requested:** $ARGUMENTS

1. **Explore.** Read the files this feature will touch before proposing anything.
   For a backend change, that's usually `backend/main.py`, `backend/models.py`,
   `backend/schemas.py`, and `backend/tests/test_api.py`. For a frontend change,
   `frontend/src/App.tsx`, `frontend/src/api.ts`, `frontend/src/types.ts`, and the
   relevant `frontend/src/components/*`. Report what you found in 3-5 lines.

2. **Plan.** Propose a short plan: the endpoints/components you'll add or change,
   the data flow, and any migration (`database.run_migrations()`) needed if you're
   adding a column. Surface any real engineering decision (e.g. static vs. model
   call) rather than deciding silently. Wait for confirmation on anything risky.

3. **Implement.** Make the change following the conventions in `CLAUDE.md` —
   especially the weekday encoding, the fresh-streak-computation pattern, and the
   "adding a new habit field" checklist. Keep commits small and labelled.

4. **Run.** Start the app (`make dev`) or the tests (`make test`) and confirm the
   feature works end to end. If you changed streak logic, a test is mandatory.

5. **Summarise.** Report the diff at a glance (`git diff --stat`), what you
   verified, and anything you deliberately left out.
