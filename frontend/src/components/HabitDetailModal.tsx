import { useEffect, useState } from 'react';
import type { Habit, DayHistory } from '../types';
import { habitColor } from '../lib/colors';
import { api } from '../api';
import { Modal } from './Modal';

interface HabitDetailModalProps {
  habit: Habit;
  onClose: () => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: number) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function Heatmap({ history, color }: { history: DayHistory[]; color: string }) {
  if (history.length === 0) return null;
  // Pad the front so cells flow into weekday-aligned rows (Sunday on top).
  const lead = new Date(`${history[0].date}T00:00:00`).getDay();
  const cells: (DayHistory | null)[] = [...Array(lead).fill(null), ...history];

  return (
    <div className="flex gap-2">
      <div className="grid grid-rows-7 gap-1 pr-0.5 text-[9px] text-muted">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="flex h-3.5 items-center leading-none">{d}</span>
        ))}
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {cells.map((cell, i) =>
          cell === null ? (
            <span key={`pad-${i}`} className="h-3.5 w-3.5" />
          ) : (
            <span
              key={cell.date}
              title={`${cell.date}${cell.completed ? ' · done' : ''}`}
              className="h-3.5 w-3.5 rounded-[3px]"
              style={{ backgroundColor: cell.completed ? color : 'var(--color-surface-2)' }}
            />
          ),
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-3 py-2.5">
      <div className="text-lg font-bold tabular-nums text-text">{value}</div>
      <div className="text-[11px] leading-tight text-muted">{label}</div>
    </div>
  );
}

export function HabitDetailModal({ habit, onClose, onEdit, onDelete }: HabitDetailModalProps) {
  const [history, setHistory] = useState<DayHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { base } = habitColor(habit.color);

  useEffect(() => {
    let active = true;
    api
      .getHistory(habit.id)
      .then((h) => active && setHistory(h))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [habit.id]);

  const scheduleLabel = habit.target_days.length === 7 ? 'Every day' : `${habit.target_days.length}× per week`;

  return (
    <Modal title="" onClose={onClose}>
      <div className="-mt-2 space-y-5">
        {/* Identity */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `color-mix(in srgb, ${base} 16%, var(--color-surface-2))` }}
          >
            {habit.emoji}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-text">{habit.name}</h2>
            <p className="text-sm capitalize text-muted">
              {habit.category} · {scheduleLabel}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Current streak" value={habit.current_streak} />
          <Stat label="Longest streak" value={habit.longest_streak} />
          <Stat label="Total done" value={habit.total_completions} />
        </div>

        {/* Heatmap */}
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted">Last 30 days</p>
          {loading ? (
            <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
          ) : (
            <Heatmap history={history} color={base} />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(habit)}
            className="flex-1 rounded-xl bg-surface-2 py-2.5 text-sm font-semibold text-text transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
