# Back in the Code: course review and recommendations

Reviewed 17 October 2026, ahead of the next cohort.

**What I read:** `docs/Master_Back in the Code.pptx` (70 slides, including text inside grouped shapes; the deck has no speaker notes), `docs/TCA-slides.pdf` (the previous 67-slide deck), `docs/TCA-student-handout.pdf` (14 pages), `docs/For those without local admin rights/TCA-codespaces-setup.pdf` (11 pages), and the whole repo at `main` and at all four checkpoint tags. I checked tool behaviour against the current Claude Code and Codex documentation on the review date. Sources are at the end.

**What I could not do:** I could see the slides' text but not their visual layout, so nothing below comments on design. I did not run the course prompts end to end in a fresh folder, and I did not test anything on a Windows machine.

**Bottom line:** the course structure is sound, and so is the code. `make check` is green, the build passes, and the AI endpoints fall back to templates correctly. Most of the work is consistency fixes between the Master deck and the handout, which drifted apart when the run of day changed. Moving worktrees to Section 3 is a good call, and the tools now make the move easy. Windows is the biggest gap: none of the four documents gives a Windows learner a working path except the Codespaces guide, and that guide is aimed at a different problem.

**Update, 17 October (after Paul's first read):** worktrees moving to Section 3 is agreed (M2). Three gaps Paul raised are added as M7 (`/model` and token spend, early in the day), M8 (skills) and M9 (how MCP works). The pre-course setup content now lives in a separate handout for students: `docs/TCA-prerequisites.md`.

**Implementation status (17 October, second pass):** everything below has been implemented except where noted.

| Item | Status |
|---|---|
| Repo: skills, `.gitattributes`, preflight, devcontainer, Codespaces host, worktrees ignore, CI bumps, Haiku 5.5 default, setup warnings, `vibe.md` removed | Done on `main` (`02c4026`, `cbe78ef`); CI green |
| M4 checkpoint tags | Refreshed commits ready on branches `checkpoint-1-v3` and `checkpoint-2-v3`; **moving the tags is waiting on Paul** (the permission check blocked rewriting public tags) |
| m14 `httpx` → `httpx2` | **Not done**: adding the new package was blocked by the permission check; waiting on Paul |
| Deck, handbook, prerequisites | Rebuilt from a single content spec; see the files in `docs/` |
| Codespaces guide | Not rebuilt. Its manual Step 2 still works, but the new `.devcontainer` now does it automatically |

Confidence levels: **high** means I checked it in the files or the vendor docs. **Moderate** means it is well supported but I did not test it. **Low** means it rests on third-party sources or inference.

---

## Already fixed in the repo during this review

These went to `main` as commits `a036bab` and `2ad98ca`.

1. **The Stop hook failed whenever the agent changed into a subdirectory.** `make -s check` ran in the session's working directory, so once the agent ran `cd backend` (agents do this all the time), every turn ended in `make: *** No rule to make target 'check'`. The hooks now find the repo root with `git rev-parse --show-toplevel`. (high)
2. **The streak guard gave wrong answers from a subdirectory or a worktree.** `git status --porcelain backend/tests` reads its path relative to the current directory. From `backend/` it never saw the test change, so it blocked legitimate edits. The guard now works out the root from the hook input's `cwd`, which follows the agent into a worktree. I tested six cases, covering the main checkout, a subdirectory and a worktree for both tools. (high)

**Still open:** the `checkpoint-3-hardened` tag points at the old, broken hooks. See M4.

---

## Major: fix these before the next cohort

### M1. The new run of day leaves Section 2 with 30 minutes for about 80 minutes of content

The Master deck's run of day (slide 5) is:

| Time | Segment | Length |
|---|---|---|
| 09:30 | Welcome, setup check | 30 min |
| 10:00 | Section 1 · Vibe Coding | 105 min |
| 11:45 | Lunch | 60 min |
| **12:45** | **Section 2 · Vibe Engineering** | **30 min** |
| 13:15 | Break | 15 min |
| 13:30 | Section 3 · Agentic Engineering | 135 min |
| 15:45 | Showcase and close | 15 min |

In the old deck, Section 2 had 90 minutes. The handout's Section 2 labs still add up to 60 minutes (Blocks A to E: 10 + 10 + 15 + 10 + 15), and the talk adds roughly 20 more. Section 1 grew by 15 minutes and Section 3 by 30.

Either the 12:45 to 13:15 slot is a typo (12:45 to 14:15 would restore 90 minutes and push Section 3 to 14:30), or Section 2 really was cut and the handout has not caught up. (high that the documents disagree; I can't tell which one you intended.)

**Recommendation:** if Section 2 really is 30 minutes, worktrees and the parallel exercise have to leave Section 2 anyway (M2), and the remaining blocks need trimming. My suggested 30 minutes, keeping what Section 3 depends on:

| Keep | Minutes | Why it can't go |
|---|---|---|
| Block A, the contract | 8 | The Section 3 prompts lean on AGENTS.md |
| Block B, `/add-feature` (skip the refactor prompt and use the reference repo's split) | 7 | It is the reusable-workflow lesson |
| Block C, target days only (drop colour tiles) | 10 | The Section 3 progress ring is "percentage of *scheduled* days" |
| Block D, weekly summary in plan mode | 5 (plan only; checkpoint-2 holds the code) | It is the "surface the decision" lesson |

Colour tiles, the theme toggle, the encouragement nudge and the MCP stretch become optional extras, or students pick them up from `checkpoint-2-features`.

### M2. Move worktrees into Section 3 and switch to the built-in commands (agreed)

You are right that the Section 2 version is harder than it needs to be. Students type five raw git commands across two terminals and two tools, and the commands fail in ways that teach them nothing (`invalid reference` without `-b`, getting lost about which terminal is which).

**What has changed (high for Claude Code, from the docs; low for Codex):**

- **Claude Code** creates and cleans up worktrees itself. `claude --worktree nudge` (or `-w nudge`) creates `.claude/worktrees/nudge/` on a new branch `worktree-nudge`. When you exit, it removes a clean worktree automatically and asks before deleting one that has changes. Inside a session you can just say "work in a worktree". Most usefully for Section 3, a sub-agent can carry `isolation: worktree` in its frontmatter, and it then always works in its own temporary worktree.
- **Codex CLI:** third-party write-ups say version 0.154 (September 2026) added an experimental `--worktree` flag and `/worktree` command behind `codex features enable worktrees`. I could not confirm this in OpenAI's own docs, so check it against the Codex changelog before you put it on a slide. The Codex desktop app has had worktrees for longer.

**Why it belongs in Section 3:** in Section 2, the worktree is a parlour trick ("two takes, compare"). In Section 3, it answers a real question the section raises: how do several agents work at once without trampling each other's files? It fits slide 56, "The agent team", directly.

**Suggested Section 3 change (about 5 extra minutes, inside Block C):**

```text
PROMPT
Implement the monthly progress ring twice, in parallel, using two
implementer sub-agents that each work in their own worktree. Then have the
reviewer compare the two diffs and recommend one. I'll decide which to merge.
```

The optional manual path for Claude Code, one line per terminal:

```bash
claude -w ring-a        # terminal 1
claude -w ring-b        # terminal 2
git diff worktree-ring-a worktree-ring-b --stat
```

**Gotchas to put on the slide or in the handout (all moderate or high):**

1. **Commit first.** A worktree is a fresh checkout made from a commit, so uncommitted work never reaches it. Claude Code fails in a repo with no commits (`Failed to resolve base branch "HEAD"`).
2. **Each worktree needs its own `make setup`.** `node_modules` and `backend/.venv` are not copied, and `npm install` costs a minute or two of lab time per worktree.
3. **Port clash.** Two worktrees both running `make dev` fight over ports 8000 and 5173. Have only one run the app, or let the verifier use `make check` only.
4. **Add `.claude/worktrees/` to `.gitignore`.** Otherwise worktree contents show up as untracked files in the main checkout.
5. **Hooks and worktrees.** `$CLAUDE_PROJECT_DIR` stays at the main checkout after Claude enters a worktree. Hooks have to read `cwd` from their input, which is the bug fixed above. This makes a good "why we test the harness" story.
6. **Trust prompt.** Run `claude` once in the folder before `claude --worktree`, or it exits asking you to accept trust. (The Codespaces guide already says this.)

**What Section 2 keeps:** the "second opinion" idea, done without worktrees. Have Claude Code and Codex *review* the same diff, which is already a stretch goal there. That needs no parallel checkouts and takes five minutes.

### M3. Windows learners have no path that works

Look at what a Windows learner meets in the handout, in order:

| Handout step | What happens on native Windows |
|---|---|
| `npm install -g @anthropic-ai/claude-code` | Works, but the npm package now needs Node 22+ and the handout says 18+ (see M5) |
| `python3 --version` | Often opens the Microsoft Store, because `python3` is an alias stub (moderate) |
| `cd ~/my-habits && claude` | `&&` fails in Windows PowerShell 5.1, the version Windows ships. It works in PowerShell 7 (high) |
| `scripts/setup.sh`, `./scripts/dev.sh` | No bash in PowerShell. In Git Bash they run, but `dev.sh` uses `pgrep`, which Git for Windows does not ship, so Ctrl-C can leave servers holding ports 8000 and 5173 (moderate) |
| `make dev`, `make check` | `make` is not installed on Windows (high) |
| Section 3 hooks: `python3 ...`, `make -s ...` | Claude Code runs hook commands in Git Bash on Windows, or PowerShell if Git Bash is absent (docs, high), so both commands hit the problems above |
| Cloning with Git for Windows' default `core.autocrlf=true` | The `.sh` files get CRLF line endings and fail with `bash\r` or `set: pipefail\r: invalid option` errors. The repo has no `.gitattributes` (high that the file is missing; moderate on the exact error) |

**Recommendation:** officially support three paths, and say plainly that native Windows isn't one of them:

1. **macOS or Linux:** the handout as written.
2. **Windows with admin rights: WSL2.** Everything in the handout then works unchanged. Claude Code's docs list WSL2 as supported, and it is the only Windows option where Claude Code's sandboxing works. Codex's docs now prefer its native Windows sandbox, but Codex runs fine in WSL2 too.
3. **Windows without admin rights: Codespaces**, which you already have. Installing WSL needs admin, so this group can't use path 2.

Then add a two-page **"Windows setup"** section to the handout. Draft content:

```powershell
# PowerShell as Administrator, once. Reboot when it asks.
wsl --install -d Ubuntu
```

```bash
# Inside the Ubuntu terminal. Everything from here on is Linux.
sudo apt update && sudo apt install -y make git curl unzip
git config --global core.autocrlf input   # stop CRLF reaching .sh files

# Node 22 via nvm. Check github.com/nvm-sh/nvm for the current install line.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc && nvm install 22

curl -LsSf https://astral.sh/uv/install.sh | sh        # uv
curl -fsSL https://claude.ai/install.sh | bash          # Claude Code
npm install -g @openai/codex                            # Codex (optional)

# The check that catches most WSL problems: these must be Linux paths.
which node npm claude      # /home/<you>/...   NOT /mnt/c/...
```

Rules for the page (moderate to high):

- **Work in the Linux home folder** (`~/my-habits`), never under `/mnt/c/...`. Vite's file watching and `npm install` are much slower across the Windows filesystem boundary, and hot reload can stop working.
- **Open files from WSL:** `code .` with the VS Code WSL extension, or `explorer.exe .` to see the folder in Windows.
- **The browser stays on Windows.** `http://localhost:5173` in Edge or Chrome reaches the WSL2 dev server through WSL's default localhost forwarding.
- **If `which node` shows `/mnt/c/...`,** WSL is picking up Windows' Node from PATH. Install Node inside WSL and open a new terminal.
- **Newline in the prompt:** `Ctrl+J` works everywhere. Pasting an image is `Alt+V` on Windows and WSL, not `Ctrl+V`.

And a **command translation table** for people who end up in PowerShell anyway:

| You want | bash / WSL / macOS | Windows PowerShell |
|---|---|---|
| Chain two commands | `cd my-habits && claude` | `cd my-habits; claude` (`&&` needs PowerShell 7) |
| Set an env var for this session | `export ANTHROPIC_API_KEY=sk-...` | `$env:ANTHROPIC_API_KEY = "sk-..."` |
| Where is a command? | `which claude` | `Get-Command claude` or `where.exe claude` |
| Run Python | `python3` | `py` (avoid the `python3` Store alias) |
| Delete a folder | `rm -rf node_modules` | `Remove-Item -Recurse -Force node_modules` |
| Show a file | `cat AGENTS.md` | `Get-Content AGENTS.md` (`cat` works as an alias) |
| What is holding port 8000? | `lsof -i :8000` | `Get-NetTCPConnection -LocalPort 8000` |
| Kill it | `kill <pid>` | `Stop-Process -Id <pid>` |
| Activate the venv (rarely needed with `uv run`) | `source .venv/bin/activate` | `.venv\Scripts\Activate.ps1` |
| Run the course scripts | `./scripts/dev.sh` | Not supported. Use WSL2 or Codespaces |
| Install Claude Code | `curl -fsSL https://claude.ai/install.sh \| bash` | `irm https://claude.ai/install.ps1 \| iex` |

**Matching repo changes** (small; I haven't made them, so tell me if you want them):

- Add `.gitattributes` with `*.sh text eol=lf` and `Makefile text eol=lf`. This one line stops the CRLF failure even for people who ignore the WSL advice. (high value, almost no cost)
- Add a "Windows" section to `README.md` that points to WSL2 and Codespaces.
- Optional: have `scripts/setup.sh` warn when it detects it's running under `/mnt/c/` or in Git Bash (`uname` starting `MINGW`).

### M4. The `checkpoint-3-hardened` tag holds the broken hooks

Students who fall behind in Section 3 run `git checkout checkpoint-3-hardened` and get the hook versions from before `a036bab`. The Stop hook then fails on the first turn after the agent changes into `backend/`. That is the same failure that started this review. (high)

**Recommendation:** before the cohort clones, move the tag to a commit with the fixes: `git tag -f checkpoint-3-hardened <commit> && git push -f origin checkpoint-3-hardened`. Moving a public tag affects anyone who already cloned, but the next cohort hasn't cloned yet. If you'd rather not move it, add `checkpoint-3-hardened-v2` and update the deck and handout to use it. I haven't touched the tag.

Two related checkpoint points:

- The checkpoints hold the code but not the course docs, which are only on `main`. That's fine. Just never tell students to "pull main" mid-lab, because it jumps them past every checkpoint.
- The handout's reset recipe is `git stash && git checkout checkpoint-1-working`, which leaves a detached HEAD. A student who commits there loses that work the next time they check out something else. Use `git switch -c rescue checkpoint-2-features` instead, which makes a branch at the checkpoint. (high)

### M5. Install instructions disagree with each other and with the vendor docs

- The handout says `npm install -g @anthropic-ai/claude-code` with **Node 18+**. Claude Code's docs now say the npm package **needs Node.js 22 or later**, and they recommend the native installer (`curl -fsSL https://claude.ai/install.sh | bash`, or `irm https://claude.ai/install.ps1 | iex` on Windows). The native installer also updates itself. Your own Codespaces guide already recommends the native installer, so the two student documents contradict each other. (high)
- The repo's `vibe.md` still tells students to use `brew` and `npm` and to plan for "25 minutes". It is tracked, and it is the first thing a student sees if they open the repo root. Delete it, or rewrite it as a short pointer to the handout. (high that it's stale)
- **Recommendation:** in "Before the day", use the native installer and Node 22+ (needed for Vite anyway, and what Codex prefers). Keep `npm install -g @openai/codex` for Codex. Add `claude doctor` as the single setup check: it reports install health and settings errors without starting a session.

### M6. The Master deck contradicts itself about Section 2's outcome

- Slide 8 says the end of Section 2 brings "scheduled days, colour tiles, a weekly summary and an AI nudge". Slide 41 says "a stats view" instead of scheduled days and colour tiles.
- The handout builds scheduled days and colour tiles. The stats view is a stretch goal.
- Section 3's progress ring is defined over "scheduled days this month". Without the target-days feature the ring has nothing to measure. `checkpoint-2-features` contains target days.

**Recommendation:** change slide 41 back to "Scheduled days and colour tiles", or to "Scheduled days" alone if you cut tiles under M1. (high)

### M7. Teach `/model` in the first half hour, before anyone spends tokens

Nothing in the deck or the handout says *when* to change model or effort. The handout's command map has a `/model` row and that's all. This matters more now than it did last cohort, for two reasons:

- **The default is the most expensive general model on every plan.** Claude Code's docs now say Pro, Max, Team and Enterprise all default to Opus 5.5. Earlier versions gave Pro users Sonnet by default. A Pro user running the default all day, then adding a sub-agent team in Section 3, is the person most likely to hit their usage limit at 14:30. (high on the default; moderate on exactly when limits bite, since that depends on the plan and the day's load)
- **Sub-agents multiply usage.** Each one runs its own context window, so Section 3's four-role team costs several times what one session does.

**Where:** add a fifth row to the cockpit slide (Master slide 23), and spend two minutes on it in the setup check at 09:30, not in Section 3.

| The move | Claude Code | Codex |
|---|---|---|
| CHOOSE the model and how hard it thinks | `/model`, `/effort` | `/model` (picks model and reasoning effort) |
| CHECK what you've spent | `/usage` | `/status` |

**What to tell the room** (one slide, or a box in the handout):

1. **Start the day on a mid-tier model.** `/model sonnet` and `/effort medium` cover all of Sections 1 and 2. In Claude Code, the `/model` choice is saved as your default for new sessions.
2. **Spend on planning, not typing.** `/model opusplan` uses Opus in plan mode and switches to Sonnet to carry out the plan. That matches the course's "plan review" lesson.
3. **Narrow agents can be cheap agents.** In Section 3, give the verifier (which only runs `make check`) `model: haiku` in its frontmatter. It reinforces "narrow beats capable" from a cost angle.
4. **`/clear` saves money as well as quality.** The whole context is sent again on every turn, so a bloated session costs more on each turn as well as giving worse answers. This ties straight into the existing "context is the fuel" slide.
5. **Check `/usage` at each break.**

Model aliases move (today `sonnet`, `opus` and `haiku` resolve to the 5.5 models), so the slide should name aliases, never version numbers.

### M8. Add skills: the biggest missing topic

The deck teaches commands (Section 2, Move 2) but never mentions skills. Since the last cohort, skills have become the main way both tools package reusable know-how, and the two tools now share one file format. (high, from both vendors' docs)

**What changed:**

- **In Claude Code, commands and skills have merged.** `.claude/commands/add-feature.md` and `.claude/skills/add-feature/SKILL.md` both create `/add-feature`. Skills add a folder for supporting files, frontmatter controls, and the ability for Claude to load them *automatically* when the description matches the task. The docs recommend skills for new work.
- **Codex uses the same `SKILL.md` format** (`name` plus `description` frontmatter, then instructions), in `.agents/skills/<name>/SKILL.md` in the repo or `~/.agents/skills/` for the user. You invoke one with `$name` or `/skills`, and Codex also picks them implicitly by description.
- **So one file can serve both tools.** That fixes the clumsiest step in the current course, where Codex users have to *copy* `.codex/prompts/add-feature.md` into `~/.codex/prompts/` by hand.

**The idea to teach is progressive disclosure, and it ties into the context lessons.** Only each skill's name and description sit in context all the time. The body loads when the skill is used, and supporting files only when the body points to them. So a skill can carry a long checklist or reference doc at almost no context cost until it's needed. That is why skills beat pasting the same material into `AGENTS.md`.

**Where:** rewrite Section 2, Move 2 ("Codify a workflow") as **"Move 2 · Skills"**. It keeps the same five-step add-feature body, packaged as a skill.

**Slide content: which mechanism should I use?** This one table ties the whole day together. Show it in Section 2 and bring it back in Section 3:

| You need... | Use | Loaded when | Section |
|---|---|---|---|
| Facts that are always true about this repo | `AGENTS.md` / `CLAUDE.md` | Every session, always | 2 |
| A procedure you run sometimes | **Skill** | When relevant, or when called by name | 2 |
| A job that needs fresh eyes or narrow tools | Sub-agent | When delegated | 3 |
| Something that must happen every time, no exceptions | Hook | On the event, enforced | 3 |
| Data or actions outside the repo | MCP server | Tools listed up front, results on call | 2 |

**Lab change (inside the existing 10-minute Block B):**

```text
PROMPT
Turn my add-a-feature recipe into a skill called add-feature that works in
both Claude Code and Codex: the same SKILL.md in .claude/skills/add-feature/
and .agents/skills/add-feature/. Write the description so it triggers when I
ask to add or change a feature, but not for questions or reviews. The body:
  1. Explore ... (the existing five steps, unchanged)
```

Then a test that proves the description does its job:

```text
PROMPT · PROOF THE SKILL TRIGGERS
Add a "best day of the week" stat to the stats endpoint.
```

The agent should announce it's using the add-feature skill without being told. If it doesn't, the student rewrites the description. That turns a lesson about descriptions into a two-minute experiment.

**Stretch:** a "catch-me-up" tutor skill for returners ("explain the code I'm about to change, what's changed in this library since 2024, then quiz me"). It links to C2 and is something they'll actually reuse at work.

**Matching repo change:** add `.claude/skills/add-feature/SKILL.md` and `.agents/skills/add-feature/SKILL.md` to `checkpoint-2-features` onwards. Keep `.claude/commands/add-feature.md` for one cohort, then delete it. Update the `AGENTS.md` tooling table. Check whether `~/.codex/prompts` is now deprecated: Codex's skills page doesn't mention it either way. (moderate)

### M9. Explain how MCP works, not only what it is

Slide 39 gives a one-paragraph definition and a calendar example. Students then try to connect a calendar, and the attempt is likely to fail. Claude.ai connectors such as Google Calendar have to be connected at claude.ai first, and they don't work if you're logged in with an API key (the Codespaces guide already warns about this). They get no picture of what actually happens, so they can't debug it. (high)

**Slide 1: how it works**

```
  Agent (Claude Code / Codex)  =  MCP client
        │  at startup: "what tools do you have?"
        │  then calls them like its own Read or Bash
        ▼
  MCP server  ──►  calendar, database, docs, Jira...
   • stdio: a local program the agent starts (npx ..., uvx ...)
   • HTTP:  a remote URL, often with an OAuth login
```

- The server advertises **tools**, each with a name, a description and inputs. The agent picks one the same way it picks a skill: by reading the description.
- What a tool returns goes **into the context window**, so it costs space like anything else. Claude Code caps tool output (it warns at 10,000 tokens, and the default limit is 25,000) and loads tool definitions only when needed ("tool search"), so connecting a large server no longer fills the window up front.
- **Permissions still apply.** Each tool call goes through the same approval dial as a shell command.

**Slide 2: the commands**

| | Claude Code | Codex |
|---|---|---|
| Add a remote server | `claude mcp add --transport http <name> <url>` | `codex mcp add <name> --url <url>` |
| Add a local server | `claude mcp add <name> -- npx -y <package>` | `codex mcp add <name> -- npx -y <package>` |
| Share it with the repo | `--scope project` writes `.mcp.json` | `.codex/config.toml`, `[mcp_servers.<name>]` |
| Log in (OAuth) | `/mcp` → Authenticate | `codex mcp login <name>` |
| See status | `/mcp`, `claude mcp list` | `/mcp` |

The `--` matters. Everything after it is the server's own command, passed through untouched. Getting it wrong is the most common setup failure. (high for Claude Code; moderate on the Codex `--url` form, which the docs show only in an OAuth example)

**Slide 3: trust.** An MCP server is code, or a remote service, that you are letting the agent act through. A server that fetches web pages or tickets can bring instructions in with the data (prompt injection). Claude Code asks before it uses a project's `.mcp.json` servers, and a cloned repo can't pre-approve its own servers. Install MCP servers as carefully as you'd add a dependency. This links to C4.

**Lab: replace the calendar exercise with one that works for everyone with no login.** A documentation server such as Context7 suits returners particularly well: "check the current FastAPI docs and tell me whether this app's startup code uses a deprecated pattern". OpenAI's own MCP page uses Context7 as its example: `codex mcp add context7 -- npx -y @upstash/context7-mcp`. Claude Code: `claude mcp add context7 -- npx -y @upstash/context7-mcp`. Keep the calendar as a stretch, with a note that it must be connected at claude.ai first. (moderate that Context7 needs no key for light use; try it before the cohort)

---

## Minor: polish and correctness

| # | Where | Issue | Suggested fix | Confidence |
|---|---|---|---|---|
| m1 | Master, slide 1 | "TECH COUNCIL OF **AUSTRLIA**" | "AUSTRALIA" | high |
| m2 | Master, slides 41 and 43 | "Where you'll be **by lunch**" and "Bridge to Section 3 · **after lunch**", but lunch now comes before Section 2 | "By the break" / "After the break" | high |
| m3 | Master, slide 4 vs 31 | Joris Dries was removed from the introductions but still presents Section 2 on slide 31 | Add Joris back to slide 4, or drop the name from slide 31 | high |
| m4 | Master, slide 4 and run of day | Jade is introduced, but the "How the engineer's life has changed" segment is gone from the run of day | Confirm that's intended. If Jade isn't presenting, consider "Facilitator" next to the name | moderate |
| m5 | Master, slide 58 vs 62 | Slide 58 says Claude Code has **28** events, but slide 62 lists **30** names. Current docs list **33** (adding DirectoryAdded, PreModelSwitch, PostModelSwitch). Codex now has **12** (it added Interrupt) | Drop exact counts: "Claude Code has 30+ events, Codex about a dozen. You'll use six." | high |
| m6 | Master, slide 61 | Codex hooks are shown as "experimental: `[features] hooks = true`". The old deck had it right: hooks are **on by default**, and `hooks = false` turns them off | Restore the old deck's wording. Add that repo-level `.codex/` hooks load only once the project is trusted | high |
| m7 | Master, slide 38 | The worktree slide lost the command line the old deck had, so as it stands it shows no command at all | Moot if M2 is adopted. Otherwise restore `git worktree add ../feat-a -b feat-a` | high |
| m8 | Handout, Section 3 Block D | The Stop-hook prompt doesn't mention the working directory, so student agents will write the same `make check` bug | Add "run from the repo root regardless of the current directory, including inside a worktree". Then use the bug as a teaching moment: hooks run in the session's current directory | high |
| m9 | Handout, Section 3 Block D | A Stop hook that can never go green makes the agent keep working indefinitely | Add one line: "If you're stuck in a red loop, press Esc and fix the definition of done." Claude Code passes `stop_hook_active` in the hook input so a hook can let the second attempt through | moderate |
| m10 | Codespaces guide, p. 6 | The Vite snippet proxies `/habits` and `/stats` but not `/encouragement`. A student who pastes it breaks the nudge feature | Add `'/encouragement': 'http://localhost:8000'` and fix the sentence above it | high |
| m11 | Codespaces guide | Step 2 (install uv and the agents) is lost on every container rebuild | Add `.devcontainer/devcontainer.json` to the repo with a `postCreateCommand` that installs uv, Claude Code and Codex. Step 2 disappears, and a rebuild repairs itself | moderate |
| m12 | Handout p. 5, command map | "Checked against the docs in July 2026" | Re-check before the cohort. `/review` and `/code-review` have moved before | high |
| m13 | `.github/workflows/ci.yml` | `node-version: "20"`. Node 20 reached end of life in April 2026. `actions/checkout@v4` and `setup-uv@v5` also have newer major versions | Bump to Node 22 and update the action versions | moderate |
| m14 | Backend tests | Starlette 1.2.1 prints a deprecation warning: `httpx` with `TestClient` is deprecated in favour of `httpx2` | Pin `starlette` in `pyproject.toml`, or move to `httpx2` before a release drops support | moderate |
| m15 | Handout p. 2 | "Codex prefers 22+" | Once M5 is done, say Node 22+ for everyone | high |
| m16 | `docs/` | The new Master `.pptx` (15 MB) is untracked and is the only copy of the current deck | Commit it, or export a PDF as you did for v2 | high |

---

## Content that is missing for this cohort

The audience is experienced engineers coming back after 6 to 18 months away, and the deck mostly serves them well: "You're not behind, the typing got automated; the judgement didn't" is the right message. The gaps below are ranked by how much I think they'd help, with a suggested place and time cost for each. I'd take the first two and make the rest optional.

### C1. Brownfield: using the agent on a codebase you didn't write (high value)

Every exercise today is greenfield, but nobody returns from leave to an empty folder. They come back to a large repo that changed while they were away, a new service, and teammates they don't know. A 10-minute block that points the agent at **an unfamiliar repo** is the most directly useful thing you could add.

- **Where:** Section 1, as Block C's alternative or a stretch. Or Section 2, right after the contract, since `/init` on an existing repo *is* how you get a contract on day one back.
- **Exercise:** in the reference repo (unfamiliar to them by design), ask: "Give me a ten-line architecture overview. Where is today's date decided? What would break if I changed the weekday encoding? What changed in the last five commits?" Then run `/init` and compare its output with the real `AGENTS.md`.
- **Take-home line:** "On day one back, before you touch anything: overview, `/init`, `git log` summary, then ask the agent what scares it about the code."

### C2. Using the agent as a tutor, not only as a typist (high value)

"Resist the keyboard" is right for the confident engineers, but it can leave the rusty ones shipping code they can't judge. That is the opposite of Section 3's message. Give the rusty half an explicit tool for catching up:

- "Explain this diff to me as if I'd been away from React for a year."
- "What's changed in FastAPI and Pydantic since 2024 that this code relies on?"
- "Quiz me on how the streak calculation works; don't show the code."
- **Where:** one slide in Section 1 next to "Prompt by outcome", plus three prompts in the handout. **Cost:** 2 minutes.

### C3. What has changed while you were away: a one-page glossary (medium value)

Slide 27 ("What changed in a year") does this at the level of ideas. Returners also trip over plain vocabulary: agent, sub-agent, skill, hook, MCP, plan mode, context window, compaction, headless, worktree, eval. A one-page glossary in the handout, each term with one line and the session it appears in, costs no class time. Your setup prerequisites already ask them to learn "the vocabulary, not mastery", so this gives them that list.

### C4. What you may put into an agent at work (medium value)

The course connects MCP servers, runs agents with shell access, and touches API keys. It never says what returners should check before doing this at work. Five minutes in Section 3 next to the security pass would cover it:

- **Ask before you paste:** company policy on approved tools, customer data and source code.
- **Prompt injection:** a repo, issue or web page the agent reads can contain instructions. That is why permissions and the read-only reviewer matter. The Codespaces guide already makes this point about credentials in `~/.claude` and `~/.codex`. Bring it into the main deck.
- **MCP servers are code you are trusting.** Install them as carefully as you would a dependency.

### C5. Cost and limits

Now covered by M7 (teaching) and by the prerequisites handout (which plan to buy).

### C6. The first two weeks back (low cost, likely appreciated)

Slide 68 gives a good tomorrow, this week, this month plan for the *harness*. Add a personal version for returners: get tool access approved, find your team's `AGENTS.md` or `CLAUDE.md` (or write one), pair with a teammate on one agent-driven PR, and pick the repo "where reviewing the diff already makes you uneasy". That last line is in the handout and is the best line in it.

---

## What I'd leave alone

- **The ladder** (Vibe Coding, Vibe Engineering, Agentic Engineering). It is clear, and each rung builds on the last.
- **Both tools side by side.** The parallel `.claude/` and `.codex/` setup is a real teaching asset, and the hooks fixed today show why: the same mistake happens in both tools.
- **The prompts.** They are outcome-phrased, they include their constraints, and they work in either tool. The Section 3 "trap" prompt (timezones, `xfail`) is excellent.
- **The app.** It is small enough to finish in a day, and its edge cases (streaks, weekday encoding, idempotency, timezones) are real. The AI features degrade properly with no key. I'd make no changes to the app code beyond the minor items above.

---

## Decisions for you

1. **M1:** is Section 2 really 30 minutes, or is 12:45 to 13:15 a typo?
2. **M4:** move the `checkpoint-3-hardened` tag, or add a `-v2` tag?
3. **Repo changes:** do you want me to make the small ones now? That means `.gitattributes`, a `.devcontainer`, the `.gitignore` line for worktrees, the CI version bumps, the Codespaces Vite snippet fix in the source `.docx`, and retiring `vibe.md`.
4. **Codex worktrees:** do you want me to confirm the `--worktree` flag on a current Codex install before it goes on a slide?
5. **M8 repo change:** should the `add-feature` skill files be added to the checkpoints now, which means moving `checkpoint-2-features` and `checkpoint-3-hardened`?
6. **Pre-course check script:** do you want a `scripts/preflight.sh` that prints a pass or fail for each prerequisite? It would replace step 5 of the prerequisites handout with one command, and students could paste its output into WhatsApp.

---

## Sources

- Claude Code worktrees: <https://code.claude.com/docs/en/worktrees>
- Claude Code setup, Windows and Node 22 requirement: <https://code.claude.com/docs/en/setup>
- Claude Code hooks (event list, Windows shell, `CLAUDE_PROJECT_DIR` behaviour): <https://code.claude.com/docs/en/hooks>
- Claude Code common workflows: <https://code.claude.com/docs/en/common-workflows>
- Claude Code skills: <https://code.claude.com/docs/en/skills>
- Claude Code MCP: <https://code.claude.com/docs/en/mcp>
- Claude Code model configuration (Opus 5.5 default on every plan, effort levels): <https://code.claude.com/docs/en/model-config>
- Codex skills (`.agents/skills`, `$name`): <https://learn.chatgpt.com/docs/build-skills>
- Codex MCP (`codex mcp add`, `[mcp_servers]`): <https://learn.chatgpt.com/docs/extend/mcp?surface=cli>
- Codex hooks (on by default, 12 events, session `cwd`): <https://learn.chatgpt.com/docs/hooks> (redirected from developers.openai.com/codex/hooks)
- Codex on Windows (native sandbox preferred, WSL2 optional): <https://learn.chatgpt.com/docs/windows/windows-sandbox>
- Codex CLI worktrees, third-party only and unconfirmed: <https://omidsaffari.com/blog/codex-cli-0-154-worktrees>, <https://codex.danielvaughan.com/2026/03/26/codex-cli-worktree-parallel-development/>
