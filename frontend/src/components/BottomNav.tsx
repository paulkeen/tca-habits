import type { View } from '../types';

interface BottomNavProps {
  view: View;
  onViewChange: (v: View) => void;
  onAddClick: () => void;
}

const ICONS: Record<View, React.ReactNode> = {
  today: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  ),
  all: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  stats: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
};

const ITEMS: { id: View; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'all', label: 'Habits' },
  { id: 'stats', label: 'Stats' },
];

export function BottomNav({ view, onViewChange, onAddClick }: BottomNavProps) {
  return (
    <nav
      className="pb-safe fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-edge bg-bg/85 px-2 pt-1.5 backdrop-blur-xl sm:hidden"
      aria-label="Views"
    >
      {ITEMS.slice(0, 2).map((item) => (
        <NavButton key={item.id} item={item} view={view} onViewChange={onViewChange} />
      ))}

      <button
        onClick={onAddClick}
        aria-label="Add habit"
        className="-mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform active:scale-90"
      >
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>

      {ITEMS.slice(2).map((item) => (
        <NavButton key={item.id} item={item} view={view} onViewChange={onViewChange} />
      ))}
    </nav>
  );
}

function NavButton({
  item,
  view,
  onViewChange,
}: {
  item: { id: View; label: string };
  view: View;
  onViewChange: (v: View) => void;
}) {
  const active = view === item.id;
  return (
    <button
      onClick={() => onViewChange(item.id)}
      aria-current={active ? 'page' : undefined}
      className={`flex w-16 flex-col items-center gap-0.5 rounded-lg py-1 text-[10px] font-medium transition-colors ${
        active ? 'text-accent' : 'text-muted'
      }`}
    >
      {ICONS[item.id]}
      {item.label}
    </button>
  );
}
