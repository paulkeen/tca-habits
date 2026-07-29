# TCA Agentic Engineering: course material review

**Reviewed:** 29 July 2026
**Scope:** `docs/TCA-notes.docx`, `docs/TCA-handout.docx`, the four decks in `docs/`, `vibe.md`, `AGENTS.md`, `README.md`, and the code at tags `checkpoint-0-empty` through `checkpoint-3-hardened`.
**How to use this file:** each finding has an ID, a severity, and a concrete fix. Hand a section of it to an agent as a work order, or work top to bottom. Severities: **P0** breaks on the day, **P1** damages credibility or learning, **P2** polish.

---

## 0. v2 status (updated 29 July 2026)

The v2 artefacts are built: `TCA-handout-v2.docx`, `TCA-notes-v2.docx`, and v2 copies of all four decks. Decisions taken: participants build the app themselves and the checkpoints are an emergency net only; Section 2 is now teach 20 / lab 60 / reflect 10; the timezone gap is named as a trap rather than fixed; no code changes.

**Closed in v2**

| ID | How |
|---|---|
| F-01 | Prompts now build the app the labs claim to build. Section 2 gained the module split, scheduled days and colour tiles; the diff-against-the-checkpoint exercise is gone; the reference is framed as a working example, never a score to match. |
| F-02 | Every net instruction uses `./scripts/setup.sh` and `./scripts/dev.sh`, which are true at all four tags. The Section 1 scaffold prompt asks for a Makefile, so `make dev` is true in the student's own repo. |
| F-03 | Students build their own app, so nothing is pre-built. The monthly ring and the test suite are genuinely absent when Section 3 asks for them. |
| F-04 | Reframed as the section's set piece: a new prompt makes the agent prove the gap and record it as an `xfail`. Slide 8's MIDNIGHT card now says nothing in the app knows. |
| F-05 | The embedded handout copy is gone from the notes; the union of prompts lives in the handout. |
| F-07, F-08 | Section 2 is 20/60/10, the welcome is 15 minutes, and the "six hours" claim is gone. |
| F-09 | Resolved in advance: Agentic slides 11 and 18 are reference pages, out of the front. Stated in the notes and in slide 22's own note. |
| F-10 | Every slide of every deck has purpose-written notes. Vibe Coding 13 and 14 no longer carry copies of 11 and 12. |
| F-11 | The notes' teach tables are now a slide-by-slide mirror of the decks. A permissions slide was added to Vibe Coding; spec-driven work and reasoning effort moved to the handout. |
| F-12 to F-20 | Duplication removed: one command map, one worktree block, one prerequisites list, one takeaways slide. |
| F-21 to F-31 | All eleven corrected in the decks and the handout, and machine-checked by `verify.py`. |

**Still open, because they need code or a decision you have not made**

| ID | What is still true |
|---|---|
| F-32 | `backend/main.py:28` still has wildcard CORS with credentials, and it is less safe than `checkpoint-1-working`. The v2 Section 1 prompt asks for a Vite proxy instead, so student apps avoid it, but the reference repo will still fail its own Section 3 security pass. |
| F-33 | `docs/` is still tracked, so the facilitator notes and speaker notes ship in the student repo. Decide whether that matters before the day. |
| F-34 to F-36 | `checkpoint-1` still uses the deprecated `on_event("startup")`; seeds differ across checkpoints; `checkpoint-2`'s `make test` runs one file. |
| F-06 | `vibe.md` is still in the repo root, still describing a 25-minute Claude-only Section 1 that contradicts the notes. Nothing in v2 references it. Delete it or move it to `docs/archive/`. |
| F-37 | The facilitator smoke-test has not been run on a clean clone. Do that with the v2 version in the notes, section 7. |

---

## 1. Verdict up front

The teaching material is strong. The three-rung ladder is a genuinely good spine, the decks are better written than most commercial training, and the speaker notes are the most valuable asset in the set. The problem is not quality, it is **integrity between artefacts**.

Three findings dominate everything else:

1. **The checkpoints do not match the labs.** `checkpoint-1-working` to `checkpoint-2-features` is 2,816 inserted lines across 43 files. The Section 2 lab is four prompts in 50 minutes. A student who does the lab correctly and then diffs against `checkpoint-2-features`, which the notes tell them to do at the start of Section 3, will find an app they did not build and cannot account for. This is the single biggest defect in the day. (F-01)
2. **`make` does not exist at `checkpoint-1-working` or `checkpoint-0-empty`.** The handout's safety-net block is `git checkout checkpoint-1-working` then `make dev`. That fails. The safety net is the emotional centrepiece of the day and it is broken in the one document every student holds. (F-02)
3. **Nine on-screen tool claims are now wrong**, verified against the live docs this week. Two of them are inverted, not merely stale: the Codex hooks flag and the Codex approvals command. Getting a slash command wrong in front of engineers costs more authority than any content gap. (Section 6)

