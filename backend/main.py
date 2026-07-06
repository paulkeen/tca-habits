"""TCA Habits — basic habit tracker (Section 1).

One file, on purpose. A vibe-coded first pass: it works, it's not pretty, and
that's fine. Sections 2 and 3 refactor and harden it.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import ForeignKey, String, create_engine, select
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    Session,
    mapped_column,
    relationship,
    sessionmaker,
)

# --- database ---------------------------------------------------------------

engine = create_engine("sqlite:///habits.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    emoji: Mapped[str] = mapped_column(String, default="✅")
    created_at: Mapped[str] = mapped_column(String, default=lambda: datetime.now().isoformat())

    completions: Mapped[list["Completion"]] = relationship(
        back_populates="habit", cascade="all, delete-orphan"
    )


class Completion(Base):
    __tablename__ = "completions"

    id: Mapped[int] = mapped_column(primary_key=True)
    habit_id: Mapped[int] = mapped_column(ForeignKey("habits.id"))
    completed_date: Mapped[str] = mapped_column(String)  # YYYY-MM-DD

    habit: Mapped["Habit"] = relationship(back_populates="completions")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- streak logic -----------------------------------------------------------


def current_streak(completed_dates: set[str]) -> int:
    """Consecutive days with a completion, counting back from today.

    Today not being done yet does not break the streak — we start the count
    from yesterday in that case.
    """
    streak = 0
    day = date.today()
    if day.isoformat() not in completed_dates:
        day -= timedelta(days=1)
    while day.isoformat() in completed_dates:
        streak += 1
        day -= timedelta(days=1)
    return streak


# --- schemas ----------------------------------------------------------------


class HabitCreate(BaseModel):
    name: str
    emoji: str = "✅"


class HabitOut(BaseModel):
    id: int
    name: str
    emoji: str
    completed_today: bool
    streak: int


def to_out(habit: Habit) -> HabitOut:
    dates = {c.completed_date for c in habit.completions}
    return HabitOut(
        id=habit.id,
        name=habit.name,
        emoji=habit.emoji,
        completed_today=date.today().isoformat() in dates,
        streak=current_streak(dates),
    )


# --- app --------------------------------------------------------------------

app = FastAPI(title="TCA Habits")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        if db.scalar(select(Habit).limit(1)) is None:
            db.add_all(
                [
                    Habit(name="Drink water", emoji="💧"),
                    Habit(name="Morning walk", emoji="🚶"),
                    Habit(name="Read to the kids", emoji="📚"),
                ]
            )
            db.commit()


@app.get("/habits", response_model=list[HabitOut])
def list_habits(db: Session = Depends(get_db)) -> list[HabitOut]:
    habits = db.scalars(select(Habit).order_by(Habit.id)).all()
    return [to_out(h) for h in habits]


@app.post("/habits", response_model=HabitOut, status_code=201)
def create_habit(payload: HabitCreate, db: Session = Depends(get_db)) -> HabitOut:
    habit = Habit(name=payload.name, emoji=payload.emoji)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return to_out(habit)


@app.post("/habits/{habit_id}/complete", response_model=HabitOut)
def complete_habit(habit_id: int, db: Session = Depends(get_db)) -> HabitOut:
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    today = date.today().isoformat()
    already = db.scalar(
        select(Completion).where(
            Completion.habit_id == habit_id, Completion.completed_date == today
        )
    )
    if already is None:  # idempotent: only insert once per day
        db.add(Completion(habit_id=habit_id, completed_date=today))
        db.commit()
    db.refresh(habit)
    return to_out(habit)


@app.delete("/habits/{habit_id}/complete", response_model=HabitOut)
def uncomplete_habit(habit_id: int, db: Session = Depends(get_db)) -> HabitOut:
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    today = date.today().isoformat()
    row = db.scalar(
        select(Completion).where(
            Completion.habit_id == habit_id, Completion.completed_date == today
        )
    )
    if row is not None:
        db.delete(row)
        db.commit()
    db.refresh(habit)
    return to_out(habit)
