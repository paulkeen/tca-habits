# Speaker notes · Back in the Code (v4)

Talking points beyond the slide text: facts, history and real stories from building the course. Sources are named so you can cite them; links are at the end.

## 1 · AGENTIC ENGINEERING

- Welcome. Today is hands-on: you'll build, break and fix a real app, with agents doing most of the typing.
- Context for the room: Google says 75% of its new code is now AI-generated and approved by engineers (Pichai, April 2026).
- The point isn't that the robots won. It's that the job moved, and today is about where it moved to.

## 2 · ACKNOWLEDGEMENT OF COUNTRY

- “I would like to acknowledge the Gadigal of the Eora Nation, the Traditional Custodians of this land, and pay my respects to Elders past and present.”
- Adjust for the venue's Traditional Custodians.

## 3 · AGENTIC ENGINEERING · A ONE-DAY PROGRAM

- Coming back after time away is not a deficit. You return with fresh eyes and no bad habits from the last eighteen months.
- Reassurance with data: the Tech Council's August 2026 jobs report puts Australia's tech workforce near 977,000.
- Software engineering is the largest technical role in it, and still growing about 7% a year.
- Same report: no sign yet that AI has hollowed out early-career technical hiring. The work changed shape, it didn't vanish.
- Get everyone into the WhatsApp now. It's where links and lab answers land all day.

## 4 · INTRODUCTIONS

- Paul Hughes and I are both from Culture Amp; Adair runs the program for the Tech Council.
- Round the room: name, what you're coming back to, and that one habit. Keep it to a sentence each.
- Write your habit down. In an hour it'll be seed data in an app you didn't type.

## 5 · RUN OF DAY

- Labs are where the learning happens. If a talk runs short, good: more lab time.
- The 09:30 setup check matters more than it looks. Last cohort lost real time to installs and logins; the prerequisites handout exists because of it.
- Showcase rule: show one thing working and say how you know it works. The second half is the course.

## 6 · THE PROMISE

- Each pass removes a crutch: typing, then repeating yourself, then trusting your eyes.
- Worth saying out loud: the confident engineers usually find today harder than the rusty ones. More habits to unlearn.
- That isn't a hunch. In METR's 2025 study, experienced developers were slower with AI while believing they were faster. We'll come back to that.

## 7 · THE DAY IS A LADDER

- Karpathy coined “vibe coding” on 2 February 2025: “fully give in to the vibes … and forget that the code even exists.” Collins made it Word of the Year.
- Simon Willison answered in October 2025 with “vibe engineering”: experienced people using the same tools while staying accountable for the result.
- A year after vibe coding, Karpathy proposed “agentic engineering”: you're orchestrating agents who write the code, and acting as the oversight.
- So the three rungs aren't our invention. They're the field's own vocabulary, in the order it was coined.

## 8 · ONE PROJECT, ALL DAY: TCA HABITS

- A habit tracker sounds trivial. Streaks are a famously sneaky bit of date maths.
- Three traps are baked in: what counts as “today”, Python's Monday-first weekdays versus our Sunday-first, and double taps.
- That's deliberate. The afternoon's test harness needs real bugs to catch, not toy ones.

## 9 · NO ONE GETS STRANDED

- Checkpoints are git tags in the reference repo. Switching to one is a single command, and it's in the handbook.
- Claude Code also has /rewind (Esc Esc), added in version 2.0. It restores code and conversation from before a prompt.
- Its limit is worth knowing: /rewind doesn't undo shell commands like rm or mv. The docs say plainly it's no replacement for version control.
- So: rewind for a bad turn, git for everything else.

## 10 · WHAT YOU’LL WALK AWAY WITH

- Find your column. The difference between the three is where your attention goes, not how much you know.
- Earlier career: learn the loop. Mid: make it repeatable. Senior: design how a team works with agents and where humans sign off.
- Senior folk, your hardest job today is keeping your hands off the keyboard.

## 11 · SECTION 01 · THE COCKPIT

- Section 1 is about steering. Expect the first hour to feel strange; that's the old habit pushing back.
- Everything works in either Claude Code or Codex. Pick one and stay with it today; switching tools mid-lab costs more than it teaches.

## 12 · ONE BOX, TWO VOICES

