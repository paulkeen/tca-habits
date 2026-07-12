from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator

VALID_CATEGORIES = {"family", "fitness", "hobby", "personal"}

# Curated, Streaks-style palette. The frontend owns the actual color values;
# the backend just stores and validates the key.
VALID_COLORS = {
    "red", "orange", "amber", "green", "teal",
    "blue", "indigo", "purple", "pink",
}


def _validate_category(v: str) -> str:
    if v not in VALID_CATEGORIES:
        raise ValueError(f"category must be one of {sorted(VALID_CATEGORIES)}")
    return v


def _validate_color(v: str) -> str:
    if v not in VALID_COLORS:
        raise ValueError(f"color must be one of {sorted(VALID_COLORS)}")
    return v


def _validate_target_days(v: list[int]) -> list[int]:
    if not v:
        raise ValueError("target_days must not be empty")
    for d in v:
        if d not in range(7):
            raise ValueError("target_days values must be integers 0-6")
    return sorted(set(v))


class HabitCreate(BaseModel):
    name: str
    emoji: str
    category: str
    color: str = "blue"
    target_days: list[int]

    @field_validator("category")
    @classmethod
    def check_category(cls, v: str) -> str:
        return _validate_category(v)

    @field_validator("color")
    @classmethod
    def check_color(cls, v: str) -> str:
        return _validate_color(v)

    @field_validator("target_days")
    @classmethod
    def check_target_days(cls, v: list[int]) -> list[int]:
        return _validate_target_days(v)


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    emoji: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    target_days: Optional[list[int]] = None

    @field_validator("category")
    @classmethod
    def check_category(cls, v: Optional[str]) -> Optional[str]:
        return v if v is None else _validate_category(v)

    @field_validator("color")
    @classmethod
    def check_color(cls, v: Optional[str]) -> Optional[str]:
        return v if v is None else _validate_color(v)

    @field_validator("target_days")
    @classmethod
    def check_target_days(cls, v: Optional[list[int]]) -> Optional[list[int]]:
        return v if v is None else _validate_target_days(v)


class HabitOut(BaseModel):
    id: int
    name: str
    emoji: str
    category: str
    color: str
    target_days: list[int]
    created_at: datetime
    completed_today: bool
    current_streak: int
    longest_streak: int
    total_completions: int
    is_due_today: bool
    week_completed: int
    week_due: int

    model_config = {"from_attributes": True}


class DayHistory(BaseModel):
    date: str
    completed: bool


class CalendarDay(BaseModel):
    date: str
    completed: int
    due: int


class StatsOut(BaseModel):
    total_completions: int
    active_streaks: int
    perfect_days_this_week: int
    longest_streak_ever: int


class MonthlyProgressOut(BaseModel):
    month: str  # "YYYY-MM"
    completed: int
    due: int
    percent: int  # 0-100, completed/due rounded


class WeeklySummaryOut(BaseModel):
    summary: str
    source: str  # "model" if written by Claude, "template" if generated locally


class EncouragementOut(BaseModel):
    message: str
    habit_id: Optional[int] = None  # the at-risk habit the nudge is about, if any
    source: str  # "model" or "template"
