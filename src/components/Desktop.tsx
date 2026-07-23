import { useEffect } from 'react';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { WindowManager } from './WindowManager';
import { useSystemStore } from '../store/systemStore';

export function Desktop() {
  const theme = useSystemStore((state) => state.theme);
  const setNow = useSystemStore((state) => state.setNow);

  useEffect(() => {
    setNow(new Date());
    const timer = globalThis.setInterval(() => setNow(new Date()), 1000);
    return () => globalThis.clearInterval(timer);
  }, [setNow]);

  return (
    <main className={`theme-${theme} desktop-wallpaper relative h-screen w-screen overflow-hidden text-[var(--text-primary)]`}>
      <MenuBar />
      <WindowManager />
      <Dock />
    </main>
  );
}
