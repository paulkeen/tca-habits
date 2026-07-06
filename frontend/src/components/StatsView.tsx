import { useEffect, useState } from 'react';
import type { Stats, Habit, CalendarDay, WeeklySummary } from '../types';
import { habitColor } from '../lib/colors';
import { api } from '../api';

interface StatsViewProps {
  habits: Habit[];
}

const WEEKDAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function weekdayLetter(dateStr: string): string {
  return WEEKDAY_LETTER[new Date(`${dateStr}T00:00:00`).getDay()];
}

const today = () => new Date().toISOString().slice(0, 10);

export function StatsView({ habits }: StatsViewProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api.getStats(), api.getCalendar(30)])
      .then(([s, c]) => {
        if (!active) return;
        setStats(s);
        setCalendar(c);
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load stats'))
      .finally(() => active && setLoading(false));
    // The weekly summary loads independently — it may hit the network (Claude),
    // so we don't want it to block the numbers from rendering.
    api.getWeeklySummary().then((s) => active && setWeeklySummary(s)).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
        <div className="h-44 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500">{error}</div>;
  }

  const last7 = calendar.slice(-7);
  const t = today();

  const summary = [
    { label: 'Total completions', value: stats?.total_completions ?? 0, icon: '✅' },
    { label: 'Active streaks', value: stats?.active_streaks ?? 0, icon: '🔥' },
    { label: 'Perfect days this week', value: stats?.perfect_days_this_week ?? 0, icon: '⭐' },
    { label: 'Longest streak ever', value: stats?.longest_streak_ever ?? 0, icon: '🏆' },
  ];

  const topStreaks = [...habits].filter((h) => h.current_streak > 0).sort((a, b) => b.current_streak - a.current_streak).slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weekly summary — a human paragraph about the week */}
      {weeklySummary && (
        <section className="rounded-2xl border border-edge bg-surface p-5">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text">Your week</h3>
            {weeklySummary.source === 'model' && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                ✨ AI
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-muted">{weeklySummary.summary}</p>
        </section>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-edge bg-surface p-4">
            <div className="mb-2 text-2xl">{item.icon}</div>
            <div className="text-2xl font-bold tabular-nums text-text">{item.value}</div>
            <div className="mt-0.5 text-xs leading-tight text-muted">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Last 7 days */}
      <section className="rounded-2xl border border-edge bg-surface p-5">
        <h3 className="mb-4 text-sm font-semibold text-text">Last 7 days</h3>
        <div className="flex h-28 items-end gap-2">
          {last7.map((day) => {
            const ratio = day.due > 0 ? day.completed / day.due : 0;
            const isToday = day.date === t;
            const complete = day.due > 0 && day.completed >= day.due;
            const height = day.due === 0 ? 4 : Math.max(6, Math.round(ratio * 88));
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-end justify-center" style={{ height: 88 }}>
                  <div
                    className="w-full max-w-9 rounded-md transition-all duration-500"
                    style={{
                      height,
                      backgroundColor:
                        day.due === 0
                          ? 'var(--color-surface-2)'
                          : complete
                            ? '#34c759'
                            : `color-mix(in srgb, var(--color-accent) ${30 + ratio * 70}%, var(--color-surface-2))`,
                    }}
                  />
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-accent' : 'text-muted'}`}>{weekdayLetter(day.date)}</span>
                {day.due > 0 && (
                  <span className="text-[10px] tabular-nums text-muted">
                    {day.completed}/{day.due}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 30-day heatmap */}
      <section className="rounded-2xl border border-edge bg-surface p-5">
        <h3 className="mb-4 text-sm font-semibold text-text">Last 30 days</h3>
        <div className="grid grid-flow-col grid-rows-7 gap-1.5">
          {(() => {
            const lead = calendar.length ? new Date(`${calendar[0].date}T00:00:00`).getDay() : 0;
            const cells: (CalendarDay | null)[] = [...Array(lead).fill(null), ...calendar];
            return cells.map((cell, i) => {
              if (!cell) return <span key={`pad-${i}`} className="h-4 w-4" />;
              const ratio = cell.due > 0 ? cell.completed / cell.due : 0;
              const bg =
                cell.due === 0
                  ? 'var(--color-surface-2)'
                  : ratio === 0
                    ? 'var(--color-surface-2)'
                    : `color-mix(in srgb, var(--color-accent) ${25 + ratio * 75}%, var(--color-surface-2))`;
              return (
                <span
                  key={cell.date}
                  title={`${cell.date} · ${cell.completed}/${cell.due}`}
                  className="h-4 w-4 rounded-[4px]"
                  style={{ backgroundColor: bg }}
                />
              );
            });
          })()}
        </div>
        <p className="mt-3 text-xs text-muted">Darker squares mean more of that day's scheduled habits were completed.</p>
      </section>

      {/* Top streaks */}
      <section className="rounded-2xl border border-edge bg-surface p-5">
        <h3 className="mb-4 text-sm font-semibold text-text">Top streaks</h3>
        {topStreaks.length === 0 ? (
          <p className="text-sm text-muted">Complete habits to build streaks.</p>
        ) : (
          <div className="space-y-3">
            {topStreaks.map((habit, i) => (
              <div key={habit.id} className="flex items-center gap-3">
                <span className="w-6 flex-shrink-0 text-center text-xl">{medals[i]}</span>
                <span className="flex-shrink-0 text-2xl">{habit.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">{habit.name}</p>
                  <p className="text-xs capitalize text-muted">{habit.category}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <span className="text-xl font-bold tabular-nums" style={{ color: habitColor(habit.color).base }}>
                    {habit.current_streak}
                  </span>
                  {habit.current_streak >= 7 && <span>🔥</span>}
                  <span className="text-xs text-muted">days</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
