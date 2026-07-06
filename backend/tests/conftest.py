"""Shared pytest fixtures for the TCA Habits test suite.

Putting the isolated-DB `client` fixture here means every test module gets it by
just naming `client` as a parameter — no cross-module imports, which keeps the
linter happy and the suite easy to extend.
"""
import os
import sys
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Make the backend package root importable (main, database, models, ...).
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture()
def client():
    """Yield (TestClient, Session) wired to a fresh, isolated SQLite database.

    Each test gets its own engine so there is no cross-test contamination.
    """
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)

    url = f"sqlite:///{db_path}"
    engine = create_engine(url, connect_args={"check_same_thread": False})
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Patch the database module BEFORE importing main.
    import database

    database.engine = engine
    database.SessionLocal = Session

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
    """Create a daily habit and return the API response body."""
    resp = c.post(
        "/habits",
        json={
            "name": name,
            "emoji": "✅",
            "category": "personal",
            "target_days": [0, 1, 2, 3, 4, 5, 6],
        },
    )
    assert resp.status_code == 201
    return resp.json()
