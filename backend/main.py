from contextlib import asynccontextmanager
from datetime import date, timedelta
from typing import TypedDict

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import ai
import models
import schemas
from database import Base, engine, get_db, run_migrations

Base.metadata.create_all(bind=engine)
run_migrations()


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    seed_if_empty(db)
    db.close()
    yield


app = FastAPI(title="TCA Habits API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SeedHabit(TypedDict):
    name: str
    emoji: str
    category: str
    color: str
    target_days: list[int]


SEED_HABITS: list[SeedHabit] = [
    {"name": "Bath time routine", "emoji": "🛁", "category": "family", "color": "teal", "target_days": [0, 1, 2, 3, 4, 5, 6]},
    {"name": "Bedtime story", "emoji": "📖", "category": "family", "color": "indigo", "target_days": [0, 1, 2, 3, 4, 5, 6]},
    {"name": "Morning run", "emoji": "🏃", "category": "fitness", "color": "orange", "target_days": [1, 2, 3, 4, 5]},
    {"name": "Meditation", "emoji": "🧘", "category": "personal", "color": "purple", "target_days": [0, 1, 2, 3, 4, 5, 6]},
    {"name": "Guitar practice", "emoji": "🎸", "category": "hobby", "color": "amber", "target_days": [1, 3, 5]},
    {"name": "Healthy lunch", "emoji": "🥗", "category": "fitness", "color": "green", "target_days": [1, 2, 3, 4, 5]},
]


def seed_if_empty(db: Session):
    if db.query(models.Habit).count() == 0:
        for h in SEED_HABITS:
            habit = models.Habit(
                name=h["name"],
                emoji=h["emoji"],
                category=h["category"],
                color=h["color"],
            )
            habit.target_days = h["target_days"]
            db.add(habit)
        db.commit()


def scheduled_weekdays(target_days: list[int]) -> set[int]:
    """Convert stored target days (0=Sun..6=Sat) to Python weekdays (Mon=0..Sun=6)."""
    return {(t - 1) % 7 for t in target_days}


def compute_streak(completion_dates: list[str], target_days: list[int]) -> tuple[int, int]:
    """Return (current_streak, longest_streak), counting only scheduled days."""
    completed_set = set(completion_dates)
    if not completed_set:
        return 0, 0

    weekdays = scheduled_weekdays(target_days)
    today = date.today()

    def is_due(d: date) -> bool:
        return d.weekday() in weekdays

    # Walk backwards from today over scheduled days. Today not being done yet
    # does not break the streak (the day is still in progress), so start from
    # yesterday in that case.
    current_streak = 0
    cursor = today
    if is_due(today) and today.isoformat() not in completed_set:
        cursor = today - timedelta(days=1)

    floor = today - timedelta(days=365)
    while cursor >= floor:
        if not is_due(cursor):
            cursor -= timedelta(days=1)
            continue
        if cursor.isoformat() in completed_set:
            current_streak += 1
            cursor -= timedelta(days=1)
        else:
            break

    # Longest streak: scan scheduled days across the whole recorded range.
    sorted_dates = sorted(completed_set)
    first = date.fromisoformat(sorted_dates[0])
    last = date.fromisoformat(sorted_dates[-1])

    longest = 0
    run = 0
    d = first
    while d <= last:
        if is_due(d):
            if d.isoformat() in completed_set:
                run += 1
                longest = max(longest, run)
            else:
                run = 0
        d += timedelta(days=1)

    return current_streak, max(longest, current_streak)


def week_progress(completion_set: set[str], target_days: list[int], today: date) -> tuple[int, int]:
    """Completed vs. due scheduled days from Monday through today (inclusive)."""
    weekdays = scheduled_weekdays(target_days)
    week_start = today - timedelta(days=today.weekday())
    completed = 0
    due = 0
    d = week_start
    while d <= today:
        if d.weekday() in weekdays:
            due += 1
            if d.isoformat() in completion_set:
                completed += 1
        d += timedelta(days=1)
    return completed, due


def month_progress(completion_set: set[str], target_days: list[int], today: date) -> tuple[int, int]:
    """Completed vs. due scheduled days from the 1st of the month through today."""
    weekdays = scheduled_weekdays(target_days)
    completed = 0
    due = 0
    d = today.replace(day=1)
    while d <= today:
        if d.weekday() in weekdays:
            due += 1
            if d.isoformat() in completion_set:
                completed += 1
        d += timedelta(days=1)
    return completed, due


def enrich_habit(habit: models.Habit, today: date) -> schemas.HabitOut:
    today_str = today.isoformat()
    completion_dates = [c.completed_date for c in habit.completions]
    completion_set = set(completion_dates)

    current_streak, longest_streak = compute_streak(completion_dates, habit.target_days)
    week_completed, week_due = week_progress(completion_set, habit.target_days, today)

    return schemas.HabitOut(
        id=habit.id,
        name=habit.name,
        emoji=habit.emoji,
        category=habit.category,
        color=habit.color,
        target_days=habit.target_days,
        created_at=habit.created_at,
        completed_today=today_str in completion_set,
        current_streak=current_streak,
        longest_streak=longest_streak,
        total_completions=len(completion_dates),
        is_due_today=today.weekday() in scheduled_weekdays(habit.target_days),
        week_completed=week_completed,
        week_due=week_due,
    )


def get_habit_or_404(habit_id: int, db: Session) -> models.Habit:
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail=f"Habit {habit_id} not found")
    return habit


