import json
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
    category = Column(String, nullable=False)
    color = Column(String, nullable=False, default="blue")
    _target_days = Column("target_days", Text, nullable=False, default="[0,1,2,3,4,5,6]")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    completions = relationship("Completion", back_populates="habit", cascade="all, delete-orphan")

    @property
    def target_days(self) -> list[int]:
        return json.loads(self._target_days)

    @target_days.setter
    def target_days(self, value: list[int]):
        self._target_days = json.dumps(value)


class Completion(Base):
    __tablename__ = "completions"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    completed_date = Column(String, nullable=False)  # YYYY-MM-DD

    habit = relationship("Habit", back_populates="completions")
