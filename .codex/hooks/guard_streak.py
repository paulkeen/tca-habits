#!/usr/bin/env python3
"""PreToolUse guardrail (Codex): block edits to the streak logic unless a test
changes too.

Codex mirror of .claude/hooks/guard_streak.py. The intent is identical — the
streak calculation is the one piece of logic the whole app hangs on, and the
AGENTS.md contract says never to change it without a test — but the payload shape
differs from Claude Code's:

- Codex applies file edits through the `apply_patch` tool, so we match on
  tool_name == "apply_patch" and scan the patch text (in tool_input) rather than
  Claude's Edit/Write file_path + new_string fields.
- Codex blocks via a JSON "permissionDecision": "deny" on stdout (exit 0), rather
  than Claude's exit code 2.

Wire it in .codex/hooks.json as a PreToolUse hook with matcher "apply_patch".
"""
import json
import subprocess
import sys


def deny(reason: str) -> None:
    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason,
            }
        },
        sys.stdout,
    )
    sys.stdout.write("\n")


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # can't parse — don't get in the way

    if data.get("tool_name") != "apply_patch":
        return 0

    # The whole patch (file headers + changed lines) lives in tool_input; scan all
    # of it so we don't depend on the exact key name (command / input / patch).
    blob = json.dumps(data.get("tool_input", {}) or {})
    touches_streak = "backend/main.py" in blob and (
        "compute_streak" in blob or "streak" in blob.lower()
    )
    if not touches_streak:
        return 0

    status = subprocess.run(
        ["git", "status", "--porcelain", "backend/tests"],
        capture_output=True,
        text=True,
    ).stdout
    if status.strip():
        return 0  # a test is already being changed — allow it

    deny(
        "This patch changes the streak logic in backend/main.py, but no test under "
        "backend/tests/ has been modified. Add or update a test first "
        "(AGENTS.md: never change the streak calculation without a test)."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
