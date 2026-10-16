# Speaker notes · Back in the Code (v3.1)

One section per slide. Bullets are prompts, not a script.

## 1 · AGENTIC ENGINEERING

- Welcome. Today we build one app three times over, with agents doing the typing and you in charge.
- Nobody needs to be an AI expert to get value from today. Curiosity is plenty.
- Housekeeping first: wifi, facilities, and the cohort WhatsApp on the next slides.

## 2 · ACKNOWLEDGEMENT OF COUNTRY

- “I would like to acknowledge the Gadigal of the Eora Nation, the Traditional Custodians of this land, and pay my respects to Elders past and present.”
- Adjust for the venue's Traditional Custodians.

## 3 · Welcome

- This day is built for people coming back from carers', parental or long service leave.
- The tools moved a long way while you were away. That's why we're here, not a judgement on anyone.
- Join the cohort WhatsApp now: setup help, links and lab answers live there all day.

## 4 · INTRODUCTIONS

- Quick round: your name, what you're coming back to, and the one habit you'd love to stick to.
- Hang onto that habit. You'll seed the app with it in Section 1.
- Joris takes Section 2, I take Section 3. Grab any of us for help at any point.

## 5 · RUN OF DAY

- Treat the times as a guide. Lab time matters more than the clock.
- First job at 09:30: everyone runs claude, logs in, and picks a model with /model.
- Lunch after Section 1, a short break after Section 2.
- Showcase at 15:45: be ready to show one thing your agents built, and how you know it works.

## 6 · THE PROMISE

- One app, three passes. Each pass takes away a different crutch.
- Rusty? You'll leave comfortable with the tools. Confident? You'll leave building the harness instead of typing.
- Ask the room: who has used Claude Code or Codex in the last month? Calibrates the pace.

## 7 · THE DAY IS A LADDER

- Three rungs, not three separate workshops. Each one stands on the last.
- Make it work, then make it repeatable, then make it trustworthy.
- Transition: here's the app we climb with.

## 8 · ONE PROJECT, ALL DAY: TCA HABITS

- TCA Habits: a habit tracker with a real FastAPI backend and a React frontend.
- Small enough to finish in a day, with real edge cases: streak maths, weekdays, time zones.
- Those edge cases are deliberate. This afternoon's tests need something genuine to catch.

## 9 · NO ONE GETS STRANDED

- Two safety nets: small commits are yours, checkpoints are the room's.
- Behind at the end of a section? Switch to the checkpoint and keep going. That's the design.
- Demo: git tag in the reference repo lists the checkpoints.

## 10 · NO ONE LEFT BEHIND

- Everyone starts on a different rung. Core path for all, stretch goals if you're flying.
- Fair warning: the most experienced people often find today hardest. More habits to unlearn.
- If you finish a block early, every block has stretch goals in the handbook.

## 11 · WHAT YOU’LL WALK AWAY WITH

- Earlier career: the loop and a working mental model.
- Mid-level: the discipline that makes it reliable.
- Senior: how your team should work with agents.
- Pick the column that's you. That's your target for the day.

## 12 · Tech Council of Australia | techcouncil.com.au

- Section 1: fly the agent instead of typing the code.
- Everything works in Claude Code or Codex. Use whichever you set up.

## 13 · ONE BOX, TWO VOICES

- What you type is a small part of what the model reads.
- The tool adds a system prompt you never see: its rules, its tools, its instructions.
- The model reads it all as one stream, top to bottom. So be clear, and keep the stream clean.

## 14 · CONTEXT ENGINEERING

- The context window is a stack, rebuilt on every call: rules, memory files, documents, tool results, history, your prompt.
- Every layer costs space. Fill the window and quality drops.
- The real job is choosing what goes in, in what order, and what stays out.
- Demo: /context in Claude Code shows the stack and how full it is.

## 15 · THE DAY IS A LADDER

- Rung one. By lunch you'll have a working app you didn't type.

## 16 · WHAT VIBE CODING IS

- You describe the outcome. The agent writes, runs and fixes. You watch and steer.
- The shift: from “how do I write this?” to “what should be true when it's done?”
- Ask the room: what should be true about a habit tracker after an hour?

## 17 · THE AGENTIC LOOP

