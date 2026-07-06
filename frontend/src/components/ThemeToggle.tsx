import { useState } from 'react';
import { currentTheme, toggleTheme, type Theme } from '../lib/theme';

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(currentTheme());

  const handleClick = () => setThemeState(toggleTheme());
  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-surface text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
