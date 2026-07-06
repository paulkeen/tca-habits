"""Optional AI text generation with a deterministic fallback.

Section 2 of the course adds two features whose copy can come from a model or a
template: the weekly summary paragraph and the streak-at-risk encouragement
nudge. This module is the single seam where that "model call vs. template"
engineering decision lives.

If ANTHROPIC_API_KEY is set (and the `anthropic` package is installed), we ask
Claude to write the copy. Otherwise, and on any error, we fall back to a
deterministic template so the app always runs from a clean clone with no
configuration. That keeps the checkpoint honest for the facilitator checklist:
`git checkout checkpoint-2-features` and it just works, key or no key.
"""

from __future__ import annotations

import os

# Haiku is the right tier for short, high-volume, latency-sensitive copy like a
# one-line nudge. Override with ANTHROPIC_MODEL if you want Sonnet/Opus quality.
DEFAULT_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-haiku-4-5")


def _client():
    """Return an Anthropic client, or None if we should use the fallback."""
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return None
    try:
        import anthropic
    except ImportError:
        return None
    try:
        return anthropic.Anthropic()
    except Exception:
        return None


def generate(system: str, prompt: str, fallback: str) -> tuple[str, str]:
    """Generate text via Claude, falling back to `fallback` on any problem.

    Returns (text, source) where source is "model" or "template" so the caller
    (and the UI) can be honest about where the words came from.
    """
    client = _client()
    if client is None:
        return fallback, "template"
    try:
        resp = client.messages.create(
            model=DEFAULT_MODEL,
            max_tokens=300,
            system=system,
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(b.text for b in resp.content if b.type == "text").strip()
        return (text, "model") if text else (fallback, "template")
    except Exception:
        # Network down, bad key, rate limit — the app still works.
        return fallback, "template"
