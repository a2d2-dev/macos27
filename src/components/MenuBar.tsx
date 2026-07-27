import { Apple, BatteryFull, Bell, Search, SlidersHorizontal, Sparkles, Wifi } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const now = useSystemStore((state) => state.now);
  const toggleControlCenter = useSystemStore((state) => state.toggleControlCenter);
  const openMenuId = useSystemStore((state) => state.openMenuId);
  const toggleMenu = useSystemStore((state) => state.toggleMenu);
  const closeMenus = useSystemStore((state) => state.closeMenus);
  const activeAppId = useWindowStore((state) => state.activeAppId);
  const currentAppName = appById.get(activeAppId)?.title ?? 'Finder';
  const buttonStateClass = 'hover:bg-[var(--menubar-control-hover)] focus-visible:bg-[var(--menubar-control-active)]';

  const handleMenuToggle = (menuId: Parameters<typeof toggleMenu>[0]) => {
    setIsNotificationsOpen(false);
    toggleMenu(menuId);
  };

  const handleToggleControlCenter = () => {
    setIsNotificationsOpen(false);
    toggleControlCenter();
  };

  const handleOpenSpotlight = () => {
    setIsNotificationsOpen(false);
    onOpenSpotlight();
  };

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

  useEffect(() => {
    if (!isNotificationsOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      const trigger = target instanceof Element ? target.closest('[data-notifications-trigger="true"]') : null;

      if (trigger) {
        return;
      }

      if (notificationsRef.current && target instanceof Node && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationsOpen]);

  return (
    <header ref={headerRef} className="glass-menubar fixed left-0 top-0 z-[10000] flex h-7 w-full items-center justify-between px-3 text-[13px] font-medium">
      <nav className="relative z-10 flex min-w-0 items-center gap-4">
        <div className="relative" data-menu-id="apple">
          <button
            type="button"
            className={`grid h-6 w-7 place-items-center rounded-md outline-none ${openMenuId === 'apple' ? 'bg-[var(--menubar-control-active)]' : buttonStateClass}`}
            aria-label="Apple menu"
            aria-expanded={openMenuId === 'apple'}
            onClick={() => handleMenuToggle('apple')}
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
            className={`h-6 rounded-md px-1.5 font-semibold outline-none ${openMenuId === 'app' ? 'bg-[var(--menubar-control-active)]' : buttonStateClass}`}
            aria-expanded={openMenuId === 'app'}
            onClick={() => handleMenuToggle('app')}
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
                className={`h-6 rounded-md px-1 outline-none ${openMenuId === menu.id ? 'bg-[var(--menubar-control-active)]' : buttonStateClass}`}
                type="button"
                aria-expanded={openMenuId === menu.id}
                onClick={() => handleMenuToggle(menu.id)}
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
          className={`grid h-6 w-6 place-items-center rounded-md ${buttonStateClass}`}
          aria-label="Spotlight"
          onClick={handleOpenSpotlight}
        >
          <Search size={15} />
        </button>
        <Sparkles size={15} aria-label="Siri" className="text-fuchsia-400" />
        <button
          type="button"
          className={`grid h-6 w-6 place-items-center rounded-md ${buttonStateClass}`}
          aria-label="Control Center"
          data-control-center-trigger="true"
          onClick={handleToggleControlCenter}
        >
          <SlidersHorizontal size={15} />
        </button>
        <button
          type="button"
          className={`grid h-6 w-6 place-items-center rounded-md ${isNotificationsOpen ? 'bg-[var(--menubar-control-active)]' : buttonStateClass}`}
          aria-label="Notifications"
          aria-expanded={isNotificationsOpen}
          data-notifications-trigger="true"
          onClick={() => {
            closeMenus();
            setIsNotificationsOpen((isOpen) => !isOpen);
          }}
        >
          <Bell size={15} />
        </button>
        <time dateTime={now.toISOString()} className="tabular-nums">{formatClock(now)}</time>
      </div>
      <ControlCenter />
      {isNotificationsOpen ? (
        <div
          ref={notificationsRef}
          className="glass-surface-strong fixed right-3 top-9 z-[10001] w-[300px] rounded-[18px] p-3 text-[var(--text-primary)]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold">Notifications</h2>
            <span className="text-[11px] text-[var(--text-secondary)]">Now</span>
          </div>
          <div className="rounded-2xl bg-white/30 p-3 [.theme-dark_&]:bg-white/10">
            <p className="text-[13px] font-semibold">macOS27</p>
            <p className="mt-1 text-[12px] leading-4 text-[var(--text-secondary)]">Glass polish validation is ready for review.</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