@app.get("/habits", response_model=list[schemas.HabitOut])
def get_habits(db: Session = Depends(get_db)):
    today = date.today()
    return [enrich_habit(h, today) for h in db.query(models.Habit).all()]


@app.post("/habits", response_model=schemas.HabitOut, status_code=201)
def create_habit(payload: schemas.HabitCreate, db: Session = Depends(get_db)):
    habit = models.Habit(
        name=payload.name,
        emoji=payload.emoji,
        category=payload.category,
        color=payload.color,
    )
    habit.target_days = payload.target_days
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return enrich_habit(habit, date.today())


@app.patch("/habits/{habit_id}", response_model=schemas.HabitOut)
def update_habit(habit_id: int, payload: schemas.HabitUpdate, db: Session = Depends(get_db)):
    habit = get_habit_or_404(habit_id, db)
    if payload.name is not None:
        habit.name = payload.name
    if payload.emoji is not None:
        habit.emoji = payload.emoji
    if payload.category is not None:
        habit.category = payload.category
    if payload.color is not None:
        habit.color = payload.color
    if payload.target_days is not None:
        habit.target_days = payload.target_days
    db.commit()
    db.refresh(habit)
    return enrich_habit(habit, date.today())


@app.delete("/habits/{habit_id}", status_code=204)
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = get_habit_or_404(habit_id, db)
    db.delete(habit)
    db.commit()


@app.post("/habits/{habit_id}/complete", response_model=schemas.HabitOut)
def complete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = get_habit_or_404(habit_id, db)
    today_str = date.today().isoformat()
    existing = (
        db.query(models.Completion)
        .filter(models.Completion.habit_id == habit_id, models.Completion.completed_date == today_str)
        .first()
    )
    if not existing:
        db.add(models.Completion(habit_id=habit_id, completed_date=today_str))
        db.commit()
        db.refresh(habit)
    return enrich_habit(habit, date.today())