- ChatGPT's leap at launch (November 2022) wasn't a bigger model. It was tuning: reinforcement learning from human feedback taught GPT-3.5 to behave like an assistant.
- The labelled roles came three months later with the API. OpenAI's own spec said the old single-string format “inherently allows injections from user input”.
- Roles help, but they're learned, not enforced. OpenAI's 2024 “instruction hierarchy” paper found models still treated system and user text with similar priority.
- That's the root of prompt injection, which we meet properly in Section 2.

## 13 · CONTEXT ENGINEERING

- “Lost in the Middle” (2023): models recall what's at the start and end of a long context better than what's in the middle.
- Chroma tested 18 models in 2025 and found performance gets less reliable as input grows, even on simple tasks. They called it context rot.
- Anthropic's framing (September 2025): context is an attention budget. Aim for the smallest set of high-signal tokens that does the job.
- So a bigger window isn't a licence to fill it.

## 14 · THE DAY IS A LADDER

- Rung one. Speed first; we'll worry about trust after lunch.

## 15 · WHAT VIBE CODING IS

- The mindset shift is the same one a good tech lead makes: stop specifying keystrokes, start specifying outcomes.
- Pure vibe coding is fine for prototypes and personal tools. Karpathy's own example was a weekend project.
- The rest of the day is about when “don't care how” stops being acceptable.

## 16 · THE AGENTIC LOOP

- This loop is old. It's the edit, compile, run cycle, with the agent doing the edit and compile.
- The constraint has moved to step 4. You can only steer as fast as you can look at reality and judge it.
- Small turns win because each one is cheap to judge and cheap to throw away.

## 17 · WHAT THE AGENT ACTUALLY IS

- Anthropic's “Building effective agents” (December 2024) draws a useful line: workflows follow fixed code paths; agents decide their own next step and tool.
- Claude Code and Codex are agents in that sense. That's what makes them powerful, and what makes permissions matter.
- The same piece's best advice: use the simplest thing that works, and add complexity only when you need it.

## 18 · THE ONE RULE FOR THIS MORNING

- There's 40 years of research behind this rule. Lisanne Bainbridge's “Ironies of Automation” (1983) found automation leaves people the hardest tasks while their hands-on skills fade.
- Her conclusion: the more automated the system, the more its people need training, not less.
- That's this course: give up the typing, keep the judgement sharp. The tutor slide later is the other half.

## 19 · PROMPT BY OUTCOME

- This is how you'd brief a strong contractor: the outcome, the rules, and “show me your plan”.
- Step-by-step prompts also cap the agent at your own idea of the solution. Outcome prompts let it find a better one.
- Constraints are the expensive part to get right. They're where your experience pays.

## 20 · PLAN REVIEW, NOT PLAN WRITING

- Read the plan like a design doc from a smart new hire. Is it solving the right problem, at the right size?
- The dangerous plan is the plausible one. Nobody argues with a tidy plan for slightly the wrong thing.
- Cheapest moment to change direction is before any code exists.

## 21 · PERMISSIONS ARE A DIAL

- Real story from building this course: the agent's permission checks refused to force-push our git tags, or add a new package, until a human said yes.
- That's the dial doing its job: risky and hard to undo means a person decides.
- Claude Code's sandboxing, which fences off the file system and network, works on macOS and WSL2, not on native Windows. One more reason we use WSL.
- Rule of thumb: the dial should match what you'd lose if the agent got it badly wrong.

## 22 · THE COCKPIT

- If you remember one command today, make it /context. Most “the agent got dumb” moments are a full window.
- /compact summarises; /clear forgets. Compact mid-task, clear between tasks.
- Effort is a separate knob from model choice: how long it thinks before answering. Medium is the default on the newest models.

## 23 · CONTEXT IS THE FUEL

- Too little context gives confident nonsense, and confident nonsense is the expensive failure.
- Too much shows up as drift: it starts honouring an instruction from an hour ago you've forgotten giving.
- A fresh session with a good contract file usually beats a long one. That's this afternoon's idea in miniature.

## 24 · SPEND TOKENS ON PURPOSE

- Every turn resends the whole conversation, so a long session gets more expensive per turn as well as worse.
- opusplan maps neatly onto the course: think hard during planning, then build on a cheaper model.
- Usage limits are per person and per plan. The goal is nobody hitting theirs at 2:30 in the afternoon.

