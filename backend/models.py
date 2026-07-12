import json
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(nullable=False)
    emoji: Mapped[str] = mapped_column(nullable=False)
    category: Mapped[str] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False, default="blue")
    # Stored as a JSON string under the column name "target_days"; exposed as a
    # list[int] via the property below.
    _target_days: Mapped[str] = mapped_column("target_days", Text, nullable=False, default="[0,1,2,3,4,5,6]")
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    completions: Mapped[list["Completion"]] = relationship(
        back_populates="habit", cascade="all, delete-orphan"
    )

    @property
    def target_days(self) -> list[int]:
        return json.loads(self._target_days)

    @target_days.setter
    def target_days(self, value: list[int]) -> None:
        self._target_days = json.dumps(value)


class Completion(Base):
    __tablename__ = "completions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    habit_id: Mapped[int] = mapped_column(ForeignKey("habits.id"), nullable=False)
    completed_date: Mapped[str] = mapped_column(nullable=False)  # YYYY-MM-DD

    habit: Mapped["Habit"] = relationship(back_populates="completions")
