export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** The theme currently applied to <html> (set pre-paint by index.html). */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Whether the user has explicitly chosen a theme (vs. following the OS). */
export function hasExplicitTheme(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  apply(theme);
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/** Keep following the OS while the user hasn't picked a theme themselves. */
export function watchSystemTheme() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    if (!hasExplicitTheme()) apply(e.matches ? 'dark' : 'light');
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
