#!/usr/bin/env python3
"""PreToolUse guardrail: block edits to the streak logic unless a test changes too.

The streak calculation is the one piece of logic the whole app hangs on, and the
AGENTS.md contract says never to change it without a test. This hook makes that
non-optional rather than something people remember only on good days.

It fires on Edit/Write/MultiEdit. If the edit targets backend/main.py and touches
streak logic, it requires an uncommitted change under backend/tests/ (staged,
unstaged, or a new file). Otherwise it blocks the edit (exit code 2) and tells the
agent what to do. Any other edit passes straight through.
"""
import json
import subprocess
import sys


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # can't parse — don't get in the way

    ti = data.get("tool_input", {}) or {}
    path = str(ti.get("file_path", ""))

    # Collect all text this tool call would write, across Edit/Write/MultiEdit.
    blob = " ".join(str(ti.get(k, "")) for k in ("old_string", "new_string", "content"))
    for edit in ti.get("edits", []) or []:
        blob += " " + str(edit.get("old_string", "")) + " " + str(edit.get("new_string", ""))

    touches_streak = path.replace("\\", "/").endswith("backend/main.py") and (
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

    sys.stderr.write(
        "Guardrail: this edit changes the streak logic in backend/main.py, but no "
        "test under backend/tests/ has been modified. Add or update a test first "
        "(AGENTS.md: never change the streak calculation without a test).\n"
    )
    return 2  # exit code 2 blocks the tool call and shows stderr to the agent


if __name__ == "__main__":
    sys.exit(main())
