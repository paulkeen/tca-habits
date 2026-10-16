#!/usr/bin/env bash
# Runs once when the codespace is created (and again after a rebuild).
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"
for rc in "$HOME/.bashrc" "$HOME/.zshrc"; do
  [ -f "$rc" ] && grep -q '.local/bin' "$rc" || echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$rc"
done

command -v uv >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh
command -v claude >/dev/null 2>&1 || curl -fsSL https://claude.ai/install.sh | bash
command -v codex >/dev/null 2>&1 || npm install -g @openai/codex

./scripts/setup.sh

echo ""
echo "Codespace ready. Next: run 'claude' to log in, then ./scripts/preflight.sh"
