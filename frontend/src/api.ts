import type {
  Habit,
  Stats,
  DayHistory,
  CalendarDay,
  HabitCreate,
  HabitUpdate,
  WeeklySummary,
  Encouragement,
} from './types';

const BASE = '/habits';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getHabits: () => request<Habit[]>(BASE),

  createHabit: (data: HabitCreate) =>
    request<Habit>(BASE, { method: 'POST', body: JSON.stringify(data) }),

  updateHabit: (id: number, data: HabitUpdate) =>
    request<Habit>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteHabit: (id: number) =>
    request<void>(`${BASE}/${id}`, { method: 'DELETE' }),

  completeHabit: (id: number) =>
    request<Habit>(`${BASE}/${id}/complete`, { method: 'POST' }),

  uncompleteHabit: (id: number) =>
    request<Habit>(`${BASE}/${id}/complete`, { method: 'DELETE' }),

  getHistory: (id: number) =>
    request<DayHistory[]>(`${BASE}/${id}/history`),

  getStats: () => request<Stats>('/stats'),

  getCalendar: (days = 30) =>
    request<CalendarDay[]>(`/stats/calendar?days=${days}`),

  getWeeklySummary: () => request<WeeklySummary>('/stats/weekly-summary'),

  getEncouragement: () => request<Encouragement>('/encouragement'),
};
