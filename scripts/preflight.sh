#!/usr/bin/env bash
# Pre-course check: prints PASS/FAIL for every prerequisite in the Prerequisites
# handout. Paste the whole output into the cohort chat if anything fails.
#
#   ./scripts/preflight.sh           # tools, versions, repo setup
#   ./scripts/preflight.sh --agent   # also asks Claude one short question (uses a few tokens)
#
# Written for bash 3.2 so it runs on a stock Mac as well as Linux, WSL and Codespaces.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fails=0

pass() { printf '  PASS  %s\n' "$1"; }
fail() { printf '  FAIL  %s\n        fix: %s\n' "$1" "$2"; fails=$((fails + 1)); }
note() { printf '  note  %s\n' "$1"; }

# version_at_least "3.12.4" 3 11  ->  true when major.minor >= 3.11
version_at_least() {
  local v="${1#v}" major minor
  major="${v%%.*}"; v="${v#*.}"; minor="${v%%.*}"
  [ "$major" -gt "$2" ] 2>/dev/null && return 0
  [ "$major" -eq "$2" ] 2>/dev/null && [ "${minor:-0}" -ge "$3" ] 2>/dev/null
}

need() {  # need <command> <fix hint>
  if command -v "$1" >/dev/null 2>&1; then return 0; fi
  fail "$1 is not installed (or not on PATH)" "$2"
  return 1
}

echo "TCA Habits preflight  ($(uname -s), $(date '+%Y-%m-%d %H:%M'))"
echo ""
echo "Tools"

if need claude "see Step 3 of the Prerequisites handout, then open a new terminal"; then
  pass "claude $(claude --version 2>/dev/null | head -1)"
fi
if need git "Mac: xcode-select --install   WSL: sudo apt install -y git"; then
  pass "$(git --version)"
fi
if need make "Mac: xcode-select --install   WSL: sudo apt install -y make"; then
  pass "$(make --version | head -1)"
fi
if need node "Mac: brew install node   WSL: nvm install 22"; then
  v="$(node --version)"
  if version_at_least "$v" 22 0; then pass "node $v"; else fail "node $v is too old (need 22+)" "Mac: brew upgrade node   WSL: nvm install 22"; fi
fi
if need python3 "Mac: brew install python   WSL: sudo apt install -y python3"; then
  v="$(python3 -c 'import platform; print(platform.python_version())' 2>/dev/null)"
  if version_at_least "$v" 3 11; then pass "python3 $v"; else fail "python3 ${v:-?} is too old (need 3.11+)" "Mac: brew install python, then open a new terminal"; fi
fi
if need uv "curl -LsSf https://astral.sh/uv/install.sh | sh, then open a new terminal"; then
  pass "$(uv --version)"
fi
if v="$(codex --version 2>/dev/null)" && [ -n "$v" ]; then
  pass "$(printf '%s' "$v" | head -1) (optional)"
else
  note "codex not installed (optional: npm install -g @openai/codex)"
fi

echo ""
echo "Environment"

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    fail "running in Git Bash on native Windows" "use the Ubuntu (WSL2) terminal, or GitHub Codespaces" ;;
  *) pass "shell: $(uname -s)" ;;
esac

if grep -qi microsoft /proc/version 2>/dev/null; then
  case "$ROOT" in
    /mnt/[a-z]/*) fail "repo is on the Windows drive ($ROOT)" "cd ~ and clone it again inside Ubuntu" ;;
    *) pass "WSL: repo is in the Linux home folder" ;;
  esac
  for tool in node npm claude; do
    p="$(command -v "$tool" 2>/dev/null || true)"
    case "$p" in
      /mnt/*) fail "WSL is using the Windows copy of $tool ($p)" "install $tool inside Ubuntu (Prerequisites Step 3B), then open a new terminal" ;;
    esac
  done
fi

if [ "$(git -C "$ROOT" config core.autocrlf 2>/dev/null)" = "true" ]; then
  fail "git core.autocrlf=true (scripts get Windows line endings)" "git config --global core.autocrlf input, then clone again"
fi

echo ""
echo "Reference repo ($ROOT)"

if [ -x "$ROOT/backend/.venv/bin/python" ] || [ -x "$ROOT/backend/.venv/Scripts/python.exe" ]; then
  pass "backend environment installed"
else
  fail "backend environment missing" "./scripts/setup.sh"
fi
if [ -d "$ROOT/frontend/node_modules" ]; then
  pass "frontend packages installed"
else
  fail "frontend packages missing" "./scripts/setup.sh"
fi

if [ "${1:-}" = "--agent" ] && command -v claude >/dev/null 2>&1; then
  echo ""
  echo "Agent"
  reply="$(cd "$ROOT" && claude -p "Reply with exactly one word: ready" 2>&1 | tail -1)"
  case "$reply" in
    *[Rr]eady*) pass "Claude answered: $reply" ;;
    *) fail "Claude did not answer (${reply:-no output})" "run claude, finish the login, then try again" ;;
  esac
fi

echo ""
if [ "$fails" -eq 0 ]; then
  echo "All checks passed. Post a tick in the cohort chat."
else
  echo "$fails check(s) failed. Fix them using the hints above, or paste this whole output into the cohort chat."
fi
exit $((fails > 0 ? 1 : 0))
