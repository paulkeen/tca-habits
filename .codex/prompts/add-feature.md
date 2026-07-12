<!--
Codex custom prompts are discovered only in ~/.codex/prompts/ (user-global), not
from the repo. To use this as /add-feature in Codex:

    cp .codex/prompts/add-feature.md ~/.codex/prompts/

Then run `/add-feature` and describe the feature. (The same workflow is also in
AGENTS.md, so Codex follows it even without installing this prompt.)
This mirrors Claude Code's .claude/commands/add-feature.md.
-->

Add the feature the user describes to the TCA Habits app the repeatable way. Do not
skip straight to editing files.

1. **Explore.** Read the files this feature will touch before proposing anything.
   For a backend change, that's usually `backend/main.py`, `backend/models.py`,
   `backend/schemas.py`, and `backend/tests/`. For a frontend change,
   `frontend/src/App.tsx`, `frontend/src/api.ts`, `frontend/src/types.ts`, and the
   relevant `frontend/src/components/*`. Report what you found in 3-5 lines.

2. **Plan.** Propose a short plan: the endpoints/components you'll add or change,
   the data flow, and any migration (`database.run_migrations()`) needed if you're
   adding a column. Surface any real engineering decision (e.g. static vs. model
   call) rather than deciding silently. Wait for confirmation on anything risky.

3. **Implement.** Follow the conventions in `AGENTS.md` — especially the weekday
   encoding, the fresh-streak-computation pattern, and the "adding a new habit
   field" checklist. Keep commits small and labelled.

4. **Run.** Start the app (`make dev`) or the tests (`make test`) and confirm the
   feature works end to end. If you changed streak logic, a test is mandatory (the
   guardrail hook enforces it).

5. **Summarise.** Report the diff at a glance (`git diff --stat`), what you
   verified, and anything you deliberately left out.