## 25 · WHEN IT BREAKS — IT WILL

- Brian Kernighan, 1978: debugging is twice as hard as writing the code. If you wrote it as cleverly as you can, how will you debug it?
- With agents, the person debugging didn't write it at all, which is why symptoms beat diagnosis.
- Paste the real error, not your summary of it. Your summary drops the clue.

## 26 · COMMIT SMALL, SHIP OFTEN

- Agents write good commit messages if you ask, often better than ours.
- Small commits matter more with agents: a bad turn can touch ten files, and git revert is cleaner than untangling it.
- Habit to build: green means commit.

## 27 · WHAT CHANGED SINCE 2025

- Some dates for context: Claude Code previewed in February 2025, Codex CLI in April 2025, hooks and sub-agents arrived mid-2025.
- MCP is from November 2024; AGENTS.md from August 2025; skills from October 2025. In December 2025, MCP and AGENTS.md went to the Linux Foundation's new Agentic AI Foundation.
- Translation: most of what we teach today is less than two years old. Nobody in this room is behind.

## 28 · USE IT AS A TUTOR, NOT JUST A TYPIST

- This is the answer to Bainbridge's irony: if the automation does the work, you deliberately keep your understanding exercised.
- “Quiz me” is the underrated one. Retrieval practice is one of the best-evidenced ways people learn.
- If you can't explain the diff, you can't review the next one. The tutor habit protects your judgement.

## 29 · DAY ONE BACK: A CODEBASE YOU DIDN'T WRITE

- This works on any codebase, and it's the best first-week use of an agent I know.
- “What would you be nervous to change?” often surfaces the code with no tests and the most callers.
- Do it before your first standup back. You'll ask better questions than people who've been there all year.

## 30 · FIVE GOLDEN RULES

- Ask the room: which rule will be hardest for you personally? Usually it's the first one.
- These are in the handbook, so nobody needs to photograph the slide.

## 31 · BY 4PM YOU'LL HARDEN THIS WITH A TEAM OF AGENTS

- Lab: handbook Section 1, Blocks A to D.
- Read the plan before approving. It's the cheapest review you'll ever do.
- Stuck on setup for more than five minutes? Hand up. That's what Paul Hughes and I are here for.

## 32 · LUNCH

- Commit before you eat.
- Behind? After lunch, start Section 2 from checkpoint-1-working. Nobody will know, and it's the design.

## 33 · SECTION 02 · MAKE IT REPEATABLE

- Section 2 is the difference between a demo and a practice: things you set up once that pay off every session after.
- Most of it is plain text files in the repo, which means it's reviewable, versioned and shareable like code.

## 34 · THE DAY IS A LADDER

- Rung two. Same app, same agent. Now we stop paying the same explaining cost every session.

## 35 · WHAT VIBE ENGINEERING IS

- Simon Willison's list for vibe engineering starts with automated tests, planning ahead, good documentation and version-control habits. Old engineering virtues, new reason.
- The idea: the project carries the knowledge, so any session, any agent, any teammate starts from the same place.

## 36 · FIVE MOVES THIS SESSION

- Each move is a file you commit, not a trick you remember.
- That's why they survive you going on leave, which is a fair test for anything you set up at work.

## 37 · MOVE 1 · THE PROJECT CONTRACT

- AGENTS.md started as an OpenAI-led format in August 2025 and claims use in over 60,000 open-source projects. It now sits with the Linux Foundation.
- Write it for a new teammate: commands, layout, the non-obvious rules. If a human would find it useful, so will the agent.
- Keep it short. Every line is read every session, so a bloated contract taxes every turn.
- Demo: open the reference repo's AGENTS.md. About a hundred lines, and every one earns its place.

## 38 · MOVE 2 · SKILLS

- Anthropic launched skills in October 2025 and published the format as an open standard in December. Codex, Gemini CLI, GitHub Copilot and Cursor now read the same SKILL.md.
- That's the quiet win: one file works across tools. Last cohort, Codex users had to copy prompts into a hidden folder by hand.
- A skill can carry scripts as well as instructions, so it can do things, not just describe them.

## 39 · HOW A SKILL LOADS

