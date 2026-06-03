import { useState, useEffect, useCallback } from 'react';
import type { Habit, View, HabitCreate, HabitUpdate } from './types';
import { api } from './api';
import { watchSystemTheme } from './lib/theme';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HabitTile } from './components/HabitTile';
import { AddHabitModal } from './components/AddHabitModal';
import { HabitDetailModal } from './components/HabitDetailModal';
import { StatsView } from './components/StatsView';

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Local guess applied instantly on tap; reconciled with the server response. */
function optimisticToggle(h: Habit, nowDone: boolean): Habit {
  const delta = nowDone ? 1 : -1;
  return {
    ...h,
    completed_today: nowDone,
    current_streak: Math.max(0, h.current_streak + delta),
    total_completions: Math.max(0, h.total_completions + delta),
    week_completed: clamp(h.week_completed + delta, 0, h.week_due),
  };
}

export default function App() {
  const [view, setView] = useState<View>('today');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [detailHabit, setDetailHabit] = useState<Habit | undefined>(undefined);

  useEffect(() => watchSystemTheme(), []);

  const fetchHabits = useCallback(async () => {
    setError('');
    try {
      setHabits(await api.getHabits());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleToggle = useCallback(async (id: number, completed: boolean) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? optimisticToggle(h, !completed) : h)));
    try {
      const updated = completed ? await api.uncompleteHabit(id) : await api.completeHabit(id);
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update habit');
      fetchHabits(); // revert to server truth
    }
  }, [fetchHabits]);

  const handleCreate = useCallback(async (data: HabitCreate) => {
    const created = await api.createHabit(data);
    setHabits((prev) => [...prev, created]);
  }, []);

  const handleUpdate = useCallback(async (id: number, data: HabitUpdate) => {
    const updated = await api.updateHabit(id, data);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this habit and all its history?')) return;
    setDetailHabit(undefined);
    try {
      await api.deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete habit');
    }
  }, []);

  const openAdd = () => {
    setEditingHabit(undefined);
    setShowAddModal(true);
  };
  const openEdit = (habit: Habit) => {
    setDetailHabit(undefined);
    setEditingHabit(habit);
    setShowAddModal(true);
  };

  const dueHabits = habits.filter((h) => h.is_due_today);
  const notDueHabits = habits.filter((h) => !h.is_due_today);
  const completedToday = dueHabits.filter((h) => h.completed_today).length;
  const allDone = dueHabits.length > 0 && completedToday === dueHabits.length;

  const gridCls = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header view={view} onViewChange={setView} onAddClick={openAdd} />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-5 sm:px-6 sm:pb-10">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto opacity-60 hover:opacity-100" aria-label="Dismiss error">✕</button>
          </div>
        )}

        {loading ? (
          <div className={gridCls}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-[var(--radius-tile)] bg-surface" />
            ))}
          </div>
        ) : view === 'today' ? (
          <div className="animate-fade-in">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted">
                  {dueHabits.length > 0 ? `${completedToday} of ${dueHabits.length} done today` : 'Nothing scheduled today'}
                </p>
                {allDone && <span className="text-sm font-semibold text-green-500">Perfect day! 🎉</span>}
              </div>
              {dueHabits.length > 0 && (
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(completedToday / dueHabits.length) * 100}%`, backgroundColor: allDone ? '#34c759' : 'var(--color-accent)' }}
                  />
                </div>
              )}
            </div>

            {dueHabits.length > 0 && (
              <div className={`${gridCls} mb-8`}>
                {dueHabits.map((h) => (
                  <HabitTile key={h.id} habit={h} onToggle={handleToggle} onOpenDetail={setDetailHabit} />
                ))}
              </div>
            )}

            {notDueHabits.length > 0 && (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Not scheduled today</p>
                <div className={gridCls}>
                  {notDueHabits.map((h) => (
                    <HabitTile key={h.id} habit={h} onToggle={handleToggle} onOpenDetail={setDetailHabit} />
                  ))}
                </div>
              </>
            )}

            {habits.length === 0 && <EmptyState onAdd={openAdd} />}
          </div>
        ) : view === 'all' ? (
          <div className="animate-fade-in">
            {habits.length === 0 ? (
              <EmptyState onAdd={openAdd} />
            ) : (
              <div className={gridCls}>
                {habits.map((h) => (
                  <HabitTile key={h.id} habit={h} onToggle={handleToggle} onOpenDetail={setDetailHabit} dim={false} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <StatsView habits={habits} />
        )}
      </main>

      <BottomNav view={view} onViewChange={setView} onAddClick={openAdd} />

      {showAddModal && (
        <AddHabitModal
          onClose={() => {
            setShowAddModal(false);
            setEditingHabit(undefined);
          }}
          onSave={handleCreate}
          editingHabit={editingHabit}
          onUpdate={handleUpdate}
        />
      )}

      {detailHabit && (
        <HabitDetailModal habit={detailHabit} onClose={() => setDetailHabit(undefined)} onEdit={openEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="mb-4 text-5xl">🌱</div>
      <p className="mb-5 text-sm text-muted">No habits yet. Plant your first one.</p>
      <button onClick={onAdd} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
        Add a habit
      </button>
    </div>
  );
}