Answer to the direct question you asked, "are the prompts too small to build something like TCA Habits": **Section 1's prompt is fine and does the job. Section 2's prompts are nowhere near sufficient, by roughly a factor of four. Section 3's are adequate but describe features that already exist in the checkpoint they start from.** Detail and rewritten prompts in Section 5.

---

## 2. P0: things that break on the day

### F-01 · The Section 2 lab cannot produce `checkpoint-2-features`
**Severity: P0.** `TCA-notes.docx` Section 2 lab, Blocks A–D.

Measured gap between the two tags (excluding lockfiles):

```
checkpoint-1-working  →  checkpoint-2-features
43 files changed, 2816 insertions(+), 306 deletions(-)
backend/main.py:   186 → 418 lines
frontend/src/App.tsx: 100 → 235 lines, plus 10 new components
```

The Section 2 lab asks for exactly four things: an `AGENTS.md`, an `/add-feature` command, a stats view, a weekly summary, and an encouragement nudge. Nothing in any prompt in any document asks for the following, all of which are in `checkpoint-2-features`:

| Present at checkpoint-2 | Requested by a prompt? |
|---|---|
| `target_days` weekday scheduling (0=Sun convention) | No |
| `is_due_today`, "scheduled day" streak semantics | No |
| `category` (family / fitness / hobby / personal) | No |
| `color` + the 9-colour palette (`lib/colors.ts`) | No |
| Tailwind v4, `index.css` theme tokens | No |
| Dark mode, pre-paint script, `lib/theme.ts` | No |
| Tile grid UI (`HabitTile`) replacing the list | No |
| `BottomNav` + two-view routing | No |
| `Modal`, `AddHabitModal` (create/edit, colour picker) | No |
| `HabitDetailModal` + 30-day heatmap | No |
| `ProgressRing` | Only in Section 3, where it already exists |
| `PATCH /habits/{id}`, `DELETE /habits/{id}` | No |
| `GET /habits/{id}/history`, `GET /stats/calendar` | No |
| `longest_streak`, `total_completions`, week progress | Partially (stats view) |
| Split of `main.py` into `models`/`schemas`/`database` + `run_migrations()` | No |
| Optimistic updates, `api.ts`, `types.ts` | No |
| `Makefile`, `scripts/backend.sh`, `scripts/frontend.sh` | No |

`target_days` is the worst of these, because it is not cosmetic. It changes the definition of a streak from "consecutive calendar days" to "consecutive scheduled days". `AGENTS.md` elevates the 0=Sun convention to a headline pattern, the reviewer sub-agent is told to hunt for weekday-convention bugs, and the Section 3 test prompt says "a missed **scheduled** day resets the streak". A student who followed the labs has `current_streak(completed_dates)` with no concept of scheduling, so that prompt is meaningless against their code and the reviewer's brief is fiction.

**Fix. Pick one:**

- **Option A (recommended): shrink the checkpoints to the labs.** Re-cut `checkpoint-2-features` so it contains only what Blocks A–D produce: contract, `/add-feature` command, stats view, weekly summary, encouragement, plus the `Makefile` and the `main.py` split if you want them (add a prompt for the split). Move the polished product to a separate tag, `reference-full-app`, and introduce it honestly on a slide as "this is what it looks like after a few more days; you are not building this today." Cost: one re-cut of two tags. Benefit: every claim in every document becomes true.
- **Option B: keep the polished app and buy the time.** Needs roughly 4 to 6 more lab blocks and a second day. Not viable in 90 minutes. Do not attempt this by adding prompts to the existing lab.
- **Option C (cheap mitigation if you are delivering soon):** keep the tags, delete the "diff your work against the checkpoint" exercise, and say explicitly at the start of Section 2: "the checkpoint is a fuller version than the lab builds; treat it as a reference implementation, not as your work." Weakest option, because it quietly retires one of your better exercises.

**Acceptance:** `git diff checkpoint-1-working checkpoint-2-features --stat` should be plausibly reachable by the prompts in the lab. My target: under 800 inserted lines.

---

### F-02 · The safety net does not run at the checkpoint it points at
**Severity: P0.** `TCA-handout.docx` §"The safety net"; `TCA-notes.docx` "Getting the Code" and "Welcome and Framing".