- This is the same “attention budget” idea from Section 1, applied to know-how.
- Fifty skills cost you fifty one-line descriptions until one is used. That's why skills scale better than one giant contract.
- Most skill bugs are description bugs: too vague and it never fires, too broad and it fires on everything.

## 40 · WHICH ONE DO I REACH FOR?

- Ask the room: where should “our API dates are always UTC” live? (The contract: always true.)
- And “how we cut a release”? (A skill: a procedure you run sometimes.)
- This table comes back at the end of the day with all five filled in.

## 41 · MOVE 3 · MANAGE CONTEXT ON PURPOSE

- Long sessions don't just cost more; they drift. The context-rot research says the same thing in numbers.
- /compact keeps a summary and drops the detail, so it's lossy. If a detail matters, put it in a file.
- One task, one session is the agent version of one change per pull request.

## 42 · MOVE 4 · A SECOND OPINION

- There's evidence for a different reviewer: models rate their own outputs more highly (Panickssery et al., 2024).
- The better a model recognises its own writing, the stronger that bias gets.
- Two tools from two companies make the most independent second opinion you can get for the price of one command.
- The interesting output is the disagreements. That's where you earn your keep.

## 43 · MOVE 5 · REACH REAL DATA WITH MCP

- Anthropic released MCP in November 2024. OpenAI adopted it in March 2025, and by December there were over 10,000 public MCP servers.
- Think of it as USB for agents: one plug shape, many devices.
- Context7 is a good first server for returners: it pulls current library docs, so the agent stops quoting APIs from its training data.

## 44 · HOW MCP WORKS

- An MCP tool is described to the model the same way a skill is: name and description. The model picks by reading.
- Tool output lands in your context window. A chatty server can fill it fast, which is why Claude Code caps tool output.
- Local servers run with your permissions on your machine. Treat them like any program you install.

## 45 · CONNECTING ONE

- The -- trips everyone once. Everything after it is the server's own command line.
- Project scope writes .mcp.json into the repo, so the whole team gets the same servers. Claude Code asks before using them.
- Demo: claude mcp add context7, then /mcp to show it connected.

## 46 · YOU ARE TRUSTING IT

- Simon Willison named prompt injection in September 2022, after SQL injection.
- His 2025 “lethal trifecta” is the checklist: access to private data, exposure to untrusted content, and a way to send data out.
- Any agent with all three can be tricked into leaking.
- The defence is architectural: break one leg of the trifecta. Don't rely on the model spotting the trick.

## 47 · THE FEATURE THAT NEEDS JUDGEMENT

- There's no wrong answer here. Teams ship both.
- The engineering is in the guard rails either way. The reference app falls back to the template if the model call fails.
- It also tags each response with where the text came from, so the UI can say so.
- Real story: while preparing this course I found the app's default model was two generations old.
- It would have failed quietly into the template. That source tag is how you'd notice.
- Ask the room: which would you ship, and what would make you change your mind?

## 48 · WHERE YOU'LL BE BY THE BREAK

- Scheduled days are the one to finish. The afternoon's progress ring is built on them.
- If you're behind, checkpoint-2-features is the start line for Section 3. Using it is the plan, not a failure.

## 49 · FIVE RULES FOR THIS SESSION

- If I had to keep one: make the agent surface decisions. It's the habit that scales to production.
- Lab: handbook Section 2. Finish early? Colour tiles, the theme toggle, or the MCP stretch.

## 50 · BRIDGE TO SECTION 3 · AFTER THE BREAK

- Here's the honest question: you've added five features in two hours. Which ones are you sure work?
- The afternoon's answer isn't reading the code harder. It's building something that tells you.

## 51 · BREAK

- Commit before the break.
- Behind? checkpoint-2-features is your start line for Section 3.

## 52 · SECTION 03 · THE HARNESS

- Section 3 is the part I care most about, because it's what decides whether this works at a company or only on a laptop.
- Anthropic now says more than 80% of the code it merges is written by Claude. At that volume, nobody reads every line. The checks do the work.

## 53 · THE TOP OF THE LADDER

- Last crutch: trusting your eyes. It's the hardest one for experienced engineers to put down.

## 54 · WHERE WE GOT TO