- Prompt, generate, run, observe, react. Then round again.
- Your jobs are 1, 4 and 5: say what you want, look at reality, steer.
- Small turns spin faster, and fast loops beat clever prompts.

## 18 · WHAT THE AGENT ACTUALLY IS

- Four parts: a context window, tools, a loop, and permissions.
- It isn't autocomplete. It acts, reads the result, and corrects itself.
- Permissions are yours to set. More on that in a few slides.

## 19 · Tech Council of Australia | techcouncil.com.au

- Resist the keyboard. The urge to just fix it yourself is the habit we're retraining.
- When your hands drift toward the code, type a better prompt instead.
- Rusty folk have the advantage here. Confident folk, this one's aimed at you.

## 20 · PROMPT BY OUTCOME

- Left: a step list is typing code slowly, and you still have to be right.
- Right: the outcome plus the rules. The agent picks how.
- Ask the room: which rule does the right-hand prompt state that the left one never does?

## 21 · PLAN REVIEW, NOT PLAN WRITING

- Plans used to be the weak spot. Now they're tidy and confident.
- The risk moved: a lovely plan for slightly the wrong problem.
- Read for intent and scope. Right goal? Right size? What did it assume that you never said?
- Shift+Tab in Claude Code, /plan in Codex, to make it plan first.

## 22 · PERMISSIONS ARE A DIAL

- “Yes to all” is fine right up until one command runs in a repo that matters.
- Ask every time while the task is new. Auto-accept only somewhere you could afford to lose.
- Shift+Tab cycles the mode in Claude Code. /permissions in Codex.

## 23 · THE COCKPIT

- Five moves cover every context problem you'll hit today: see, load, trim, reset, choose.
- The commands differ a little between tools. The ideas don't.
- Demo: /context, then /model, so everyone has seen both before the lab.

## 24 · CONTEXT IS THE FUEL

- Too little and it guesses. Too much and it forgets, and old threads leak into new answers.
- Just right: one task, and only the files that task touches.
- Answers going vague is your signal to trim or reset.

## 25 · SPEND TOKENS ON PURPOSE

- The default is now the top model, even on Pro. Great for hard problems, pricey for routine work.
- Start on sonnet with medium effort. Claude Code remembers the choice.
- opusplan gives you the big model for planning and sonnet for the building.
- /clear saves money as well as quality: the whole context is resent every turn.
- Check /usage at each break so nobody runs dry mid-afternoon.

## 26 · WHEN IT BREAKS — IT WILL

- It will break. That's normal, not failure.
- Don't open the file. Paste the exact error and describe what's on screen.
- Say what you saw, not what to change. The agent already has the files.

## 27 · COMMIT SMALL, SHIP OFTEN

- After each working step, ask the agent to commit with a sensible message.
- Small commits are your undo. Checkpoints are the room's.
- Demo: “Commit this with a sensible message.” Show the commit it writes.

## 28 · WHAT CHANGED IN A YEAR

- Planning, context and agents all moved a long way, possibly while you were on leave.
- The models got better at mechanics. The human skill moved up: intent, context, verification.
- You're not behind. The typing got automated; the judgement didn't.

## 29 · USE IT AS A TUTOR, NOT JUST A TYPIST

- Use the agent to catch yourself up, not only the code.
- Three habits: explain the diff, catch me up on what changed, quiz me.
- If you can't explain the code, you can't judge the next diff. That's the real reason to do this.

## 30 · DAY ONE BACK: A CODEBASE YOU DIDN'T WRITE

- Nobody comes back to an empty folder. This is a first-morning routine for the real job.
- Map, decisions, recent history, the contract, what worries it. Five prompts, ten minutes.
- Stretch in the lab: run all five against the reference repo.

## 31 · FIVE GOLDEN RULES

- Five rules for the lab. They're in the handbook too.
- If you only keep one this morning: resist the keyboard.
- Ask the room: which of these will be hardest for you?

## 32 · Tech Council of Australia | techcouncil.com.au

- Lab time: handbook Section 1, Blocks A to D.
- Plan first, read the plan like a junior's design doc, then approve.
- Shout early if setup bites. Helpers are walking around.

## 33 · Tech Council of Australia | techcouncil.com.au

- Commit before you go.
- Behind? After lunch, switch to checkpoint-1-working and start Section 2 clean.

