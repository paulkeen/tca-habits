import { useState, useCallback } from 'react';
import type { Habit } from '../types';
import { habitColor } from '../lib/colors';
import { ProgressRing } from './ProgressRing';

interface HabitTileProps {
  habit: Habit;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onOpenDetail: (habit: Habit) => void;
  /** Fade tiles not scheduled today (used on the Today view, not the full list). */
  dim?: boolean;
}

export function HabitTile({ habit, onToggle, onOpenDetail, dim = true }: HabitTileProps) {
  const [popping, setPopping] = useState(false);
  const { base, on } = habitColor(habit.color);

  const done = habit.completed_today;
  const dimmed = dim && !habit.is_due_today;
  const onFire = habit.current_streak >= 7;
  const weekRatio = habit.week_due > 0 ? habit.week_completed / habit.week_due : 0;

  const handleToggle = useCallback(async () => {
    setPopping(true);
    setTimeout(() => setPopping(false), 320);
    await onToggle(habit.id, habit.completed_today);
  }, [habit.id, habit.completed_today, onToggle]);

  // Idle tiles get a soft tint of their color over the surface; completed tiles
  // fill solid with the color. Border fades out when filled.
  const background = done ? base : `color-mix(in srgb, ${base} 9%, var(--color-surface))`;
  const borderColor = done ? 'transparent' : `color-mix(in srgb, ${base} 24%, var(--color-edge))`;
  const fg = done ? on : 'var(--color-text)';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={done}
        aria-label={`${habit.name}, ${done ? 'completed today' : 'not completed today'}, ${habit.current_streak} day streak`}
        className={`flex aspect-square w-full flex-col justify-between overflow-hidden rounded-[var(--radius-tile)] border p-4 text-left transition-[transform,box-shadow,background-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97] ${
          dimmed ? 'opacity-45' : 'opacity-100'
        } ${popping ? 'animate-pop' : ''} ${done ? 'shadow-lg' : 'hover:-translate-y-0.5'}`}
        style={{ backgroundColor: background, borderColor, color: fg, boxShadow: done ? `0 8px 24px -8px ${base}` : undefined }}
      >
        {/* Top row: emoji + (ring | check) */}
        <div className="flex items-start justify-between">
          <span className="text-4xl leading-none select-none">{habit.emoji}</span>
          {done ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path d="M2 7.4 5.2 10.5 12 3.5" stroke={on} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <ProgressRing ratio={weekRatio} size={34} stroke={3.5} color={base}>
              <span className="text-[10px] font-semibold tabular-nums" style={{ color: base }}>
                {habit.week_completed}/{habit.week_due || 0}
              </span>
            </ProgressRing>
          )}
        </div>

        {/* Bottom: name + streak */}
        <div>
          <p className="line-clamp-2 pr-6 text-sm font-semibold leading-tight" style={{ color: fg }}>
            {habit.name}
          </p>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums" style={{ color: done ? on : onFire ? '#fb8c2a' : base }}>
              {habit.current_streak}
            </span>
            <span className="text-xs" style={{ color: fg, opacity: 0.65 }}>
              {habit.current_streak === 1 ? 'day' : 'days'}
            </span>
            {onFire && <span className="text-sm leading-none">🔥</span>}
          </div>
        </div>
      </button>

      {/* Detail affordance — sibling overlay so it never toggles completion */}
      <button
        type="button"
        onClick={() => onOpenDetail(habit)}
        aria-label={`View ${habit.name} details and history`}
        className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full opacity-55 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ color: fg }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      </button>
    </div>
  );
}
