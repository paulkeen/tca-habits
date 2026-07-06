import { useState, useCallback } from 'react';
import type { Category, HabitCreate, HabitUpdate, Habit } from '../types';
import { COLOR_KEYS, habitColor, type ColorKey } from '../lib/colors';
import { Modal } from './Modal';

interface AddHabitModalProps {
  onClose: () => void;
  onSave: (data: HabitCreate) => Promise<void>;
  editingHabit?: Habit;
  onUpdate?: (id: number, data: HabitUpdate) => Promise<void>;
}

const CATEGORIES: Category[] = ['family', 'fitness', 'hobby', 'personal'];
const CATEGORY_LABELS: Record<Category, string> = {
  family: '👨‍👩‍👧 Family',
  fitness: '💪 Fitness',
  hobby: '🎨 Hobby',
  personal: '🧠 Personal',
};

// Sunday-first, matching the backend's 0=Sun..6=Sat target_days encoding.
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SUGGESTED_EMOJIS = ['🏃', '🧘', '📖', '🎸', '🥗', '💊', '🛁', '🧹', '🚴', '✍️', '🎮', '🍎', '☕', '🐶', '🌿'];

export function AddHabitModal({ onClose, onSave, editingHabit, onUpdate }: AddHabitModalProps) {
  const [name, setName] = useState(editingHabit?.name ?? '');
  const [emoji, setEmoji] = useState(editingHabit?.emoji ?? '✅');
  const [category, setCategory] = useState<Category>(editingHabit?.category ?? 'personal');
  const [color, setColor] = useState<ColorKey>(editingHabit?.color ?? 'blue');
  const [targetDays, setTargetDays] = useState<number[]>(editingHabit?.target_days ?? [0, 1, 2, 3, 4, 5, 6]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleDay = useCallback((d: number) => {
    setTargetDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)));
  }, []);

  const accent = habitColor(color).base;

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return setError('Please enter a habit name.');
    if (targetDays.length === 0) return setError('Select at least one day.');
    setSaving(true);
    setError('');
    try {
      const payload = { name: name.trim(), emoji, category, color, target_days: targetDays };
      if (editingHabit && onUpdate) await onUpdate(editingHabit.id, payload);
      else await onSave(payload);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }, [name, emoji, category, color, targetDays, editingHabit, onUpdate, onSave, onClose]);

  const labelCls = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-muted';
  const fieldCls = 'w-full rounded-xl bg-surface-2 px-4 py-3 text-text placeholder-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent';

  return (
    <Modal title={editingHabit ? 'Edit Habit' : 'New Habit'} onClose={onClose}>
      <div className="space-y-5">
        {/* Icon */}
        <div>
          <label className={labelCls}>Icon</label>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundColor: `color-mix(in srgb, ${accent} 16%, var(--color-surface-2))` }}
            >
              {emoji}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-lg p-1 text-xl transition-all hover:bg-surface-2 ${emoji === e ? 'ring-2 ring-accent' : ''}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={labelCls}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning run" className={fieldCls} autoFocus />
        </div>

        {/* Color */}
        <div>
          <label className={labelCls}>Color</label>
          <div className="flex flex-wrap gap-2.5">
            {COLOR_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setColor(key)}
                aria-label={habitColor(key).label}
                aria-pressed={color === key}
                className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: habitColor(key).base,
                  boxShadow: color === key ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${habitColor(key).base}` : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-xl bg-surface-2 px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  category === cat ? 'text-text ring-2 ring-accent' : 'text-muted hover:text-text'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className={labelCls}>Schedule</label>
          <div className="flex gap-1.5">
            {DAYS.map((day, i) => {
              const active = targetDays.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  aria-label={day}
                  aria-pressed={active}
                  className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: active ? accent : 'var(--color-surface-2)',
                    color: active ? habitColor(color).on : 'var(--color-muted)',
                  }}
                >
                  {day[0]}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accent, color: habitColor(color).on }}
        >
          {saving ? 'Saving…' : editingHabit ? 'Save Changes' : 'Add Habit'}
        </button>
      </div>
    </Modal>
  );
}