- Fast and consistent is where most teams stop, and DORA's 2025 data shows why that's risky: AI use now lifts throughput, but it still hurts delivery stability.
- Speed without proof just moves the bugs downstream faster.

## 55 · WHAT AGENTIC ENGINEERING IS

- This is Karpathy's “agentic engineering” in practice: you orchestrate and you're the oversight.
- The question “what would prove this is right?” is an old one. It's what CI, TDD and code review were always for. The agent just makes it urgent.

## 56 · READING HARDER DOESN’T SCALE

- Human review has known limits. The SmartBear study of Cisco's reviews recommends 200 to 400 lines at a time and under an hour; past that, defect-finding drops.
- An agent can produce more than that in one turn. Reading harder can't keep up.
- The bugs that get through aren't the obvious ones. They're the ones that look right.

## 57 · YOUR GUT IS NOT A METRIC

- METR, July 2025: 16 experienced open-source developers on their own repos. With AI they took 19% longer, and still believed they'd been sped up by about 20%.
- The follow-up is the twist: by 2026, 30 to 50% of invited developers wouldn't take part, because they refused to work without AI.
- The tools got good enough that the experiment broke.
- DORA's line: AI doesn't fix a team; it amplifies what's already there. Strong testing gets stronger, and weak testing gets exposed.
- Stack Overflow 2025: 84% use or plan to use AI tools, but only 3% highly trust the output.
- The rest of this section is how you earn trust you can measure.

## 58 · THE FOUR MOVES

- This is defence in depth. James Reason's Swiss cheese model (1990): every layer has holes, and accidents happen when the holes line up.
- Tests, narrow reviewers, hooks and CI are four slices with holes in different places.
- No single slice has to be perfect. The stack does.

## 59 · MOVE 1 · THE HARNESS

- “One command” matters because the agent can run it unprompted, read the failure, and fix it, all inside one turn.
- Lint catches the cheap mistakes, types catch the wrong shapes, tests catch wrong behaviour. Each is cheaper than the next layer up.
- Demo: break a test on purpose, run make check, and let the agent fix it without help.

## 60 · THE TESTS ARE THE SPEC

- Kent Beck popularised test-driven development in 2002, and he called it a rediscovery: old programmers wrote the expected output first, then coded until it matched.
- Red, green, refactor. The red is the proof: a test that never failed might not be testing anything.
- Midnight is the honest gap. Nothing in this app knows your time zone, and we record that with an expected-failure test rather than pretending.

## 61 · MOVE 2 · SUB-AGENTS

- Each sub-agent gets its own fresh context window, so the reviewer starts without the author's assumptions.
- Minimal tools is least privilege, the oldest idea in security, applied to agents.
- The verifier only runs commands, so it runs on haiku. Cheap, fast, and plenty for the job.

## 62 · WHY NARROW BEATS CAPABLE

- LLM-as-judge research (Zheng et al., 2023) found consistent biases: favouring an answer for its position, favouring longer answers, and favouring their own.
- So a separate, read-only reviewer is a design fix for a measured bias, not just a nice idea.
- No write access also means it can't quietly fix a problem and leave no trace.

## 63 · HOW THE HANDOFF WORKS

- Treat a sub-agent like a contractor you'll never speak to again: the brief is all it gets.
- Ask for structure back: numbered findings, file and line, severity. It makes disagreements easy to settle.
- It returns a summary, not its working, so your main context stays clean. That's the other reason to delegate.

## 64 · MOVE 3 · THE AGENT TEAM

- This is a small engineering team with you as tech lead. The skills transfer directly: clear tickets, clear acceptance criteria, settle disputes.
- When the team stalls, ask what “done” means and whether a test says so. That fixes more than prompt tweaks do.
- Your job is the decisions only a person should make: scope, trade-offs, and when to stop.

## 65 · PARALLEL AGENTS, SEPARATE CHECKOUTS

- git worktree has been in git since version 2.5 in 2015. Most people never needed it until agents started working in parallel.
- Claude Code now makes it one flag, and the Codex app has it built in.
- Running two takes on the same task and comparing them is cheap now. It used to cost a second engineer.

## 66 · WORKTREE GOTCHAS