## 34 · SECTION 02 · MAKE IT REPEATABLE

- Section 2: make it repeatable. Same agent, more discipline.
- Presenter: Joris Dries, CTO at Resonate CX.

## 35 · THE DAY IS A LADDER

- Rung two. We have a working app. Now we make building it repeatable.

## 36 · WHAT VIBE ENGINEERING IS

- Deliberate, repeatable use of the tool, so it's fast and consistent.
- The project remembers our conventions, and good prompts become shared assets.
- The shift: stop re-explaining. Let the contract do it.

## 37 · FIVE MOVES THIS SESSION

- Contract, skills, context, a second opinion, MCP.
- Each one removes something we'd otherwise repeat every session.
- Most of these are a lab block, so we practise them, not just hear about them.

## 38 · MOVE 1 · THE PROJECT CONTRACT

- AGENTS.md is read at the start of every session, by both tools.
- Commands, architecture, key patterns, and the one rule you must never break.
- /init writes a first draft. Keep it short: a contract nobody reads is decoration.
- Demo: fresh session, ask “what's the rule about the streak?” without explaining anything.

## 39 · MOVE 2 · SKILLS

- A skill is a folder with a SKILL.md: a name, a description, then the steps.
- Same file format in Claude Code and Codex. Call it with /add-feature or $add-feature.
- Old commands still work, but skills are the recommended home now.

## 40 · HOW A SKILL LOADS

- Only the name and description sit in context all the time.
- The body loads when it's used. Extra files load only if the body points at them.
- So the description is the trigger: say when it should fire, and when it shouldn't.
- Lab check: ask for a feature without naming the skill, and see whether it picks it up.

## 41 · WHICH ONE DO I REACH FOR?

- Five ways to hand the agent something, sorted by when they load.
- Always true: the contract. Sometimes: a skill. Every time, no exceptions: a hook.
- Sub-agents and hooks arrive this afternoon. This table comes back as a recap.

## 42 · MOVE 3 · MANAGE CONTEXT ON PURPOSE

- One task, one session. Compact when it bloats. Point it at the exact files.
- Same discipline every task, not a scramble once the answers go vague.
- Demo: /context before and after /compact, so the room sees the window shrink.

## 43 · MOVE 4 · A SECOND OPINION

- A reviewer that didn't write the code sees what the author can't.
- Give both reviewers the same brief: numbered list, file:line, severity.
- Where they disagree is the interesting part. We decide.

## 44 · MOVE 5 · REACH REAL DATA WITH MCP

- MCP connects the agent to things outside the repo: docs, databases, calendars, APIs.
- Lab: Context7, a docs server that needs no login.
- Calendar is a stretch goal. It has to be connected at claude.ai first.

## 45 · HOW MCP WORKS

- The agent is the client. Each server advertises its tools; the agent calls them like its own.
- Local servers are programs it starts. Remote ones are URLs, often with an OAuth login.
- Whatever a tool returns lands in context, so it costs space like everything else.

## 46 · CONNECTING ONE

- Five commands cover nearly everything, in either tool.
- Mind the --. Everything after it belongs to the server, passed through untouched.
- Demo: claude mcp add context7, then /mcp to show it connected.

## 47 · YOU ARE TRUSTING IT

- An MCP server is code, or a service, acting on our behalf.
- Anything that fetches web pages or tickets can carry instructions in: that's prompt injection.
- Approvals stay on. Install a server as carefully as you'd add a dependency.

## 48 · THE FEATURE THAT NEEDS JUDGEMENT

- Weekly summary: template or model call? Both are reasonable answers.
- The point isn't the answer. It's that the agent surfaces the choice and a person makes it.
- Plan mode forces that conversation to happen.
- Ask the room: which would you ship, and why?

## 49 · WHERE YOU'LL BE BY THE BREAK

- Contract, skill, scheduled days and colour tiles, weekly summary, nudge.
- Scheduled days matter most: this afternoon's progress ring is built on them.
- Behind? checkpoint-2-features is the start line for Section 3.

## 50 · FIVE RULES FOR THIS SESSION

- Write it down once, package it as a skill, keep a clean desk, get a second opinion, surface decisions.
- Transition: lab time, handbook Section 2, then the break.
- Finish early? Colour tiles, the theme toggle, or the MCP stretch.

