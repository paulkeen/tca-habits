"""API tests for the Section-2 AI features and the Section-3 monthly ring.

Reuses the isolated-DB `client` fixture from test_api.py (pytest discovers it
via conftest-style import). The AI endpoints are asserted in template mode —
no ANTHROPIC_API_KEY is set in CI, so `source` must be "template" and the copy
must reflect the real numbers.
"""
from datetime import date, timedelta

from conftest import create_test_habit


def test_monthly_progress_zero_at_start(client):
    c, _ = client
    habit = create_test_habit(c)
    resp = c.get(f"/habits/{habit['id']}/monthly")
    assert resp.status_code == 200
    data = resp.json()
    assert data["month"] == date.today().strftime("%Y-%m")
    assert data["due"] == date.today().day  # daily habit, 1st..today
    assert data["completed"] == 0
    assert data["percent"] == 0


def test_monthly_progress_after_completion(client):
    c, _ = client
    habit = create_test_habit(c)
    c.post(f"/habits/{habit['id']}/complete")
    data = c.get(f"/habits/{habit['id']}/monthly").json()
    assert data["completed"] == 1
    assert 0 < data["percent"] <= 100


def test_monthly_progress_404(client):
    c, _ = client
    assert c.get("/habits/99999/monthly").status_code == 404


def test_weekly_summary_template_mode(client, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    c, _ = client
    create_test_habit(c)
    resp = c.get("/stats/weekly-summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "template"
    assert isinstance(data["summary"], str) and data["summary"]


def test_encouragement_flags_at_risk_streak(client, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    c, Session = client
    habit = create_test_habit(c)  # daily habit
    habit_id = habit["id"]

    # Build a 2-day streak ending yesterday, leaving today's streak at risk.
    from models import Completion
    db = Session()
    for days_ago in (1, 2):
        db.add(Completion(habit_id=habit_id, completed_date=(date.today() - timedelta(days=days_ago)).isoformat()))
    db.commit()
    db.close()

    data = c.get("/encouragement").json()
    assert data["source"] == "template"
    assert data["habit_id"] == habit_id

    # Once today is ticked, the streak is safe and the nudge clears.
    c.post(f"/habits/{habit_id}/complete")
    assert c.get("/encouragement").json()["habit_id"] is None