@app.delete("/habits/{habit_id}/complete", response_model=schemas.HabitOut)
def uncomplete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = get_habit_or_404(habit_id, db)
    today_str = date.today().isoformat()
    existing = (
        db.query(models.Completion)
        .filter(models.Completion.habit_id == habit_id, models.Completion.completed_date == today_str)
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
        db.refresh(habit)
    return enrich_habit(habit, date.today())


@app.get("/habits/{habit_id}/history", response_model=list[schemas.DayHistory])
def get_history(habit_id: int, db: Session = Depends(get_db)):
    habit = get_habit_or_404(habit_id, db)
    completed_set = {c.completed_date for c in habit.completions}
    today = date.today()
    return [
        schemas.DayHistory(
            date=(today - timedelta(days=i)).isoformat(),
            completed=(today - timedelta(days=i)).isoformat() in completed_set,
        )
        for i in range(29, -1, -1)
    ]


@app.get("/habits/{habit_id}/monthly", response_model=schemas.MonthlyProgressOut)
def get_monthly_progress(habit_id: int, db: Session = Depends(get_db)):
    """This calendar month's completed-vs-due for one habit, for the progress ring."""
    habit = get_habit_or_404(habit_id, db)
    today = date.today()
    completion_set = {c.completed_date for c in habit.completions}
    completed, due = month_progress(completion_set, habit.target_days, today)
    percent = round(100 * completed / due) if due else 0
    return schemas.MonthlyProgressOut(
        month=today.strftime("%Y-%m"),
        completed=completed,
        due=due,
        percent=percent,
    )


@app.get("/stats", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db)):
    habits = db.query(models.Habit).all()
    today = date.today()

    total_completions = db.query(models.Completion).count()

    active_streaks = 0
    longest_streak_ever = 0
    for habit in habits:
        completion_dates = [c.completed_date for c in habit.completions]
        current, longest = compute_streak(completion_dates, habit.target_days)
        if current > 0:
            active_streaks += 1
        longest_streak_ever = max(longest_streak_ever, longest)

    # Perfect days this week: every habit due that day was completed.
    week_start = today - timedelta(days=today.weekday())  # Monday
    perfect_days = 0
    for offset in range(7):
        day = week_start + timedelta(days=offset)
        if day > today:
            break
        day_str = day.isoformat()
        due_habits = [h for h in habits if day.weekday() in scheduled_weekdays(h.target_days)]
        if not due_habits:
            continue
        if all(any(c.completed_date == day_str for c in h.completions) for h in due_habits):
            perfect_days += 1

    return schemas.StatsOut(
        total_completions=total_completions,
        active_streaks=active_streaks,
        perfect_days_this_week=perfect_days,
        longest_streak_ever=longest_streak_ever,
    )


@app.get("/stats/calendar", response_model=list[schemas.CalendarDay])
def get_calendar(days: int = Query(30, ge=1, le=365), db: Session = Depends(get_db)):
    """Per-day completed-vs-due totals across all habits, oldest to newest.

    `due` = number of habits scheduled that day; `completed` = how many of
    those were marked done. Powers the weekly bar chart and the heatmap with
    real history instead of estimates.
    """
    habits = db.query(models.Habit).all()
    today = date.today()

    # Map each habit to its completion dates once, then walk the window.
    completions_by_habit = {h.id: {c.completed_date for c in h.completions} for h in habits}
    weekdays_by_habit = {h.id: scheduled_weekdays(h.target_days) for h in habits}

    result: list[schemas.CalendarDay] = []
    for i in range(days - 1, -1, -1):
        day = today - timedelta(days=i)
        day_str = day.isoformat()
        due = 0
        completed = 0
        for h in habits:
            if day.weekday() in weekdays_by_habit[h.id]:
                due += 1
                if day_str in completions_by_habit[h.id]:
                    completed += 1
        result.append(schemas.CalendarDay(date=day_str, completed=completed, due=due))
    return result


# --- AI-flavoured features (Section 2) ---------------------------------------
#
# Both endpoints compute a deterministic summary of real data, then let ai.py
# decide whether to hand the numbers to Claude for a friendlier rewrite. The
# fallback text is always correct on its own; the model just makes it warmer.