## 51 · BRIDGE TO SECTION 3 · AFTER THE BREAK

- The app has features now. Nobody has proven it's right.
- Ask the room: would you put it in front of real users on Monday?
- After the break we stop hoping and build the proof.

## 52 · Tech Council of Australia | techcouncil.com.au

- Commit before the break.
- Behind? checkpoint-2-features is your start line for Section 3.

## 53 · Tech Council of Australia | techcouncil.com.au

- Section 3: how to trust work you can't read line by line.
- Four moves, one team of agents, and you as the tech lead.

## 54 · THE TOP OF THE LADDER

- Two crutches gone. The last one: trusting output by eye.

## 55 · WHERE WE GOT TO

- Section 1 made us fast. Section 2 made us consistent.
- Neither made it trustworthy. That's this afternoon.
- Ask the room: what would make you sure enough to ship it?

## 56 · WHAT AGENTIC ENGINEERING IS

- Agents do the work. The engineering goes into making that work trustworthy.
- The question changes: what would prove this is right, without me reading it?
- Rusty or confident, this flips the job the same way for everyone.

## 57 · READING HARDER DOESN’T SCALE

- The agent out-types you, and attention fades by the third diff.
- A plausible bug reads as correct. Eyes aren't the right tool at this speed.
- Your new job: design how correctness gets proved.

## 58 · THE FOUR MOVES

- Harness, sub-agents, the team, then hooks and CI.
- Everything this afternoon is one of these four.
- Transition: move 1, the harness. Everything else stands on it.

## 59 · MOVE 1 · THE HARNESS

- One command that says yes or no: lint, types, tests.
- The agent runs it, reads the failure, and fixes itself without asking you.
- Demo: make check in the reference repo, break something on purpose, run it again.

## 60 · THE TESTS ARE THE SPEC

- Tests first, and watch one fail. A test that never failed proves nothing.
- Three edge cases: the missed day, the double tick, midnight.
- Midnight is the honest one: nothing in this app knows your time zone. Record the gap, don't hide it.

## 61 · MOVE 2 · SUB-AGENTS

- Three narrow jobs: test-writer, reviewer, verifier.
- Each gets a fresh context and only the tools it needs. The reviewer can't edit at all.
- The verifier runs on haiku. Narrow jobs can be cheap jobs.

## 62 · WHY NARROW BEATS CAPABLE

- An agent reviewing its own work is kind to it: the same blind spot, twice.
- A read-only reviewer can only report problems. It can't quietly fix them out of sight.
- Same reason code review works between people: fresh eyes, no sunk cost.

## 63 · HOW THE HANDOFF WORKS

- A sub-agent sees only the brief you give it, not your conversation.
- It hands back one summary, not its reasoning or the forty files it read.
- Good brief: here's the diff, return numbered bugs with file:line. Bad brief: “thoughts?”

## 64 · MOVE 3 · THE AGENT TEAM

- Test-writer, implementer, reviewer, verifier. You sit above all four.
- You pick the feature, settle disputes, and decide when it's done.
- When it stalls, the fix is usually a clearer definition of done, not a better prompt.

## 65 · PARALLEL AGENTS, SEPARATE CHECKOUTS

- Agents editing at the same time need separate copies of the repo. That's a git worktree.
- Claude Code: claude -w ring-a. Sub-agents: isolation: worktree. Codex: plain git, or the newer --worktree.
- Two takes on the same task, then the real question: which would you merge, and why?

## 66 · WORKTREE GOTCHAS

- Commit first, set up each one, run one app at a time, ignore the folder.
- Number two costs real lab minutes: every worktree needs its own install.
- Number four takes ten seconds and saves a confusing git status later.

## 67 · CLOSING IT OFF: MERGE, THEN CLEAN UP

- Every worktree session ends the same way: merge the winner, then clean up everything else.
- Remove both folders, delete both branches, prune. git worktree list showing only main means done.
- When git refuses, that's the safety net. It won't bin uncommitted or unmerged work without --force or -D.
- Prefer a review first? Push the branch and open a PR instead of merging locally.
- Demo: run the sequence once on the projector so the room has seen it end to end.

## 68 · MOVE 4 · MAKE IT NON-OPTIONAL

