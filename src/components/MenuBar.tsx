import { Apple, BatteryFull, Moon, Search, SlidersHorizontal, Sun, Wifi } from 'lucide-react';
import { appById } from '../apps/registry';
import { useSystemStore } from '../store/systemStore';
import { useWindowStore } from '../store/windowStore';

const finderMenus = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

function formatClock(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export function MenuBar() {
  const now = useSystemStore((state) => state.now);
  const theme = useSystemStore((state) => state.theme);
  const toggleTheme = useSystemStore((state) => state.toggleTheme);
  const toggleControlCenter = useSystemStore((state) => state.toggleControlCenter);
  const activeAppId = useWindowStore((state) => state.activeAppId);
  const currentAppName = appById.get(activeAppId)?.title ?? 'Finder';
  const ThemeIcon = theme === 'light' ? Moon : Sun;

  return (
    <header className="glass-surface fixed left-0 top-0 z-[10000] flex h-7 w-full items-center justify-between px-3 text-[13px] font-medium">
      <nav className="relative z-10 flex min-w-0 items-center gap-4">
        <Apple size={16} strokeWidth={2.4} aria-hidden="true" />
        <span className="font-semibold">{currentAppName}</span>
        <div className="hidden items-center gap-4 md:flex">
          {finderMenus.map((menu) => (
            <button key={menu} className="rounded px-1 outline-none hover:bg-white/20 focus-visible:bg-white/25" type="button">
              {menu}
            </button>
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex items-center gap-3 text-[var(--text-primary)]">
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-md hover:bg-white/20 focus-visible:bg-white/25"
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
        >
          <ThemeIcon size={15} />
        </button>
        <Wifi size={15} aria-label="WiFi" />
        <BatteryFull size={17} aria-label="Battery" />
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-md hover:bg-white/20 focus-visible:bg-white/25"
          aria-label="Control Center"
          onClick={toggleControlCenter}
        >
          <SlidersHorizontal size={15} />
        </button>
        <Search size={15} aria-label="Spotlight" />
        <time dateTime={now.toISOString()}>{formatClock(now)}</time>
      </div>
    </header>
  );
}
