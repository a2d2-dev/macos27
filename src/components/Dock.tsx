import { useMemo, useState, type CSSProperties } from 'react';
import { FolderDown, Trash2, type LucideIcon } from 'lucide-react';
import { appById, apps } from '../apps/registry';
import type { AppDefinition } from '../apps/types';
import { useWindowStore } from '../store/windowStore';

type DockItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  iconGradient: string;
  badge?: number;
  isRunning?: boolean;
  onClick: () => void;
};

const notificationBadges: Record<string, number> = {
  messages: 2,
  mail: 4,
  reminders: 3,
  'app-store': 4,
};

const dockStyle = {
  '--dock-icon-size': 'clamp(28px, calc((100vw - 190px) / 29), 46px)',
} as CSSProperties;

function scaleForDistance(distance: number | null) {
  if (distance === null) {
    return 1;
  }

  if (distance === 0) {
    return 1.54;
  }

  if (distance === 1) {
    return 1.28;
  }

  if (distance === 2) {
    return 1.1;
  }

  return 1;
}

function getStackTargetApp(): AppDefinition | undefined {
  return appById.get('finder');
}

export function Dock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const openApp = useWindowStore((state) => state.openApp);
  const windows = useWindowStore((state) => state.windows);
  const runningApps = useMemo(() => new Set(windows.map((window) => window.appId)), [windows]);
  const appItems = useMemo<DockItem[]>(
    () =>
      apps.map((app) => ({
        id: app.id,
        title: app.title,
        icon: app.icon,
        iconGradient: app.iconGradient,
        badge: notificationBadges[app.id],
        isRunning: runningApps.has(app.id),
        onClick: () => openApp(app),
      })),
    [openApp, runningApps],
  );
  const extraItems = useMemo<DockItem[]>(
    () => [
      {
        id: 'downloads-stack',
        title: 'Downloads',
        icon: FolderDown,
        iconGradient: 'from-sky-300 via-blue-400 to-blue-600',
        isRunning: false,
        onClick: () => {
          const finder = getStackTargetApp();
          if (finder) {
            openApp(finder);
          }
        },
      },
      {
        id: 'trash',
        title: 'Trash',
        icon: Trash2,
        iconGradient: 'from-slate-100 via-slate-300 to-slate-500',
        isRunning: false,
        onClick: () => {
          const finder = getStackTargetApp();
          if (finder) {
            openApp(finder);
          }
        },
      },
    ],
    [openApp],
  );

  const renderDockItem = (item: DockItem, index: number) => {
    const Icon = item.icon;
    const distance = hoveredIndex === null ? null : Math.abs(hoveredIndex - index);
    const scale = scaleForDistance(distance);
    const isHovered = hoveredIndex === index;
    const expandedMargin = hoveredIndex === null ? 0 : Math.max(0, scale - 1) * 5;

    return (
      <button
        key={item.id}
        type="button"
        aria-label={`Open ${item.title}`}
        className="dock-fisheye group relative flex shrink-0 origin-bottom flex-col items-center justify-end rounded-[17px] outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        style={{
          width: `calc(var(--dock-icon-size) * ${scale})`,
          height: 'calc(var(--dock-icon-size) * 1.54 + 18px)',
          marginInline: `${expandedMargin}px`,
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onClick={item.onClick}
      >
        <span
          className={`pointer-events-none absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-[15px] bg-gradient-to-br ${item.iconGradient} text-white shadow-lg ring-1 ring-white/45`}
          style={{
            bottom: 10,
            width: 'var(--dock-icon-size)',
            height: 'var(--dock-icon-size)',
            transform: `translateX(-50%) translateY(${isHovered ? '-8px' : '0px'}) scale(${scale})`,
            transformOrigin: 'bottom center',
            transition: 'transform 170ms ease, filter 170ms ease',
            filter: isHovered ? 'brightness(1.08) saturate(1.08)' : undefined,
          }}
        >
          <Icon size="62%" strokeWidth={2.15} />
          {item.badge ? (
            <span className="absolute -right-1.5 -top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-[0_1px_4px_rgba(0,0,0,0.28)] ring-1 ring-white/80 tabular-nums">
              {item.badge}
            </span>
          ) : null}
        </span>

        <span
          className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-2.5 py-1 text-[12px] font-medium text-white shadow-lg backdrop-blur-md transition duration-150 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
          style={{ bottom: 'calc(var(--dock-icon-size) + 34px)' }}
        >
          {item.title}
        </span>

        <span
          className={`absolute bottom-0 h-1.5 w-1.5 rounded-full bg-[var(--text-primary)] transition-opacity ${
            item.isRunning ? 'opacity-80' : 'opacity-0'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[9000] -translate-x-1/2">
      <nav
        className="glass-surface flex h-[92px] max-w-[calc(100vw-24px)] items-end gap-[3px] overflow-visible rounded-[26px] px-3 pb-2 pt-2 shadow-dock"
        style={dockStyle}
        aria-label="Dock"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {appItems.map((item, index) => renderDockItem(item, index))}
        <span className="mb-[14px] h-[42px] w-px shrink-0 rounded-full bg-white/45 shadow-[1px_0_0_rgba(15,23,42,0.18)] [.theme-dark_&]:bg-white/20 [.theme-dark_&]:shadow-[1px_0_0_rgba(255,255,255,0.08)]" />
        {extraItems.map((item, index) => renderDockItem(item, appItems.length + index))}
      </nav>
    </div>
  );
}