- Number two catches everyone: a fresh worktree has no node_modules, so the first run looks broken.
- Number three: two apps fighting over port 5173 produce some very confusing errors.
- Real story: our own hooks had to be fixed to work inside worktrees. Slide 72 covers it.

## 67 · CLOSING IT OFF: MERGE, THEN CLEAN UP

- The refusals are the safety net: git won't delete uncommitted work or unmerged branches unless you insist with --force or -D.
- If you prefer review, push the winner and open a pull request. CI then runs the same checks a teammate's change would face.
- Demo: run the whole sequence once so the room has seen a clean finish.

## 68 · MOVE 4 · MAKE IT NON-OPTIONAL

- A contract is advice the agent may forget as context fills. A hook runs every time, whatever the agent remembers.
- Hooks arrived in Claude Code in mid-2025. Codex has them too, now on by default.
- It's the same lesson as CI: anything that depends on someone remembering will eventually be forgotten.

## 69 · BEFORE OR AFTER

- Toyota's production system has had this for decades: the andon cord. Any worker could stop the line the moment something looked wrong, so defects never travelled downstream.
- A before hook is your andon cord. An after hook is the inspection at the end of the station.
- You don't need the full list of events. Ask: do I want to stop it, or check it?

## 70 · TWO WE WIRE TODAY

- The guardrail protects the one piece of logic the whole app depends on. Every codebase has one; find yours.
- The verifier turns “I'm done” into “make check passed”. That's the definition of done, enforced.
- Demo: open .claude/settings.json in the reference repo. Both hooks fit on one screen.

## 71 · TWO THINGS THAT WILL CATCH YOU · 1

- This is the most common hook bug there is: a policy hook that exits 1 lets everything through.
- Exit 2 blocks, and whatever you print to stderr becomes the agent's instructions for what to do instead. Write it like a good error message.
- Test the block on purpose. A guardrail you've never seen fire is a guess.

## 72 · TWO THINGS THAT WILL CATCH YOU · 2

- This is a true story from preparing this course. Our Stop hook broke the first time the agent ran cd backend.
- The first fix used $CLAUDE_PROJECT_DIR, which then broke inside worktrees, because that variable stays pointed at the main checkout.
- The final fix asks git for the repo root from wherever the agent is. Two bugs, one lesson: test the harness like you test the code.

## 73 · EVALS · SCORING WHAT TESTS CAN’T

- Goodhart's law in the version people quote (Marilyn Strathern, 1997): when a measure becomes a target, it ceases to be a good measure.
- That's why we gate on the score dropping, not on hitting a number. A target invites gaming; a ratchet doesn't.
- Model graders have biases, as we saw: order, length, their own style. Shuffle the order and keep the rubric concrete.

## 74 · MAKING IT STICK AFTER TODAY

- Real story: this week our own CI went red. A GitHub Action we depend on stopped publishing the version tag we used.
- CI caught it before any student cloned the repo. That's the point of CI.
- Claude Code's /security-review launched in August 2025. Anthropic said its GitHub Action caught a remote-code-execution bug in an internal tool before merge.
- Headless mode is how this becomes routine: the same agent, run from a script or CI, inside the same checks.

## 75 · WHAT YOU MAY PUT INTO AN AGENT AT WORK

- Most companies now have an AI tools policy. Find yours in week one; asking early is cheaper than asking forgiveness.
- The lethal trifecta from Section 2 applies at work: private data, untrusted input and a way out, all in one agent, is the risky mix.
- A skill or MCP server from the internet is code running with your permissions. Read it first, the way you'd read a script before piping it to bash.

## 76 · WHICH ONE DO I REACH FOR? · RECAP

- Ask the room: where should “never commit straight to main” live? (A hook, because it must happen every time.)
- And “check the docs before using a library”? (A skill, or an MCP docs server.)
- If you can sort a new rule into this table in five seconds, you've got the model of the day.

## 77 · THE ONE RULE FOR THIS AFTERNOON

- Each time you catch yourself scrolling a diff for the bug, you've found a missing test, reviewer or gate. Add it.
- That turns one-off vigilance into something that protects every future change.

## 78 · IN THE LAB · 60 MINUTES

- Block A is the foundation. Skipping it to get to the agent team is the most common mistake.
- Watch at least one test fail before you make it pass.
- Behind? Reset to checkpoint-2-features and start the block clean.

