"""
Test suite for the TCA Habits API.
Uses a temporary file-based SQLite database, one per test function.
"""
import os
import sys
import tempfile
import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture()
def client():
    """
    Yield a TestClient wired to a fresh, isolated SQLite database.
    Each test gets its own engine so there is no cross-test contamination.
    """
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)

    url = f"sqlite:///{db_path}"
    engine = create_engine(url, connect_args={"check_same_thread": False})
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Patch the database module BEFORE importing main
    import database
    database.engine = engine
    database.SessionLocal = Session

    # Now import (or re-use) main; dependency_overrides will redirect sessions
    from database import Base, get_db
    Base.metadata.create_all(bind=engine)

    from main import app

    def override_get_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app, raise_server_exceptions=True) as c:
        yield c, Session

    app.dependency_overrides.clear()
    engine.dispose()
    os.unlink(db_path)


def create_test_habit(c: TestClient, name: str = "Test Habit") -> dict:
    resp = c.post("/habits", json={
        "name": name,
        "emoji": "✅",
        "category": "personal",
        "target_days": [0, 1, 2, 3, 4, 5, 6],
    })
    assert resp.status_code == 201
    return resp.json()


def test_create_habit(client):
    c, _ = client
    habit = create_test_habit(c, "Morning Yoga")
    assert habit["name"] == "Morning Yoga"
    assert habit["emoji"] == "✅"
    assert habit["category"] == "personal"
    assert habit["target_days"] == [0, 1, 2, 3, 4, 5, 6]
    assert habit["current_streak"] == 0
    assert habit["total_completions"] == 0


def test_create_habit_invalid_category(client):
    c, _ = client
    resp = c.post("/habits", json={
        "name": "Bad",
        "emoji": "x",
        "category": "invalid",
        "target_days": [1],
    })
    assert resp.status_code == 422


def test_mark_complete_streak_one(client):
    c, _ = client
    habit = create_test_habit(c)
    resp = c.post(f"/habits/{habit['id']}/complete")
    assert resp.status_code == 200
    data = resp.json()
    assert data["completed_today"] is True
    assert data["current_streak"] == 1
    assert data["total_completions"] == 1


def test_mark_complete_idempotent(client):
    c, _ = client
    habit = create_test_habit(c)
    c.post(f"/habits/{habit['id']}/complete")
    resp = c.post(f"/habits/{habit['id']}/complete")
    assert resp.status_code == 200
    assert resp.json()["total_completions"] == 1


def test_streak_two_days_in_a_row(client):
    """Insert a completion for yesterday directly, then complete today."""
    c, Session = client
    habit = create_test_habit(c)
    habit_id = habit["id"]

    db = Session()
    from models import Completion
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    db.add(Completion(habit_id=habit_id, completed_date=yesterday))
    db.commit()
    db.close()

    resp = c.post(f"/habits/{habit_id}/complete")
    assert resp.status_code == 200
    assert resp.json()["current_streak"] == 2


def test_streak_resets_after_miss(client):
    """Two days ago completed, yesterday missed, today completed. Streak = 1."""
    c, Session = client
    habit = create_test_habit(c)
    habit_id = habit["id"]

    db = Session()
    from models import Completion
    two_days_ago = (date.today() - timedelta(days=2)).isoformat()
    db.add(Completion(habit_id=habit_id, completed_date=two_days_ago))
    db.commit()
    db.close()

    resp = c.post(f"/habits/{habit_id}/complete")
    assert resp.status_code == 200
    assert resp.json()["current_streak"] == 1


def test_get_stats(client):
    c, _ = client
    resp = c.get("/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_completions" in data
    assert "active_streaks" in data
    assert "perfect_days_this_week" in data
    assert "longest_streak_ever" in data
    assert data["total_completions"] == 0


def test_get_stats_after_completion(client):
    c, _ = client
    habit = create_test_habit(c)
    c.post(f"/habits/{habit['id']}/complete")
    resp = c.get("/stats")
    data = resp.json()
    assert data["total_completions"] == 1
    assert data["active_streaks"] == 1


def test_delete_habit(client):
    c, _ = client
    habit = create_test_habit(c)
    resp = c.delete(f"/habits/{habit['id']}")
    assert resp.status_code == 204
    resp2 = c.get("/habits")
    assert all(h["id"] != habit["id"] for h in resp2.json())


def test_get_history(client):
    c, _ = client
    habit = create_test_habit(c)
    c.post(f"/habits/{habit['id']}/complete")
    resp = c.get(f"/habits/{habit['id']}/history")
    assert resp.status_code == 200
    history = resp.json()
    assert len(history) == 30
    today_entry = next(h for h in history if h["date"] == date.today().isoformat())
    assert today_entry["completed"] is True


def test_unmark_complete(client):
    c, _ = client
    habit = create_test_habit(c)
    c.post(f"/habits/{habit['id']}/complete")
    resp = c.delete(f"/habits/{habit['id']}/complete")
    assert resp.status_code == 200
    assert resp.json()["completed_today"] is False
    assert resp.json()["current_streak"] == 0
