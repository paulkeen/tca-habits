"""Unit tests for the streak/period logic — the edge cases Sections 1 and 2
glossed over: missed-day resets, idempotency, weekday conversion, and the
today-not-yet-done ("time-zone boundary") rule.

These test the pure functions directly, so they're deterministic regardless of
what day the suite runs on.
"""
from datetime import date, timedelta

# conftest.py puts the backend root on sys.path before test modules import.
from main import compute_streak, month_progress, scheduled_weekdays, week_progress

DAILY = [0, 1, 2, 3, 4, 5, 6]


def iso(days_ago: int) -> str:
    return (date.today() - timedelta(days=days_ago)).isoformat()


def test_scheduled_weekday_conversion():
    # API convention 0=Sun..6=Sat -> Python Mon=0..Sun=6.
    assert scheduled_weekdays([0]) == {6}  # Sunday
    assert scheduled_weekdays([1]) == {0}  # Monday
    assert scheduled_weekdays([6]) == {5}  # Saturday
    assert scheduled_weekdays([1, 3, 5]) == {0, 2, 4}  # Mon/Wed/Fri


def test_empty_history_is_zero():
    assert compute_streak([], DAILY) == (0, 0)


def test_three_in_a_row():
    current, longest = compute_streak([iso(0), iso(1), iso(2)], DAILY)
    assert current == 3
    assert longest == 3


def test_today_not_done_does_not_break_streak():
    # The boundary rule: a day still in progress must not zero the streak.
    # Run ends yesterday, so current == 2 even though today isn't ticked.
    current, _ = compute_streak([iso(1), iso(2)], DAILY)
    assert current == 2


def test_missed_day_resets():
    # 3 days ago + 2 days ago done, yesterday missed, today done -> current 1.
    current, longest = compute_streak([iso(3), iso(2), iso(0)], DAILY)
    assert current == 1
    assert longest == 2  # the earlier 2-day run is the longest


def test_completion_set_is_idempotent_at_logic_level():
    # Duplicate dates in the input must not inflate the streak — compute_streak
    # dedupes via a set. (The API also guards inserts; this is the logic floor.)
    current, _ = compute_streak([iso(0), iso(0), iso(1), iso(1)], DAILY)
    assert current == 2


def test_future_date_does_not_extend_streak():
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    current, _ = compute_streak([tomorrow, iso(0)], DAILY)
    assert current == 1  # today counts; the future date is ignored for "current"


def test_week_progress_counts_due_and_completed():
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    dates = {monday.isoformat()}  # only Monday done
    completed, due = week_progress(dates, DAILY, today)
    assert due == today.weekday() + 1  # Monday..today inclusive
    assert completed == 1


def test_month_progress_counts_from_first_of_month():
    today = date.today()
    completed, due = month_progress({today.isoformat()}, DAILY, today)
    assert due == today.day  # 1st..today inclusive for a daily habit
    assert completed == 1
