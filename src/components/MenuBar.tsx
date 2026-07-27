import { Apple, BatteryFull, Search, SlidersHorizontal, Sparkles, Wifi } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { appById } from '../apps/registry';
import { useSystemStore } from '../store/systemStore';
import { useWindowStore } from '../store/windowStore';
import { ControlCenter } from './ControlCenter';
import { AppleMenu, AppMenu, NamedMenu } from './menus/MenuDropdowns';

const finderMenus = [
  { id: 'file', label: 'File' },
  { id: 'edit', label: 'Edit' },
  { id: 'view', label: 'View' },
  { id: 'go', label: 'Go' },
  { id: 'window', label: 'Window' },
  { id: 'help', label: 'Help' },
] as const;

function formatClock(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

type MenuBarProps = {
  onOpenSpotlight: () => void;
};

export function MenuBar({ onOpenSpotlight }: MenuBarProps) {
  const headerRef = useRef<HTMLElement>(null);
  const now = useSystemStore((state) => state.now);
  const toggleControlCenter = useSystemStore((state) => state.toggleControlCenter);
  const openMenuId = useSystemStore((state) => state.openMenuId);
  const toggleMenu = useSystemStore((state) => state.toggleMenu);
  const closeMenus = useSystemStore((state) => state.closeMenus);
  const activeAppId = useWindowStore((state) => state.activeAppId);
  const currentAppName = appById.get(activeAppId)?.title ?? 'Finder';

  useEffect(() => {
    if (!openMenuId) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      const activeMenu = target instanceof Element ? target.closest('[data-menu-id]') : null;

      if (activeMenu?.getAttribute('data-menu-id') === openMenuId) {
        return;
      }

      closeMenus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenus, openMenuId]);

  return (
    <header ref={headerRef} className="glass-surface fixed left-0 top-0 z-[10000] flex h-7 w-full items-center justify-between px-3 text-[13px] font-medium">
      <nav className="relative z-10 flex min-w-0 items-center gap-4">
        <div className="relative" data-menu-id="apple">
          <button
            type="button"
            className={`grid h-6 w-7 place-items-center rounded-md outline-none ${openMenuId === 'apple' ? 'bg-white/25' : 'hover:bg-white/20 focus-visible:bg-white/25'}`}
            aria-label="Apple menu"
            aria-expanded={openMenuId === 'apple'}
            onClick={() => toggleMenu('apple')}
          >
            <Apple size={16} strokeWidth={2.4} aria-hidden="true" />
          </button>
          {openMenuId === 'apple' ? (
            <div className="absolute left-0 top-7">
              <AppleMenu />
            </div>
          ) : null}
        </div>
        <div className="relative" data-menu-id="app">
          <button
            type="button"
            className={`h-6 rounded-md px-1.5 font-semibold outline-none ${openMenuId === 'app' ? 'bg-white/25' : 'hover:bg-white/20 focus-visible:bg-white/25'}`}
            aria-expanded={openMenuId === 'app'}
            onClick={() => toggleMenu('app')}
          >
            {currentAppName}
          </button>
          {openMenuId === 'app' ? (
            <div className="absolute left-0 top-7">
              <AppMenu appName={currentAppName} />
            </div>
          ) : null}
        </div>
        <div className="hidden items-center gap-4 md:flex">
          {finderMenus.map((menu) => (
            <div key={menu.id} className="relative" data-menu-id={menu.id}>
              <button
                className={`h-6 rounded-md px-1 outline-none ${openMenuId === menu.id ? 'bg-white/25' : 'hover:bg-white/20 focus-visible:bg-white/25'}`}
                type="button"
                aria-expanded={openMenuId === menu.id}
                onClick={() => toggleMenu(menu.id)}
              >
                {menu.label}
              </button>
              {openMenuId === menu.id ? (
                <div className="absolute left-0 top-7">
                  <NamedMenu name={menu.label} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex items-center gap-3 text-[var(--text-primary)]">
        <Wifi size={15} aria-label="WiFi" />
        <BatteryFull size={17} aria-label="Battery" />
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-md hover:bg-white/20 focus-visible:bg-white/25"
          aria-label="Control Center"
          data-control-center-trigger="true"
          onClick={toggleControlCenter}
        >
          <SlidersHorizontal size={15} />
        </button>
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-md hover:bg-white/20 focus-visible:bg-white/25"
          aria-label="Spotlight"
          onClick={onOpenSpotlight}
        >
          <Search size={15} />
        </button>
        <Sparkles size={15} aria-label="Siri" className="text-fuchsia-400" />
        <time dateTime={now.toISOString()} className="tabular-nums">{formatClock(now)}</time>
      </div>
      <ControlCenter />
    </header>
  );
}
