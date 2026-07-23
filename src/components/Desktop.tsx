import { useEffect, useState } from 'react';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Spotlight } from './Spotlight';
import { WindowManager } from './WindowManager';
import { useSystemStore } from '../store/systemStore';
import { DesktopWidgets } from './widgets/DesktopWidgets';

export function Desktop() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const theme = useSystemStore((state) => state.theme);
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const brightness = useSystemStore((state) => state.brightness);
  const setNow = useSystemStore((state) => state.setNow);

  useEffect(() => {
    setNow(new Date());
    const timer = globalThis.setInterval(() => setNow(new Date()), 1000);
    return () => globalThis.clearInterval(timer);
  }, [setNow]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === 'Space') {
        event.preventDefault();
        setIsSpotlightOpen((open) => !open);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className={`theme-${theme} desktop-wallpaper wallpaper-${wallpaperId} relative h-screen w-screen overflow-hidden text-[var(--text-primary)]`}>
      <MenuBar onOpenSpotlight={() => setIsSpotlightOpen(true)} />
      <DesktopWidgets />
      <div
        className="pointer-events-none absolute inset-0 z-[8] bg-black transition-opacity duration-200"
        style={{ opacity: ((100 - brightness) / 100) * 0.42 }}
        aria-hidden="true"
      />
      <WindowManager />
      <Dock />
      <Spotlight isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
    </main>
  );
}
