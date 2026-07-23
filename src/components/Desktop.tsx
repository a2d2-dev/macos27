import { useEffect } from 'react';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { WindowManager } from './WindowManager';
import { useSystemStore } from '../store/systemStore';
import { DesktopWidgets } from './widgets/DesktopWidgets';

export function Desktop() {
  const theme = useSystemStore((state) => state.theme);
  const brightness = useSystemStore((state) => state.brightness);
  const setNow = useSystemStore((state) => state.setNow);

  useEffect(() => {
    setNow(new Date());
    const timer = globalThis.setInterval(() => setNow(new Date()), 1000);
    return () => globalThis.clearInterval(timer);
  }, [setNow]);

  return (
    <main className={`theme-${theme} desktop-wallpaper relative h-screen w-screen overflow-hidden text-[var(--text-primary)]`}>
      <MenuBar />
      <DesktopWidgets />
      <div
        className="pointer-events-none absolute inset-0 z-[8] bg-black transition-opacity duration-200"
        style={{ opacity: ((100 - brightness) / 100) * 0.42 }}
        aria-hidden="true"
      />
      <WindowManager />
      <Dock />
    </main>
  );
}
