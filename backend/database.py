from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./habits.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_migrations(bind=None) -> None:
    """Lightweight, idempotent schema migrations for SQLite.

    SQLAlchemy's create_all() never alters existing tables, so older
    databases miss columns added after they were first created. We add
    them in place to preserve existing rows (and their streak history).
    """
    bind = bind or engine
    inspector = inspect(bind)
    if "habits" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("habits")}
    if "color" not in columns:
        with bind.begin() as conn:
            conn.execute(text("ALTER TABLE habits ADD COLUMN color VARCHAR NOT NULL DEFAULT 'blue'"))
