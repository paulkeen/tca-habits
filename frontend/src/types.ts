import type { ColorKey } from './lib/colors';

export type Category = 'family' | 'fitness' | 'hobby' | 'personal';

export interface Habit {
  id: number;
  name: string;
  emoji: string;
  category: Category;
  color: ColorKey;
  target_days: number[];
  created_at: string;
  completed_today: boolean;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  is_due_today: boolean;
  week_completed: number;
  week_due: number;
}

export interface DayHistory {
  date: string;
  completed: boolean;
}

export interface CalendarDay {
  date: string;
  completed: number;
  due: number;
}

export interface Stats {
  total_completions: number;
  active_streaks: number;
  perfect_days_this_week: number;
  longest_streak_ever: number;
}

export interface WeeklySummary {
  summary: string;
  source: 'model' | 'template';
}

export interface Encouragement {
  message: string;
  habit_id: number | null;
  source: 'model' | 'template';
}

export interface HabitCreate {
  name: string;
  emoji: string;
  category: Category;
  color: ColorKey;
  target_days: number[];
}

export interface HabitUpdate {
  name?: string;
  emoji?: string;
  category?: Category;
  color?: ColorKey;
  target_days?: number[];
}

export type View = 'today' | 'all' | 'stats';