## 79 · FIVE GOLDEN RULES

- If you take one thing to work: harness first. Everything else on this list stands on it.
- These five are the same in Claude Code, Codex, or whatever ships next year.

## 80 · WHEN YOU GET BACK TO YOUR OWN REPO

- Start small: one command that says yes or no. Teams that try to design the perfect setup first ship nothing.
- The repo that makes you nervous to review is your best candidate. That unease tells you where a harness would help most.
- DORA's amplifier point cuts both ways: put the harness in first, and AI makes your team better rather than faster at shipping bugs.

## 81 · BY 4PM: A HARDENED APP AND A TEAM THAT BUILT IT

- Showcase: one thing your agents built, and what proves it works. A passing make check counts.
- The skills scale. The Anthropic and Google numbers we saw only work because the checks scale with them.

## 82 · HELP US MAKE THE COURSE BETTER

- Two minutes on the form, please. What we learned from the last cohort is why worktrees, skills and the setup guide changed.
- Stay in the WhatsApp. We'll keep sharing what we learn as the tools move.

## Sources

- Karpathy, “vibe coding”, 2 Feb 2025: https://x.com/karpathy/status/1886192184808149383 (summary: https://en.wikipedia.org/wiki/Vibe_coding)
- Karpathy, “agentic engineering”, Feb 2026: https://thenewstack.io/vibe-coding-is-passe/
- Simon Willison, “Vibe engineering”, 7 Oct 2025: https://simonwillison.net/2025/Oct/7/vibe-engineering/
- METR RCT, 10 Jul 2025: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ ; follow-up 24 Feb 2026: https://metr.org/blog/2026-02-24-uplift-update/
- DORA 2025: https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
- Stack Overflow Developer Survey 2025 (AI): https://survey.stackoverflow.co/2025/ai
- SmartBear / Cisco code review guidance: https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/
- Bainbridge, “Ironies of Automation”, 1983: https://doi.org/10.1016/0005-1098(83)90046-8
- Reason, Swiss cheese model: https://en.wikipedia.org/wiki/Swiss_cheese_model
- Kernighan & Plauger on debugging: https://www.linusakesson.net/programming/kernighans-lever
- Goodhart / Strathern: https://en.wikipedia.org/wiki/Goodhart%27s_law
- Toyota jidoka and andon: https://global.toyota/en/company/vision-and-philosophy/production-system/index.html
- Kent Beck, TDD: https://www.oreilly.com/library/view/test-driven-development/0321146530/
- Google, 75% of new code (Pichai, Apr 2026): https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/
- Anthropic, more than 80% of merged code by Claude (May 2026): https://www.anthropic.com/institute/recursive-self-improvement
- Tech Council of Australia, Tech Jobs Report, Aug 2026: https://techcouncil.com.au/newsroom/tech-jobs-report-august-2026/
- MCP and the Agentic AI Foundation, Dec 2025: https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
- AGENTS.md: https://agents.md
- Agent Skills open standard: https://agentskills.io ; launch: https://claude.com/blog/skills
- Claude Code changelog (hooks, sub-agents, 2.0): https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md
- Checkpoints and /rewind: https://code.claude.com/docs/en/checkpointing
- git 2.5 worktrees: https://github.blog/open-source/git/git-2-5-including-multiple-worktrees-and-triangular-workflows/
- Prompt injection (Willison, 2022): https://simonwillison.net/2022/Sep/12/prompt-injection/ ; lethal trifecta (2025): https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- Instruction hierarchy (OpenAI, 2024): https://arxiv.org/abs/2404.13208
- ChatML and injection: https://github.com/openai/openai-python/blob/75c90a71e88e4194ce22c71edeb3d2dee7f6ac93/chatml.md
- Lost in the Middle: https://arxiv.org/abs/2307.03172 ; Context Rot: https://www.trychroma.com/research/context-rot ; Anthropic on context engineering: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- LLM-as-judge biases: https://arxiv.org/abs/2306.05685 ; self-preference: https://arxiv.org/abs/2404.13076
- Anthropic, “Building effective agents”: https://www.anthropic.com/engineering/building-effective-agents
- /security-review launch: https://www.anthropic.com/news/automate-security-reviews-with-claude-code
