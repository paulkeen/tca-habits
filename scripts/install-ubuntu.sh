#!/usr/bin/env bash
# Installs every course prerequisite on Ubuntu (WSL2 or a Linux laptop), then
# downloads the reference app, sets it up and runs the preflight check.
# Safe to re-run: anything already installed is skipped.
#
# Windows users never run this by hand; install-windows.ps1 calls it inside WSL.
# On Ubuntu or Debian:
#   curl -fsSL https://raw.githubusercontent.com/paulkeen/tca-habits/main/scripts/install-ubuntu.sh | bash
#
#   --system   install the apt packages only (must run as root; used by install-windows.ps1)
set -euo pipefail

REPO_URL="https://github.com/paulkeen/tca-habits.git"
REF_DIR="$HOME/tca-habits-reference"
NODE_MAJOR=22
NVM_VERSION="v0.40.3"
APT_PACKAGES="make git curl unzip ca-certificates python3"

step() { printf '\n==> %s\n' "$1"; }
ok()   { printf '    done: %s\n' "$1"; }

# A Linux copy of the tool, not a Windows one leaking in through /mnt/c on WSL.
have_linux() {
  local p
  p="$(command -v "$1" 2>/dev/null)" || return 1
  case "$p" in /mnt/*) return 1 ;; esac
}

system_packages() {
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  # shellcheck disable=SC2086
  apt-get install -y -qq $APT_PACKAGES >/dev/null
}

if [ "${1:-}" = "--system" ]; then
  [ "$(id -u)" -eq 0 ] || { echo "--system must run as root"; exit 1; }
  step "System packages ($APT_PACKAGES)"
  system_packages
  ok "apt packages installed"
  exit 0
fi

if [ "$(id -u)" -eq 0 ]; then
  echo "Run this as your normal user, not root (it installs into your home folder)."
  exit 1
fi
cd "$HOME"

step "System packages"
missing=""
for tool in make git curl unzip python3; do have_linux "$tool" || missing="$missing $tool"; done
if [ -n "$missing" ]; then
  echo "    installing:$missing (sudo asks for your Ubuntu password; typing shows nothing)"
  sudo bash -c "APT_PACKAGES='$APT_PACKAGES'; $(declare -f system_packages); system_packages"
fi
ok "make, git, curl, unzip, python3"

# Scripts and the Makefile break with Windows line endings ("bash\r").
if [ "$(git config --global core.autocrlf || true)" != "input" ]; then
  git config --global core.autocrlf input
fi

step "Node $NODE_MAJOR"
export NVM_DIR="$HOME/.nvm"
node_ok() { have_linux node && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge "$NODE_MAJOR" ]; }
if ! node_ok; then
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash >/dev/null
  fi
  # nvm is not written for `set -u`.
  set +u
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm install "$NODE_MAJOR" >/dev/null
  nvm alias default "$NODE_MAJOR" >/dev/null
  set -u
fi
ok "node $(node --version)"

step "uv and Claude Code"
export PATH="$HOME/.local/bin:$PATH"
# shellcheck disable=SC2016  # written literally so .bashrc expands it later
grep -qs '.local/bin' "$HOME/.bashrc" || echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
have_linux uv || curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null
ok "$(uv --version)"
have_linux claude || curl -fsSL https://claude.ai/install.sh | bash >/dev/null
ok "claude $(claude --version 2>/dev/null | head -1)"

# Older Ubuntu releases ship Python 3.10; uv can supply a newer python3.
py_minor="$(python3 -c 'import sys; print(sys.version_info[1])' 2>/dev/null || echo 0)"
if [ "$py_minor" -lt 11 ]; then
  step "Python 3.12 (this Ubuntu's python3 is too old)"
  uv python install 3.12 --default --preview >/dev/null 2>&1 || echo "    could not install it; the check below says what to do"
fi

step "Course reference app ($REF_DIR)"
if [ -d "$REF_DIR/.git" ]; then
  git -C "$REF_DIR" pull --ff-only -q || echo "    could not update it (local changes?); using it as it is"
else
  git clone -q "$REPO_URL" "$REF_DIR"
fi
cd "$REF_DIR"
# setup.sh is chatty (package lists, npm audit banners); keep it in a log unless it fails.
log="$HOME/tca-setup.log"
echo "    installing the app's packages (a minute or two; details in $log)"
if ! ./scripts/setup.sh >"$log" 2>&1; then
  tail -30 "$log"
  echo "setup.sh failed; the full log is $log"
  exit 1
fi
ok "app installed"

step "Checking everything"
./scripts/preflight.sh || true
