import type { View } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  view: View;
  onViewChange: (v: View) => void;
  onAddClick: () => void;
}

export const TABS: { id: View; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'all', label: 'Habits' },
  { id: 'stats', label: 'Stats' },
];

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function Header({ view, onViewChange, onAddClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-text">
            TCA Habits <span className="text-accent">✦</span>
          </h1>
          <p className="truncate text-xs text-muted">{formatDate(new Date())}</p>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden items-center gap-1 rounded-full bg-surface p-1 sm:flex" aria-label="Views">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              aria-current={view === tab.id ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                view === tab.id ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddClick}
            className="hidden h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-white transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
            New
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
