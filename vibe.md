# Vibe Coding: Build Your Own Habit Tracker in 25 Minutes

A copy-paste prompt playbook for your first vibe-coding session. You describe what you want in plain English, Claude writes and runs the code, you look at the result and steer. You are the director, not the typist.

You are going to build a smaller version of this habit tracker app. It lists your habits, lets you tick each one off for the day, and counts your streaks. You choose the name, your starting habits, and a couple of personal touches. The shape of the app stays the same as the one in this repo: a **FastAPI + SQLite** backend and a **React + TypeScript + Vite** frontend. You will not write that setup by hand. You will ask for it.

---

## Prerequisites: install these BEFORE the session

On the day you only need Claude. Get everything below working ahead of time so no class minutes are lost to setup. Commands shown are for macOS with [Homebrew](https://brew.sh).

| Tool | Why | Install (macOS) |
|------|-----|-----------------|
| **Claude Code** | The tool you'll be prompting | `npm install -g @anthropic-ai/claude-code` (see [docs](https://docs.claude.com/en/docs/claude-code)) |
| **Node.js 18+** | Runs the frontend | `brew install node` |
| **Python 3.11+** | Runs the backend | `brew install python@3.11` |
| **uv** | Installs Python packages | `brew install uv` |
| **git** | Saves your work | `brew install git` (usually already installed) |
| A web browser | To see your app | Chrome, Safari, or Firefox |

**Sign in once before the day.** Open a terminal, run `claude`, and complete the login so you're ready to go.

**On Windows?** Install Node and Python from [nodejs.org](https://nodejs.org) and [python.org](https://python.org), install uv with the instructions at [astral.sh/uv](https://docs.astral.sh/uv/), then follow the Claude Code [setup docs](https://docs.claude.com/en/docs/claude-code).

### Verify your setup (run this the day before)

Paste these into a terminal. Each should print a version number, not an error.

```bash
claude --version
node --version
python3 --version
uv --version
git --version
```

If any line fails, fix that one before class. If they all print versions, you're ready.

---

## Five golden rules

1. **Describe the outcome, not the code.** Say what you want to see and do. Let Claude choose how.
2. **One change at a time.** Add a single feature, look at it, then ask for the next. Small steps are easy to fix; big leaps are hard to untangle.
3. **Always run it and look before moving on.** If you can't see it working, you don't yet know if it works.
4. **Give specific feedback.** "The tick button is too small and should be green" beats "make it nicer."
5. **When something breaks, show Claude what you see.** Paste the error or describe what happened on screen. Don't guess.

---

## Before you start (on the day)

Open Claude Code in an empty folder (not inside an existing project). Then work through the phases below in order.

---

## The plan

| Phase | Time | Goal |
|-------|------|------|
| 0 | 2 min | Name your tracker and pick your habits |
| 1 | 6 min | See your habits and tick them off, running in the browser |
| 2 | 4 min | Show a streak for each habit |
| 3 | 4 min | Add a habit yourself from the page |
| 4 | 5 min | Make it look good with a light/dark toggle |
| 5 | 3 min | Save your work |
| Stretch | spare time | One bonus feature |

---

## Phase 0 — Name it and pick your habits (2 min)

Decide on a name and three habits you'd actually like to track. No tech words needed.

> My habit tracker is called **[your name, e.g. Daily Wins]**. I want to start with these habits: **[e.g. drink water, read 10 pages, go for a walk]**.

**Why this works:** a clear, narrow idea gives Claude something concrete to build. Vague ideas produce vague apps.

---

## Phase 1 — Get the core running (6 min)

This first prompt is the big one. It builds the heart of the app and asks Claude to start it for you.

> Build the simplest possible version of a habit tracker called **[your name]**. Use a FastAPI + SQLite backend and a React + TypeScript + Vite frontend.
>
> To start, I only want two things: I can see a list of my habits, and I can tick each habit off as done for today (and untick it). Begin with these habits already in the list: **[your three habits]**.
>
> Set it all up, start the servers, and tell me the exact URL to open in my browser.

**Why this works:** it names one starting feature (tick a habit off today), keeps the data simple, and asks Claude to run it. You finish this phase looking at a real app, not a wall of code.

**What to check:** open the URL. Can you tick a habit and see it change? Can you untick it? If yes, move on. If not, go to "When it breaks" below.

---

## Phase 2 — Show a streak (4 min)

Streaks are what make a habit tracker satisfying. Add the count.

> For each habit, show a streak: the number of days in a row I've ticked it off. Show today's tick as the start of the streak. Then show me it working.

**Why this works:** one new idea, one number on screen you can point at. The phrase "show me it working" keeps Claude honest and keeps you in the loop.

---

## Phase 3 — Add a habit from the page (4 min)

Right now your habits are fixed. Make the app truly yours by adding new ones from the screen.

> Add a way to create a new habit from the page: a text box where I type a habit name and a button that adds it to my list. Keep everything else the same. Show me it working.

**Why this works:** "keep everything else the same" tells Claude not to redesign the parts you already like. You are protecting what works.

---

## Phase 4 — Make it look good (5 min)

Feedback is most useful when it is specific. Use any of these, one at a time.

> Make the page look clean and friendly. Centre the list, add some spacing, and use a calm green for the tick buttons.

> Let me give each habit an emoji so I can tell them apart at a glance.

> Add a light and dark theme toggle in the top corner, like the example habits app in this folder.

> Add a title at the top that says **[your tracker name]** with a short, encouraging subtitle.

**Why this works:** you are giving direction a person could act on. "Calm green," "an emoji per habit," and "toggle in the top corner" are all things Claude can do without guessing.

---

## Phase 5 — Save your work (3 min)

You saw this earlier in the session. Claude can handle git for you.

> This is working and I'm happy with it. Save my progress with git and a clear commit message describing what my habit tracker does.

**Why this works:** a commit is a checkpoint. If a later change goes wrong, you can come back to this exact working version.

---

## Stretch (if you have time)

Pick one. Stop the moment it works.

> Add a delete button so I can remove a habit I no longer want.

> Show a count at the top of how many habits I've ticked off today.

> Let me pick a colour for each habit, like the example app does.

> Add a simple view of the last 7 days so I can see which days I completed each habit.

---

## When it breaks

It will, and that is normal. Don't try to diagnose it yourself. Show Claude what you see.

> That didn't work. Here's what happened: **[paste the error, or describe what you saw on screen]**. Can you fix it and tell me in one line what went wrong?

If the screen is blank or nothing happens when you click:

> The page loaded but **[nothing happens when I tick a habit / the list is empty / I see an error]**. Can you check the browser console and the backend logs, fix it, and confirm it's working?

**Why this works:** Claude can read errors and logs far faster than you can. Your job is to report the symptom clearly. Its job is to find the cause.

---

## Phrases that steer well vs phrases that stall

| Try this | Instead of |
|----------|------------|
| "Add a tick button to each habit." | "Make it better." |
| "The button is too small, make it bigger and green." | "I don't like how it looks." |
| "Show me it working in the browser." | (saying nothing and hoping) |
| "Keep everything else the same and just add X." | "Redo the whole thing but with X." |
| "Here's the exact error: [paste]." | "It's broken." |

---

## The one habit to take away

Loop: **ask for one small thing → look at it → react.** Repeat. That loop is the whole skill. Everything else is detail.