```
checkpoint-0-empty:      NO MAKEFILE
checkpoint-1-working:    NO MAKEFILE
checkpoint-2-features:   Makefile present, but no `check`, `lint` or `typecheck` targets
checkpoint-3-hardened:   full Makefile
```

Consequences, all of which happen in the room:

- Handout: `git checkout checkpoint-1-working` then `make dev` → fails. `checkpoint-1-working/README.md` correctly says `./scripts/dev.sh`, so the repo contradicts the handout.
- Handout "Setup & run" block advertises `make check` as available from clone. On `main` it is. At checkpoint-1 there is no Makefile at all; at checkpoint-2 `make check` does not exist.
- Notes, "Welcome and Framing", the live reset demo: `git checkout checkpoint-1-working; make dev`. Your opening demo fails on stage.
- Notes, facilitator smoke-test: `for t in checkpoint-1-working ...; do git checkout $t && make setup && make test; done`. Fails at the first tag, so the pre-day verification script reports BROKEN for a checkpoint that is actually fine.

**Fix:** add the `Makefile` (and `scripts/backend.sh`, `scripts/frontend.sh`) to `checkpoint-0-empty` and forward, with `test` present from checkpoint-1 and `check`/`lint`/`typecheck` present from checkpoint-2. Cleanest: make the Makefile part of the scaffold at checkpoint-0 with targets that no-op or fail with a helpful message until the relevant tooling arrives. Then `make dev` and `make check` are true everywhere, in one sentence, in every document.

**Acceptance:** the facilitator smoke-test in the notes passes unmodified across all four tags, from a clean clone.

---

### F-03 · Section 3 tells students to build two things that already exist
**Severity: P0.** `TCA-notes.docx` Section 3, Blocks A and C; `TCA-Agentic-Engineering.pptx` slides 3, 8, 22.

- **Block C** asks the agent team to ship "a monthly progress ring". `checkpoint-2-features` already contains `ProgressRing.tsx`. It does not contain the monthly endpoint, so the feature is half-built, which is worse than either state: students will not know whether their component is theirs or the checkpoint's.
- **Block A** asks for "a pytest suite" as if none exists. `checkpoint-2-features` ships `backend/tests/test_api.py`, 139 lines. Deck slide 3's speaker note says out loud, "the weekly summary and the AI encouragement feature both went in this morning without a single test." That is false at the checkpoint they just reset to. Someone will run `make test`, see green, and ask.

**Fix:** remove `ProgressRing.tsx` and `test_api.py` from `checkpoint-2-features` (Option A above does this anyway), or change Block C's feature to something genuinely absent. Good candidates that exercise the same logic: "pause a habit for a week without breaking its streak", "a per-habit best-month view", "archive instead of delete". Amend slide 3's note either way.

---

### F-04 · The timezone claim is not implemented and not tested
**Severity: P0 for credibility.** Promised in the handout, the notes (Section 3 Block A), and `TCA-Agentic-Engineering.pptx` slide 8 ("MIDNIGHT · Whose 'today'? Timezones are where streaks quietly lie").

There is no timezone handling anywhere in the codebase. `backend/main.py` calls `date.today()`, which is server-local. There is no user timezone field, no UTC normalisation, no offset. And `backend/tests/test_streak_logic.py` relabels a different rule as the timezone test:

```python
def test_today_not_done_does_not_break_streak():
    # The boundary rule: a day still in progress must not zero the streak.
```

That is the in-progress-day rule, not a timezone test. The docstring calls it `the today-not-yet-done ("time-zone boundary") rule`, which is the material talking itself into a claim.

This is the sharpest available demonstration of your own thesis, that a confident-looking test proves nothing, and right now it is an unforced error instead. **Fix, and make it the set piece:** either implement a real timezone (add `tz` to the habit or the request, inject "today" instead of calling `date.today()`, test with two zones straddling midnight), or rename the rule honestly everywhere and cut the midnight card from slide 8. My recommendation: implement it, then show the room that the existing test was decoration. That is Golden Rule 2 landing on your own repo, which is worth more than the slide.

---

## 3. Document-versus-document conflicts

### F-05 · Two divergent copies of the student handout
**Severity: P1.** `TCA-handout.docx` is duplicated verbatim inside `TCA-notes.docx` (notes lines 336–409), and the two copies have **already drifted**:

| | `TCA-handout.docx` | copy inside `TCA-notes.docx` |
|---|---|---|
| "Prompts that carry the day" | full Section 1 scaffold prompt, verbatim | replaced with a one-line pointer, "end with: show me a plan" |
| Recovery-from-breakage prompt | absent | present |
| Feature-by-outcome prompt | absent | present |

So the handout the students hold is missing two of the six prompts the notes think are on it, and the notes' copy is missing the one prompt students most need to paste. **Fix:** delete the embedded copy from the notes and replace it with a single line, "Student handout: see `TCA-handout.docx`". Then merge the union of the prompts into the real handout. One source of truth per artefact.

### F-06 · `vibe.md` is a competing, contradictory Section 1
**Severity: P1.** 186 lines, committed at `checkpoint-2` and on `main`, and it contradicts the course on nearly every axis:

| | `vibe.md` | `TCA-notes.docx` Section 1 |
|---|---|---|
| Duration | "in 25 Minutes" | 90 minutes |
| Tools | Claude Code only, no mention of Codex | both, explicitly |
| Approach | 6 phases, 8 small prompts, build your own named app | one large prompt producing the real app |
| Habits | your choice, "Daily Wins" | seeded TCA Habits |
| Checkpoints | never mentioned | the core safety mechanism |
| Plan Mode, contract, `@path`, `/context` | absent | taught |
| Golden rules | five, different wording | five, different wording |

Students will find it, because it is in the repo root with an inviting name, and the two documents give conflicting instructions about the same 90 minutes. It also duplicates the prerequisites table (a third copy, after the notes and the handout).

**Fix:** decide which Section 1 you are teaching. If it is the notes, delete `vibe.md` from `main` and from the checkpoints, or move it to `docs/archive/` and mark it superseded. If `vibe.md`'s build-your-own-app approach is actually better for a returning-from-leave cohort, and it has a real argument in its favour, then rewrite Section 1 of the notes around it and delete the current Section 1. Do not ship both.

### F-07 · Section 2 timing: 20 minutes on the slide, 25 in the notes
**Severity: P1.** `TCA-Vibe-Engineering.pptx` slide 1 says "20 MINUTES". Notes say "Teach (25 min)". Section 1 and 3 agree between deck and notes; only Section 2 disagrees. Also, Section 2's lab blocks total 50 minutes (10+10+15+15) against a stated 55, whereas Sections 1 and 3 add up exactly.

### F-08 · The welcome segment is 15 minutes or 30, depending on the document
**Severity: P1.** The notes' Run of Day has "09:30 Welcome, introduction… 30 min" but the next row is 09:45, which is 15 minutes later. The notes then dedicate a 30-minute section, "Welcome and Framing (30 min)", to it. The 390-minute day only balances if welcome is 15 (15+15+90+15+90+45+105+15 = 390). So the 30 is wrong twice, and the framing section is scoped for double the time it has. Either cut the framing content to 15 minutes or start at 09:15.

Related: the cover of the notes says "six hours". Actual teaching time is 285 minutes, 4 hours 45 minutes; 390 minutes door to door including 60 minutes of breaks and lunch. Say "a full day, 09:30 to 16:00" and drop the number.

### F-09 · Section 3's own deck says it is over budget and nobody has decided what to cut
**Severity: P1.** Speaker note on `TCA-Agentic-Engineering.pptx` slide 22: *"TEACH TIME: 36.5 minutes as it stands, against a 30-minute budget… Decide before the day which way you are paying for it… Do not discover this at 15:40."* Three options are listed and none is chosen, and the arithmetic is not reflected in the notes' Run of Day, which still says 105 minutes with a 30-minute teach.

This is good facilitator honesty and a bad plan. **Fix:** decide now. My recommendation: cut slide 11 (HOW THE HANDOFF WORKS) and slide 18 (THE FULL CATALOGUE) from the front and put both in the handout. That is 2 minutes recovered and slide 18's own note already says "do not teach this slide", which means it is a handout page wearing a slide costume. Then update the notes to match, and mark the run-of-day figure as the single source.

### F-10 · Speaker notes on Vibe Coding slides 13 and 14 belong to slides 11 and 12
**Severity: P1.** Verified by reading the notes XML:

| Slide | Title on screen | Speaker note actually attached |
|---|---|---|
| 11 | THE COCKPIT (Skill #3) | "SKILL #3 (2:30). The cockpit…" ✓ |
| 12 | CONTEXT IS THE FUEL | "CONTEXT (2:00). Metaphor: context is fuel…" ✓ |
| 13 | WHEN IT BREAKS (Skill #4) | "SKILL #3 (2:30). The cockpit…" ✗ longer duplicate of 11 |
| 14 | COMMIT SMALL, SHIP OFTEN (Skill #5) | "CONTEXT (2:00). Context is fuel…" ✗ longer duplicate of 12 |

Slides 13 and 14 have **no notes of their own**, and slides 11 and 12 have the shorter of the two versions. It looks like an expansion pass that pasted into the wrong slides. Two of your five golden rules, "recover by reporting symptoms" and "commit small", are the ones left unscripted. **Fix:** write notes for 13 and 14, and promote the longer versions onto 11 and 12 where they belong.

### F-11 · Deck teach content diverges from the notes' teach tables
**Severity: P1.** The notes present each section's teach as a table of concepts with "what to demonstrate" and "the message to land". The decks do not match those tables.

Section 1, in the notes but not on a slide:
- **Approvals / sandbox.** The notes require demonstrating Claude's approve-each versus auto-accept and Codex's three sandbox modes, with the message "never auto-run destructive shell in a real repo". The deck reduces this to one bullet inside "WHAT THE AGENT ACTUALLY IS" (slide 7). For a room of returning engineers about to point an agent at a work laptop, this is the safety content and it has no slide.
- **Spot-check output** as a named skill.

Section 1, on a slide but not in the notes:
- ONE BOX, TWO VOICES (system versus user prompt)
- CONTEXT ENGINEERING (the layered stack, RAG and MCP as "an automated way to write a better system prompt")
- WHAT THE AGENT ACTUALLY IS
- PLAN REVIEW, NOT PLAN WRITING (the 2025→2026 risk flip)
- WHAT CHANGED IN A YEAR

Those five are the best material in the deck. They are not in the notes at all, so any facilitator other than you, running from the notes, will not deliver them.

Section 2, in the notes but not on a slide: **spec-driven work** (Objective / Key decisions / Verification) and **extended thinking / reasoning effort**. Both are named teach items with messages to land.

Also, command coverage disagrees: the notes and handout carry a 19-row Claude-versus-Codex command map; the Vibe Coding deck carries a 4-row one (SEE / LOAD / TRIM / RESET). The 4-row version is pedagogically better. Declare it the teaching artefact and demote the 19-row table to the handout only, rather than having two maps of different sizes in circulation.

**Fix:** rewrite the notes' teach tables to be a description of the actual decks, slide by slide, with the timing stamps the decks already carry. The notes should be derived from the decks, not parallel to them. Add slides for approvals/sandbox and spec-driven work, since both are load-bearing.

---

## 4. Duplication to remove

| ID | What | Where | Recommendation |
|---|---|---|---|
| F-12 | Student handout, in full | standalone `.docx` + inside `TCA-notes.docx` | Delete the embedded copy (see F-05) |
| F-13 | Prerequisites / version-check block | notes "Prerequisites", handout "Setup & run", `vibe.md` "Prerequisites" | One canonical copy: the pre-work email and the handout. Cut from the notes body, replace with a pointer |
| F-14 | 19-row command map | notes (Section 1 teach) + handout, character for character | Handout only. The notes should say "students have this on the handout" |
| F-15 | Checkpoint-reset snippet | notes "Getting the Code", notes "Welcome and Framing", notes Section 2 level-set, notes Section 3 level-set, handout | Define once in "Getting the Code"; later mentions reference it |
| F-16 | Worktree sequence | notes Section 2 (11 lines), handout (5 lines), Vibe Engineering slide 8, Agentic slide 12 speaker note (a fourth, again different) | One canonical version. The Agentic note explicitly says "it is also in the handout, so it is fine to say handout, page on parallel work" — good instinct, apply it everywhere |
| F-17 | "THE DAY IS A LADDER" | Opening slide 6, Vibe Coding slide 4, Vibe Engineering slide 2, Agentic slide 2 | Keep. Deliberate motif, and the YOU ARE HERE marker earns it |
| F-18 | "What you'll walk away with" by level | Opening slide 10, Vibe Coding slide 16, notes "What Each Level Should Walk Away Having Learned" | Three versions of the same rusty/mid/senior framing. Keep Opening 10 and the notes table; cut Vibe Coding 16 and recover 1.5 minutes toward F-09 |
| F-19 | Golden rules | Vibe Coding 17 (5), Vibe Engineering 12 (5), Agentic 23 (5), handout (7, different again) | Fine per section, but the handout's 7 are a fourth set. Make the handout the union of the three fives, labelled by section |
| F-20 | Planning then/now | Vibe Coding slide 10 and again slide 15 row 1 | Acknowledged in the notes as an anchor. Acceptable, but if you need time, slide 15 can lose the planning row |

---

## 5. Are the prompts big enough? Prompt-by-prompt assessment

### Section 1 scaffold prompt: **adequate. Keep it.**
It names both tables and their columns, four endpoints, idempotency, the streak definition, the seed, CORS, the frontend stack, and ends with "show me a plan before you write anything." It is a good example of outcome-plus-constraint and it does produce something close to `checkpoint-1-working`. Two small notes:
- It asks for CORS on localhost:5173 while the reference frontend solves the same problem with a Vite proxy, and `main.py` on `main` actually ships `allow_origins=["*"]`. Minor incoherence between what you ask for and what you show.
- It specifies `habits(id, name, emoji, created_at)`, which locks students out of the scheduling model the rest of the day assumes. If you keep `target_days` in the product, put it in this prompt.

### Section 2 prompts: **materially too small.** Four prompts, roughly 120 words of specification, against 2,816 lines of checkpoint. See F-01.

What is missing is not prompt length, it is prompt count. The lab has no block that asks for the UI, the schema growth, or the module split, and those are three quarters of the delta. If you take Option A in F-01 the problem mostly evaporates. If you keep any of the polished product, you need explicit prompts. Here are the ones I would add, written in the outcome-plus-constraint style the course teaches:

**Add to Block A (contract), because the contract cannot describe patterns the code lacks:**
> Split `backend/main.py` into `models.py` (SQLAlchemy), `schemas.py` (Pydantic), and `database.py` (engine, session, and a `run_migrations()` that adds missing columns at startup). Keep every endpoint's behaviour identical, then run the app and confirm nothing changed.

**New block, scheduling, 10 min. This is the prerequisite for Sections 2 and 3 to make sense:**
> A habit should only be due on the days I choose. Add a per-habit set of target weekdays, stored as integers where 0 is Sunday, and make the streak count only scheduled days: missing a day the habit was never due must not break it. Add the migration. Tell me which weekday convention Python uses and how you are converting, before you write the code.

**Replace Block B's invocation, to buy the UI honestly:**
> `/add-feature` a stats view: total completions, how many habits have a live streak, the longest streak ever, and this week's completion rate as a bar per day.

> `/add-feature` give each habit a colour from a fixed palette and show habits as a grid of tappable tiles that fill with their colour when complete, instead of a list. Keep the existing behaviour identical.

> `/add-feature` a light and dark theme with a toggle in the header, remembered between visits, with no flash of the wrong theme on load.

Each of those runs the five-step workflow you just built, which is the actual point of Block B, and each one is a visible win for a returning-from-leave cohort. Three invocations of `/add-feature` at 5 minutes each is a better use of 15 minutes than one.

**Keep verbatim:** the weekly-summary decision-forcing prompt. It is the best prompt in the whole set. It names the decision, names the constraint ("must work with no API key"), and withholds permission ("wait for my decision"). Use it as the worked example when you teach prompt shape.

### Section 3 prompts: **adequate shape, wrong targets.**
The harness prompt, the sub-agent prompt, the team prompt, the hooks prompt and the CI prompt are all well formed. The problems are F-03 (the features already exist) and F-04 (the timezone case cannot pass because the capability is absent). Fix the targets, not the wording.

One addition worth 90 seconds, because it is the highest-value thing on slide 17 and no prompt exercises it:
> Make the guardrail hook fail on purpose: change the streak logic with no test touched, and show me the block message. Then show me what happens if the hook exits 1 instead of 2.

That converts the exit-code trap from a claim into an experience, which is the same move as "show me one test failing".

---

## 6. On-screen claims that are now wrong

Verified 29 July 2026 against `code.claude.com/docs` and `developers.openai.com/codex` only. The notes' own facilitator checklist says "confirm current Claude Code and Codex command syntax against the live docs; this moves fast." It was right.

| ID | Where | Claim | Reality |
|---|---|---|---|
| F-21 | Agentic slides 14, 18 | "Claude Code exposes 28 events" | **30.** The list of names on slide 18 is correct and complete; only the count is wrong (and slide 18 itself lists 30) |
| F-22 | Agentic slide 17 speaker note | Codex hooks are "experimental and off by default", need `[features] hooks = true` | **Inverted.** Hooks are **enabled by default**; `[features] hooks = false` turns them off. A facilitator following this note will send the Codex half of the room to debug a non-problem |
| F-23 | Handout command map; notes Section 1 teach table | Codex approvals = `/approvals`, modes "read-only, workspace-write, full-access" | Command is **`/permissions`**. User-facing modes are Ask for approval / Approve for me / Full access / Custom. The `sandbox_mode` value is **`danger-full-access`**, not `full-access` |
| F-24 | Handout; notes; `SECURITY.md` | Claude Code `/review` reviews your diff | `/review` is now a read-only pass over **a GitHub PR by number**. Local diff review is **`/code-review`** |
| F-25 | Handout ("Sub-agents: `/agents`"); notes Section 3 Block B | `/agents` manages sub-agents | Since v2.1.198 `/agents` only prints a reminder to ask Claude or edit `.claude/agents/` directly. The wizard is gone |
| F-26 | Handout ("Undo in-session: `/rewind` (Esc Esc)") | Esc Esc rewinds | Only **when the prompt input is empty**. With text in the box, double-Esc clears the box. Worth one sentence, because someone will try it mid-prompt and conclude it does not work |
| F-27 | Handout; Vibe Coding slide 10; notes | "Plan Mode (Shift+Tab)" | Shift+Tab **cycles** default → acceptEdits → plan, so it is two presses, not one. There is also a standalone `/plan`. On Windows without VT input the binding is Alt+M |
| F-28 | Notes Section 2 Block B; `.codex/prompts/add-feature.md` | Codex custom prompts live in `~/.codex/prompts/` | True, but the docs page now carries a deprecation banner: **custom prompts are deprecated, use skills**. Repo-level sharing is now `.agents/skills`. Since Block B's whole point is "codify a workflow", teach the current mechanism |
| F-29 | Notes Section 2 Block B ("promote it to a skill") | `.claude/commands/` and skills are separate things | They have merged: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`, existing commands keep working, skills are recommended and win on name collision. "Promote it to a skill" is now the mainline path, not a stretch |
| F-30 | `.claude/settings.json` (shipped code) | `"matcher": ""` on the `Stop` hook | `Stop` does **not** support matchers; the field is silently ignored. Harmless, but it is in the reference implementation students copy, and the deck spends a slide on hook precision |
| F-31 | Vibe Engineering slide 8 | `git worktree add ../feat-a feat-a` | Fails if branch `feat-a` does not exist: `fatal: invalid reference`. Needs `-b`. The handout and notes get this right, so the slide contradicts them |

Verified correct, in case anyone challenges them: exit codes 0/2/1 behave as slide 17 says (with two exceptions: `WorktreeCreate` aborts on any non-zero, and non-blockable events ignore exit 2); Codex has exactly the 11 hook events listed; Codex sub-agents are TOML in `.codex/agents/`; `codex exec --json` works; `/security-review` is built in, not a plugin; Codex reads `AGENTS.md` natively and Claude Code needs the `@AGENTS.md` import, so `CLAUDE.md` in this repo is correct.

**Fix:** one editing pass over the handout command map, notes Section 1 and 3 teach tables, and Agentic slides 14, 17, 18. Then add a line to the facilitator checklist: re-verify the command map the week of delivery, not "before the day".

---

## 7. Add, cut, keep

### Add
- **A15-minute "approvals and sandbox" slide in Section 1** (F-11). The one place the day touches real risk, and it currently has a bullet. For a cohort about to run agents on employer laptops, this needs the airtime.
- **A slide, or one line on the ladder slide, that names what the checkpoints contain.** Once F-01 is fixed this is a 10-second orientation. Without it, resetting feels like cheating and students do not know what they are getting.
- **Two prompts to Section 2** (scheduling, module split) and **two `/add-feature` invocations** (tiles/colour, theme), per Section 5.
- **A "what to do on Monday" one-pager for the handout.** Agentic slide 24 is the best slide in the entire deck set and its content exists nowhere the student can take home. The handout's Golden Rules do not carry it.
- **A hook-failure prompt in Section 3** (Section 5).
- **A real timezone case** (F-04).

### Cut
- `vibe.md`, or the notes' Section 1 (F-06). One of them.
- The handout copy embedded in the notes (F-05).
- Vibe Coding slide 16, TWO WINS ONE SESSION (F-18).
- Agentic slide 11 (HOW THE HANDOFF WORKS) and slide 18 (THE FULL CATALOGUE) from the front, into the handout (F-09).
- The duplicated prerequisites and command-map blocks from the notes body (F-13, F-14).
- The "six hours" claim (F-08).

### Keep, and do not let anyone edit it
- The ladder, and the section names. "Vibe coding is using the tool; vibe engineering is deliberate use of it; agentic engineering is engineering around it" is a clean, defensible taxonomy and the whole day hangs off it.
- Every FROM/TO mindset-shift pair. Those four lines are the day's argument.
- "A contract is a promise. A hook is a fact." (Agentic 13.)
- "Don't read harder. Build the proof." (Agentic 21.)
- "Reaching for the checkpoint is the design, not a failure." Repeated in five places, correctly.
- The rusty/confident split at the bottom of the one-rule slides. It is the most emotionally intelligent thing in the material and it is doing real work for this cohort.
- The closing line about the mechanical part of the job being the part that was automated while they were away. Do not soften it.

---

## 8. Code and repo defects worth fixing before the day

| ID | Sev | Finding |
|---|---|---|
| F-32 | P1 | **Wildcard CORS with credentials.** `backend/main.py:28-34` sets `allow_origins=["*"]` **and** `allow_credentials=True`. That combination is invalid per the CORS spec, browsers reject it, and it is strictly less safe than `checkpoint-1-working`, which correctly pinned `http://localhost:5173`. The app got less secure between checkpoints. Section 3 runs a security-review pass over this repo; this is what it will find. Either fix it, or pre-plant it deliberately and let the security pass catch it, and say so in the notes |
| F-33 | P1 | **Facilitator material ships in the student repo.** `docs/TCA-notes.docx` is tracked, including the run of day, lead names, the "hold off helping for the first three minutes" instruction, and the speaker notes marking slides SKIPPABLE and flagging you are 6.5 minutes over budget. If the repo is public, students can read your stage directions. Move the notes and decks to a private facilitator repo, or gitignore them and distribute separately. The handout can stay |
| F-34 | P2 | **`checkpoint-1-working` uses `@app.on_event("startup")`**, deprecated in FastAPI. `pyproject.toml` pins `fastapi>=0.111.0` with no upper bound, so a student installing today gets deprecation warnings on first run of the checkpoint you told them is known-good. Either pin an upper bound or use `lifespan`, as `main` already does |
| F-35 | P2 | **Seed habits differ across checkpoints.** checkpoint-1 seeds "Drink water / Morning walk / Read to the kids"; checkpoint-2 seeds six different ones. A student who resets loses the habit they brought, which the notes make a point of ("one sentence to bring: a habit you actually want to build… makes the day yours"). Either keep the seeds stable or warn them in the reset instructions |
| F-36 | P2 | `checkpoint-2-features` `make test` runs `pytest tests/test_api.py -v` (one file, verbose) while `main` runs `pytest tests -q`. Inconsistent, and it will silently skip any test file a student adds during Section 3 Block A before they change the Makefile |
| F-37 | P2 | I could not run `make check` in this sandbox (no Python 3.11 available offline). **Run the facilitator smoke-test yourself on a clean clone before the day**, per your own checklist, and note that it currently fails for the reason in F-02, not because the code is broken |

---

## 9. Suggested order of work

**Before anything else, decide three things.** Everything downstream depends on them:
1. Does the polished product stay at `checkpoint-2-features` (F-01: Option A, B or C)?
2. `vibe.md` or the notes' Section 1 (F-06)?
3. What gets cut from Section 3's teach block (F-09)?

**Then, in order:**

1. **Re-cut the tags.** F-02 (Makefile everywhere), F-01 (whichever option), F-03 (remove the pre-built ProgressRing and test_api.py), F-36. Verify with the facilitator smoke-test.
2. **The timezone decision.** F-04. Implement it and make it the demonstration, or cut the claim from three documents.
3. **Fix the tool claims.** F-21 through F-31, one editing pass, plus F-30 in the settings file. Half a day.
4. **Restructure the notes.** Delete the embedded handout (F-05), delete the duplicated prerequisites and command map (F-13, F-14), rewrite the teach tables to describe the actual decks slide by slide (F-11), fix the timings (F-07, F-08, F-09).
5. **Rebuild the handout** as the single student artefact: union of the prompts (F-05), the command map, the union of the golden rules (F-19), one worktree block (F-16), and the Monday one-pager from Agentic slide 24.
6. **Deck edits.** Notes for Vibe Coding 13 and 14 (F-10), new approvals slide and spec-driven-work slide (F-11), fix the worktree command on Vibe Engineering 8 (F-31), cut per F-09 and F-18.
7. **Security and hygiene.** F-32 (CORS decision), F-33 (get the facilitator material out of the student repo).
8. **Dry run the whole day end to end from a clean machine**, and time the teach blocks against a stopwatch rather than against the stamps in the notes.

Items 1 and 2 are the ones that change whether the day works. Everything else is craft.