- AGENTS.md is a promise. The agent keeps it when it's paying attention.
- A hook is a script the tool runs every single time. It doesn't forget, and it can block.
- A contract is a promise. A hook is a fact.

## 69 · BEFORE OR AFTER

- One idea to hold: a hook runs just before, or just after, the agent does something.
- Before can stop it: block an edit, check a prompt.
- After can tidy or check: format the file, run make check when it says it's done.
- There are 30+ events. You need these two sides. The rest is reference for later.

## 70 · TWO WE WIRE TODAY

- The guardrail, before: no edit to the streak logic unless a test changes too.
- The verifier, after: make check at Stop. Red means not done.
- Demo: open .claude/settings.json in the reference repo. Both hooks fit on one screen.
- Stuck in a red loop? Esc, then fix the definition of done.

## 71 · TWO THINGS THAT WILL CATCH YOU · 1

- Exit 0 carries on. Exit 2 blocks, and stderr goes back to the agent as the reason.
- Exit 1 does nothing. Unix habit says it means failure; here it enforces nothing.
- If your guardrail never seems to block, check the exit code first.

## 72 · TWO THINGS THAT WILL CATCH YOU · 2

- Hooks run wherever the agent currently is, and agents cd into folders constantly.
- Our own Stop hook broke the first time the agent ran cd backend. Genuinely, in this repo.
- The fix: find the root with git rev-parse --show-toplevel. It works inside worktrees too.
- Second trap: inside a worktree, $CLAUDE_PROJECT_DIR still points at the main checkout. Don't anchor on it.
- Lesson: test the harness as well as the code.

## 73 · EVALS · SCORING WHAT TESTS CAN’T

- A test asks “is it correct?”. An eval asks “is it good enough?” and answers with a number.
- Write a rubric, let a model grade, gate on the score dropping.
- Stretch in the lab: a five-case eval for the weekly summary.

## 74 · MAKING IT STICK AFTER TODAY

- CI, so a teammate who wasn't in this room still can't break it.
- Headless runs for the routine work; a security pass before merge.
- Automate the generation and the checking. Keep the sign-off human.

## 75 · WHAT YOU MAY PUT INTO AN AGENT AT WORK

- Check your company's policy before pasting code or customer data into anything.
- Prompt injection is real: anything the agent reads can carry instructions.
- Logins in ~/.claude and ~/.codex are credentials. Downloaded skills and servers are code you're trusting.

## 76 · WHICH ONE DO I REACH FOR? · RECAP

- Now we have all five: contract, skill, sub-agent, hook, MCP.
- Ask the room: where should “never commit straight to main” live? (A hook: it must happen every time.)
- Transition: one rule to carry into the lab.

## 77 · THE ONE RULE FOR THIS AFTERNOON

- Don't read harder. Build the proof.
- Whenever you want to scroll the diff hunting for the bug, ask what test, agent or gate would have caught it.
- Rusty: you never trusted it by eye anyway. Confident: your reading is good, just not fast enough.

## 78 · IN THE LAB · 60 MINUTES

- Four blocks, sixty minutes. You orchestrate; you don't type the implementation.
- Block A is the foundation. Don't skip it to get to the fun part.
- Behind? Reset to checkpoint-2-features and start the block clean.

## 79 · FIVE GOLDEN RULES

- Harness first, fail it once, narrow agents, orchestrate, enforce it in the tool.
- These are the five worth taking back to work.
- Transition: lab time. Afterwards, how to take this back to your own repo.

## 80 · WHEN YOU GET BACK TO YOUR OWN REPO

- Tomorrow: one command that says yes or no. Watch it fail once.
- This week: a read-only reviewer, and one hook for your team's favourite mistake.
- This month: CI, an eval, and walk one teammate through it.
- Pick the repo where the diffs already make you nervous.

## 81 · Tech Council of Australia | techcouncil.com.au

- Showcase: one thing your agents built, and how you know it works.
- The same skills scale from this toy to production. Only the harness gets bigger.
- Keep it short: show it working, then say what proves it's right.

## 82 · HELP US MAKE THE COURSE BETTER

- Two minutes on the feedback form, please. It shapes the next cohort.
- Thank you for today. Stay in the WhatsApp group; we'll keep sharing what we learn.
