import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
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

type DockMetrics = {
  navLeft: number;
  centers: number[];
  gaps: number[];
  baseWidth: number;
};

const DOCK_PEAK_SCALE = 1.5;
const DOCK_SCALE_GAIN = DOCK_PEAK_SCALE - 1;
const DOCK_SIGMA_MULTIPLIER = 1.15;
const DOCK_RADIUS_MULTIPLIER = 3.1;
const DOCK_MAX_LIFT = 8;

function getStackTargetApp(): AppDefinition | undefined {
  return appById.get('finder');
}

export function Dock() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const metricsRef = useRef<DockMetrics | null>(null);
  const frameRef = useRef<number | null>(null);
  const latestPointerXRef = useRef<number | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const bounceTimersRef = useRef<Map<string, number>>(new Map());
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
  const totalItems = appItems.length + extraItems.length;

  const setActiveDockIndex = useCallback((index: number | null) => {
    if (activeIndexRef.current === index) {
      return;
    }

    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const measureDock = useCallback(() => {
    const nav = navRef.current;
    const buttons = itemRefs.current.slice(0, totalItems);

    if (!nav || buttons.some((button) => !button)) {
      return null;
    }

    const navRect = nav.getBoundingClientRect();
    const measuredButtons = buttons as HTMLButtonElement[];
    const centers = measuredButtons.map((button) => button.offsetLeft + button.offsetWidth / 2);
    const gaps = measuredButtons.slice(0, -1).map((button, index) => {
      const nextButton = measuredButtons[index + 1];
      return Math.max(0, nextButton.offsetLeft - (button.offsetLeft + button.offsetWidth));
    });
    const baseWidth = measuredButtons[0]?.offsetWidth ?? 1;
    const metrics = { navLeft: navRect.left, centers, gaps, baseWidth };

    metricsRef.current = metrics;
    return metrics;
  }, [totalItems]);

  const applyDockTransforms = useCallback(
    (pointerX: number) => {
      const metrics = metricsRef.current ?? measureDock();

      if (!metrics) {
        return;
      }

      const { centers, gaps, baseWidth } = metrics;
      const radius = baseWidth * DOCK_RADIUS_MULTIPLIER;
      const sigma = baseWidth * DOCK_SIGMA_MULTIPLIER;
      let nearestIndex: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      const scales = centers.map((center, index) => {
        const distance = Math.abs(pointerX - center);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }

        if (distance > radius) {
          return 1;
        }

        return 1 + DOCK_SCALE_GAIN * Math.exp(-0.5 * (distance / sigma) ** 2);
      });

      const baseLeft = centers[0] - baseWidth / 2;
      const baseRight = centers[centers.length - 1] + baseWidth / 2;
      const widths = scales.map((scale) => baseWidth * scale);
      const virtualCenters: number[] = [];
      let virtualLeft = baseLeft;

      widths.forEach((width, index) => {
        virtualCenters[index] = virtualLeft + width / 2;
        virtualLeft += width + (gaps[index] ?? 0);
      });

      const virtualRight = virtualLeft;
      const alignOffset = (baseLeft + baseRight - (baseLeft + virtualRight)) / 2;

      itemRefs.current.slice(0, totalItems).forEach((button, index) => {
        if (!button) {
          return;
        }

        const scale = scales[index];
        const shift = virtualCenters[index] + alignOffset - centers[index];
        const lift = -DOCK_MAX_LIFT * ((scale - 1) / DOCK_SCALE_GAIN);
        const brightness = 1 + 0.08 * ((scale - 1) / DOCK_SCALE_GAIN);

        button.style.setProperty('--dock-scale', scale.toFixed(4));
        button.style.setProperty('--dock-inverse-scale', (1 / scale).toFixed(4));
        button.style.setProperty('--dock-shift', `${shift.toFixed(2)}px`);
        button.style.setProperty('--dock-lift', `${lift.toFixed(2)}px`);
        button.style.setProperty('--dock-bright', brightness.toFixed(3));
        button.style.setProperty('--dock-icon-bottom', `${(10 / scale).toFixed(2)}px`);
        button.style.setProperty('--dock-tooltip-bottom', `${((baseWidth + 34) / scale).toFixed(2)}px`);
        button.style.zIndex = String(Math.round(10 + (scale - 1) * 100));
      });

      setActiveDockIndex(nearestDistance <= baseWidth * 0.78 ? nearestIndex : null);
    },
    [measureDock, setActiveDockIndex, totalItems],
  );

  const scheduleDockUpdate = useCallback(
    (clientX: number) => {
      const metrics = metricsRef.current ?? measureDock();

      if (!metrics) {
        return;
      }

      latestPointerXRef.current = clientX - metrics.navLeft;

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const pointerX = latestPointerXRef.current;

        if (pointerX !== null) {
          applyDockTransforms(pointerX);
        }
      });
    },
    [applyDockTransforms, measureDock],
  );

  const resetDockTransforms = useCallback(() => {
    latestPointerXRef.current = null;
    metricsRef.current = null;
    navRef.current?.classList.remove('dock-is-tracking');

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    itemRefs.current.slice(0, totalItems).forEach((button) => {
      if (!button) {
        return;
      }

      button.style.setProperty('--dock-scale', '1');
      button.style.setProperty('--dock-inverse-scale', '1');
      button.style.setProperty('--dock-shift', '0px');
      button.style.setProperty('--dock-lift', '0px');
      button.style.setProperty('--dock-bright', '1');
      button.style.setProperty('--dock-icon-bottom', '10px');
      button.style.setProperty('--dock-tooltip-bottom', 'calc(var(--dock-icon-size) + 34px)');
      button.style.zIndex = '10';
      button.classList.remove('dock-is-pressing');
    });

    setActiveDockIndex(null);
  }, [setActiveDockIndex, totalItems]);

  useEffect(() => {
    itemRefs.current.length = totalItems;
    resetDockTransforms();
  }, [resetDockTransforms, totalItems]);

  useEffect(() => {
    const handleResize = () => {
      resetDockTransforms();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resetDockTransforms();
      bounceTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      bounceTimersRef.current.clear();
    };
  }, [resetDockTransforms]);

  const handleDockMouseEnter = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      navRef.current?.classList.add('dock-is-tracking');
      measureDock();
      scheduleDockUpdate(event.clientX);
    },
    [measureDock, scheduleDockUpdate],
  );

  const handleDockMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      scheduleDockUpdate(event.clientX);
    },
    [scheduleDockUpdate],
  );

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.classList.add('dock-is-pressing');
  }, []);

  const clearPressState = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.classList.remove('dock-is-pressing');
  }, []);

  const triggerBounce = useCallback((id: string, button: HTMLButtonElement) => {
    const currentTimer = bounceTimersRef.current.get(id);

    if (currentTimer) {
      window.clearTimeout(currentTimer);
    }

    button.classList.remove('dock-is-pressing', 'dock-is-bouncing');
    void button.offsetWidth;
    button.classList.add('dock-is-bouncing');

    const timer = window.setTimeout(() => {
      button.classList.remove('dock-is-bouncing');
      bounceTimersRef.current.delete(id);
    }, 440);

    bounceTimersRef.current.set(id, timer);
  }, []);

  const renderDockItem = (item: DockItem, index: number) => {
    const Icon = item.icon;
    const isHovered = activeIndex === index;

    return (
      <button
        key={item.id}
        ref={(node) => {
          itemRefs.current[index] = node;
        }}
        type="button"
        aria-label={`Open ${item.title}`}
        className="dock-fisheye group relative flex shrink-0 origin-bottom flex-col items-center justify-end rounded-[17px] outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        style={{
          width: 'var(--dock-icon-size)',
          height: 'calc(var(--dock-icon-size) + 20px)',
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={clearPressState}
        onPointerCancel={clearPressState}
        onPointerLeave={clearPressState}
        onClick={(event) => {
          triggerBounce(item.id, event.currentTarget);
          item.onClick();
        }}
      >
        <span
          className={`dock-icon-motion pointer-events-none absolute left-1/2 grid place-items-center rounded-[15px] bg-gradient-to-br ${item.iconGradient} text-white shadow-lg ring-1 ring-white/45`}
        >
          <Icon size="62%" strokeWidth={2.15} />
          {item.badge ? (
            <span className="absolute -right-1.5 -top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-[0_1px_4px_rgba(0,0,0,0.28)] ring-1 ring-white/80 tabular-nums">
              {item.badge}
            </span>
          ) : null}
        </span>

        <span
          className={`dock-tooltip pointer-events-none absolute left-1/2 z-10 whitespace-nowrap rounded-full bg-black/75 px-2.5 py-1 text-[12px] font-medium text-white shadow-lg backdrop-blur-md ${
            isHovered ? 'is-visible' : ''
          }`}
        >
          {item.title}
        </span>

        <span
          className={`dock-running-dot absolute bottom-0 h-1.5 w-1.5 rounded-full bg-[var(--text-primary)] transition-opacity ${
            item.isRunning ? 'opacity-80' : 'opacity-0'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[9000] -translate-x-1/2">
      <nav
        ref={navRef}
        className="glass-surface flex h-[92px] max-w-[calc(100vw-24px)] items-end gap-[3px] overflow-visible rounded-[26px] px-3 pb-2 pt-2 shadow-dock"
        style={dockStyle}
        aria-label="Dock"
        onMouseEnter={handleDockMouseEnter}
        onMouseMove={handleDockMouseMove}
        onMouseLeave={resetDockTransforms}
      >
        {appItems.map((item, index) => renderDockItem(item, index))}
        <span className="mb-[14px] h-[42px] w-px shrink-0 rounded-full bg-white/45 shadow-[1px_0_0_rgba(15,23,42,0.18)] [.theme-dark_&]:bg-white/20 [.theme-dark_&]:shadow-[1px_0_0_rgba(255,255,255,0.08)]" />
        {extraItems.map((item, index) => renderDockItem(item, appItems.length + index))}
      </nav>
    </div>
  );
}