SUMMARY_SYSTEM = (
    "You write a single short, warm paragraph (2-3 sentences) reflecting on "
    "someone's habit-tracking week. Encouraging, specific, never preachy. "
    "Return only the paragraph, no preamble."
)

ENCOURAGEMENT_SYSTEM = (
    "You write one short, warm sentence nudging someone to keep a habit streak "
    "alive before the day ends. Specific and kind, never guilt-trippy. "
    "Return only the sentence."
)


@app.get("/stats/weekly-summary", response_model=schemas.WeeklySummaryOut)
def get_weekly_summary(db: Session = Depends(get_db)):
    habits = db.query(models.Habit).all()
    today = date.today()

    total_completed = 0
    total_due = 0
    best_habit = None
    best_streak = 0
    for habit in habits:
        completion_set = {c.completed_date for c in habit.completions}
        completed, due = week_progress(completion_set, habit.target_days, today)
        total_completed += completed
        total_due += due
        current, _ = compute_streak(list(completion_set), habit.target_days)
        if current > best_streak:
            best_streak, best_habit = current, habit

    rate = round(100 * total_completed / total_due) if total_due else 0

    if not habits:
        fallback = "No habits yet. Add one you actually want to build and tick it off today to get started."
    else:
        parts = [f"This week you've completed {total_completed} of {total_due} scheduled habits ({rate}%)."]
        if best_habit is not None and best_streak > 0:
            plural = "s" if best_streak != 1 else ""
            parts.append(
                f"Your strongest run right now is {best_habit.emoji} {best_habit.name} "
                f"at {best_streak} day{plural}."
            )
        parts.append(
            "Keep going and the chains only get longer."
            if rate >= 50
            else "A fresh tick today is the easiest way to build momentum."
        )
        fallback = " ".join(parts)

    streak_line = (
        f"Longest current streak: {best_habit.name} at {best_streak} days. "
        if best_habit is not None and best_streak > 0
        else "No active streaks yet. "
    )
    prompt = (
        f"Habit tracker weekly stats: {total_completed} of {total_due} scheduled "
        f"completions this week ({rate}%). " + streak_line + "Write the reflection paragraph."
    )
    summary, source = ai.generate(SUMMARY_SYSTEM, prompt, fallback)
    return schemas.WeeklySummaryOut(summary=summary, source=source)


@app.get("/encouragement", response_model=schemas.EncouragementOut)
def get_encouragement(db: Session = Depends(get_db)):
    """A supportive nudge about the most at-risk streak (due today, not yet done)."""
    habits = db.query(models.Habit).all()
    today = date.today()
    today_str = today.isoformat()

    at_risk = None
    at_risk_streak = 0
    for habit in habits:
        if today.weekday() not in scheduled_weekdays(habit.target_days):
            continue
        completion_set = {c.completed_date for c in habit.completions}
        if today_str in completion_set:
            continue  # already done today, streak is safe
        current, _ = compute_streak(list(completion_set), habit.target_days)
        if current > at_risk_streak:
            at_risk_streak, at_risk = current, habit

    if at_risk is None:
        fallback = "Everything due today is done, or your streaks are safe. Nice work."
        message, source = ai.generate(
            ENCOURAGEMENT_SYSTEM,
            "The user has no at-risk streaks today. Write a brief, upbeat well-done sentence.",
            fallback,
        )
        return schemas.EncouragementOut(message=message, habit_id=None, source=source)

    fallback = (
        f"Your {at_risk_streak}-day {at_risk.name} streak is still open today, "
        f"tick {at_risk.emoji} off before midnight to keep it alive."
    )
    prompt = (
        f"The habit '{at_risk.name}' ({at_risk.emoji}) has a {at_risk_streak}-day streak "
        "that is due today and not yet completed. Write the nudge."
    )
    message, source = ai.generate(ENCOURAGEMENT_SYSTEM, prompt, fallback)
    return schemas.EncouragementOut(message=message, habit_id=at_risk.id, source=source)
