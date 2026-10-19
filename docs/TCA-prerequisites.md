# Back in the Code: before the day

**Tech Council of Australia · Agentic Engineering**

Please finish this **at least two days before the course**. It takes about 30 to 45 minutes. When it's done, post ✅ in the cohort WhatsApp group. If anything fails, post a screenshot of the error and we'll sort it out before the day, not at 9:30 on the morning.

You don't need to understand any of the commands below. Copy each grey box into your terminal, press Enter, and check that it does what the box says.

---

## Step 1 · Get the accounts (10 minutes)

| Account | Needed? | Notes |
|---|---|---|
| **Claude Pro** (or Max, Team, Enterprise) | **Yes** | Sign up at [claude.ai](https://claude.ai). The **free plan does not include Claude Code**, so the course won't work on it. |
| **GitHub** | **Yes** | A free account at [github.com](https://github.com) is fine. |
| ChatGPT Plus or higher | Optional | Only if you'd like to try OpenAI Codex as well. Everything in the course works with Claude alone. |

**Using a work laptop?** Check now that you can install software and that your company network doesn't block `claude.ai`. If you can't install anything, follow the separate **Codespaces Setup** guide instead of steps 2 and 3, then come back for steps 4 to 6.

---

## Step 2 · Pick your path

| Your laptop | Follow |
|---|---|
| Mac | **Step 3A** |
| Windows | **Step 3B**: one command does everything |
| Windows work laptop where you can't approve "allow this app to make changes" | The **Codespaces Setup** guide, then Step 4 onwards |
| Linux (Ubuntu or Debian) | **Step 3C**: one command does everything |

---

## Step 3A · Mac setup (15 minutes)

Open **Terminal** (press Cmd+Space, type *Terminal*, press Enter).

**1. Homebrew**, the Mac package installer. Skip this if `brew --version` already prints a version. It asks for your Mac password, and it also installs Apple's developer tools (`git` and `make`), so on a new Mac it can sit quietly for 5 to 10 minutes. Let it run.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When it finishes, it prints two or three lines under **"Next steps"**. Copy and run those too, then **close Terminal and open a new one**.

**2. Node, Python and uv:**

```bash
brew install node python uv
```

**3. Claude Code:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Close Terminal and open a new one, then go to **Step 4**.

---

## Step 3B · Windows setup (one command, about 30 minutes)

A setup script does all of it for you. It turns on WSL (a Linux system that runs inside Windows), installs Ubuntu, installs every tool the course needs, then downloads the course app and checks it.

**1.** Click Start, type *PowerShell*, and open **Windows PowerShell**. You don't need "Run as administrator".

**2.** Paste this line and press Enter:

```powershell
irm https://raw.githubusercontent.com/paulkeen/tca-habits/main/scripts/install-windows.ps1 | iex
```

**3.** Leave the window open. It may ask you to do three things:

- **"Do you want to allow this app to make changes?"** Click **Yes**. It asks once, to turn WSL on.
- **"RESTART YOUR COMPUTER"**. Restart, open PowerShell again, and paste the same line. It carries on from where it stopped.
- **Choose an Ubuntu username and password.** Use lowercase letters for the username. The password shows nothing as you type; that's normal. Write it down. When you see a prompt ending in `$`, type `exit` and press Enter.

It ends with a list of **PASS** lines and **Setup finished.** Skip Step 4 (the script has already checked everything) and go to **Step 5**.

**Two Windows rules for the day:**

- From now on, use the **Ubuntu** app (Start menu, type *Ubuntu*) for every command in the course, not PowerShell. Your work lives in its home folder (`~`); **don't** work in `/mnt/c/...`, where everything runs much slower.
- Open the app in your normal Windows browser at `http://localhost:5173`. It works across from Ubuntu automatically.

---

## Step 3C · Linux setup (one command, about 15 minutes)

On Ubuntu or Debian, open a terminal and run:

```bash
curl -fsSL https://raw.githubusercontent.com/paulkeen/tca-habits/main/scripts/install-ubuntu.sh | bash
```

It asks for your password once (for the system packages), installs everything, downloads the course app and ends with a list of **PASS** lines. Open a new terminal and go to **Step 5**. On another distribution, install `make`, `git`, Node 22, Python 3.11, uv and Claude Code yourself, then do Step 4.

---

## Step 4 · Check everything installed (2 minutes)

Mac and Codespaces only; on Windows and Linux the script did this for you. Run this. **Every line must print a version number, not an error.**

```bash
claude --version
git --version
make --version | head -1
node --version      # must be v22 or higher
python3 --version   # must be 3.11 or higher
uv --version
```

Optional, if you have a ChatGPT plan:

```bash
npm install -g @openai/codex && codex --version
```

---

## Step 5 · Log in and save tokens (5 minutes)

**1. Log in to Claude Code:**

```bash
claude
```

Follow the prompts. A browser opens; sign in with your Claude account. If no browser opens, press **c** to copy the link and paste it into a browser yourself.

**2. Pick an economical default model.** Inside Claude Code, type:

```text
/model
```

Choose **Sonnet** and press Enter. Claude Code remembers this for future sessions. Sonnet is fast and capable, and it makes your plan's usage last all day; the course shows you when a bigger model is worth it.

**3. Leave Claude Code:** type `/exit`.

---

## Step 6 · Run the course app once (10 minutes)

This downloads the course's reference app, which is your safety net on the day, and proves everything works together.

**Mac and Codespaces** (on Windows and Linux the script already did this box, so skip it):

```bash
cd ~
git clone https://github.com/paulkeen/tca-habits.git tca-habits-reference
cd tca-habits-reference
./scripts/setup.sh
```

`setup.sh` takes a minute or two and ends with **"Setup complete."**

**Everyone:** run the automatic check, which prints PASS or FAIL for every prerequisite and asks Claude one tiny question to prove your login works:

```bash
cd ~/tca-habits-reference
./scripts/preflight.sh --agent
```

**Its output is what to paste into the WhatsApp group** if anything fails. Then start the app:

```bash
./scripts/dev.sh
```

Open **http://localhost:5173** in your browser. You should see a grid of coloured habit tiles. Click one; it fills in. 🎉

Back in the terminal, press **Ctrl+C** to stop the app.

**Last check: does the agent work?**

```bash
claude
```

Then type this and press Enter:

```text
In two sentences: what does this project do, and how do I run its tests?
```

It should describe a habit tracker and mention `make test` or `make check`. Type `/exit`.

**All done? Post ✅ in the WhatsApp group.**

---

## If something goes wrong

| What you see | What to do |
|---|---|
| `command not found` straight after installing something | Close the terminal and open a new one. Installers update your settings, but only new terminals see the change. |
| `claude` asks you to upgrade, or says your plan doesn't include Claude Code | You're on the free plan. Upgrade to Pro at claude.ai. |
| `node --version` shows v18 or v20 | **Mac:** `brew upgrade node`. **Windows and Linux:** run the setup command again. |
| `irm is not recognized` (Windows) | You're in Command Prompt, not PowerShell. Open **Windows PowerShell** and paste the line again. |
| The Windows script mentions **virtualization** or error `0x80370102` | Virtualization is switched off in your PC's firmware settings. Post in the WhatsApp group; if it's a work laptop, use the **Codespaces Setup** guide instead. |
| Preflight says WSL is using the Windows copy of a tool (`/mnt/c/...`) | Paste the Windows setup line into PowerShell again; it installs the Linux copy. Then open a new Ubuntu window. |
| `xcrun: error: invalid active developer path` (Mac) | Usually after a macOS update. Run `xcode-select --install`, click Install, then open a new Terminal. |
| `./scripts/setup.sh: Permission denied` | Run `bash scripts/setup.sh` instead. |
| `bash\r: No such file or directory` (Windows) | The repo was cloned with Windows line endings. Run `git config --global core.autocrlf input`, delete the folder, and clone again **inside Ubuntu**. |
| Port 5173 or 8000 "already in use" | An earlier `dev.sh` is still running in another terminal. Close it, or restart the terminal. |
| The browser login never finishes | Press **c** in Claude Code to copy the link, open it yourself, then paste the code it shows you back into the terminal. |
| Anything else | Screenshot the whole terminal and post it in the WhatsApp group. |

---

## Bring on the day

- Your laptop **and charger**.
- Your Claude login working (step 5). We'll test it at 9:30.
- **One sentence:** a habit you actually want to build. You'll use it to make the app your own.

Optional reading if you have 15 minutes: the first two lessons of Anthropic's free **Claude Code 101** course. You want the vocabulary (*agent*, *context window*, *permissions*), not mastery.

See you there.
