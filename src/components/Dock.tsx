import { useMemo, useState } from 'react';
import { apps } from '../apps/registry';
import { useWindowStore } from '../store/windowStore';

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

export function Dock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const openApp = useWindowStore((state) => state.openApp);
  const windows = useWindowStore((state) => state.windows);
  const runningApps = useMemo(() => new Set(windows.map((window) => window.appId)), [windows]);

  return (
    <div className="fixed bottom-4 left-1/2 z-[9000] -translate-x-1/2">
      <nav
        className="glass-surface flex h-[86px] items-end gap-2 rounded-[26px] px-4 pb-3 pt-2 shadow-dock"
        aria-label="Dock"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {apps.map((app, index) => {
          const Icon = app.icon;
          const distance = hoveredIndex === null ? null : Math.abs(hoveredIndex - index);
          const scale = scaleForDistance(distance);
          const isRunning = runningApps.has(app.id);

          return (
            <button
              key={app.id}
              type="button"
              aria-label={`Open ${app.title}`}
              className="relative flex h-[54px] w-[54px] flex-col items-center justify-end rounded-[17px] outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              style={{
                marginInline: hoveredIndex === null ? 0 : `${Math.max(0, scale - 1) * 10}px`,
                transition: 'margin 170ms ease',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => openApp(app)}
            >
              <span
                className={`dock-fisheye pointer-events-none grid h-[54px] w-[54px] origin-bottom place-items-center rounded-[17px] bg-gradient-to-br ${app.iconGradient} text-white shadow-lg ring-1 ring-white/45`}
                style={{
                  transform: `scale(${scale}) translateY(${hoveredIndex === index ? '-8px' : '0px'})`,
                }}
              >
                <Icon size={29} strokeWidth={2.15} />
              </span>
              <span
                className={`absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-[var(--text-primary)] transition-opacity ${
                  isRunning ? 'opacity-80' : 'opacity-0'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
