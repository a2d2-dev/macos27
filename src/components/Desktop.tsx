import { useEffect, useState } from 'react';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Spotlight } from './Spotlight';
import { WindowManager } from './WindowManager';
import { finderApp } from '../apps/finder';
import { textEditApp } from '../apps/textedit';
import { useSystemStore } from '../store/systemStore';
import { useWindowStore } from '../store/windowStore';
import { DesktopWidgets } from './widgets/DesktopWidgets';

type DesktopItem = {
  id: string;
  name: string;
  kind: 'folder' | 'text';
};

const desktopItems: DesktopItem[] = [
  { id: 'desktop-tahoe-trip', name: 'Tahoe Trip', kind: 'folder' },
  { id: 'desktop-welcome', name: 'Welcome.txt', kind: 'text' },
];

function DesktopItemIcon({
  item,
  selected,
  onSelect,
  onOpen,
}: {
  item: DesktopItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (item: DesktopItem) => void;
}) {
  return (
    <button
      type="button"
      className={`desktop-icon ${selected ? 'is-selected' : ''}`}
      aria-label={item.name}
      aria-pressed={selected}
      onMouseDown={(event) => {
        if (event.detail >= 2) {
          onOpen(item);
        }
      }}
      onClick={(event) => {
        onSelect(item.id);
        if (event.detail >= 2) {
          onOpen(item);
        }
      }}
      onDoubleClick={() => onOpen(item)}
    >
      <span className={`desktop-icon__glyph desktop-icon__glyph--${item.kind}`} aria-hidden="true">
        {item.kind === 'text' ? (
          <span className="desktop-icon__file-lines">
            <span />
            <span />
            <span />
          </span>
        ) : null}
      </span>
      <span className="desktop-icon__label">{item.name}</span>
    </button>
  );
}

export function Desktop() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [selectedDesktopItemId, setSelectedDesktopItemId] = useState<string | null>(null);
  const theme = useSystemStore((state) => state.theme);
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const brightness = useSystemStore((state) => state.brightness);
  const setNow = useSystemStore((state) => state.setNow);
  const openApp = useWindowStore((state) => state.openApp);

  const openDesktopItem = (item: DesktopItem) => {
    setSelectedDesktopItemId(item.id);
    openApp(item.kind === 'folder' ? finderApp : textEditApp);
  };

  useEffect(() => {
    setNow(new Date());
    const timer = globalThis.setInterval(() => setNow(new Date()), 1000);
    return () => globalThis.clearInterval(timer);
  }, [setNow]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === 'Space') {
        event.preventDefault();
        setIsSpotlightOpen((open) => !open);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main
      className={`theme-${theme} desktop-wallpaper wallpaper-${wallpaperId} relative h-screen w-screen overflow-hidden text-[var(--text-primary)]`}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          setSelectedDesktopItemId(null);
        }
      }}
    >
      <MenuBar onOpenSpotlight={() => setIsSpotlightOpen(true)} />
      <DesktopWidgets />
      <section className="desktop-icons-layer" aria-label="Desktop files">
        {desktopItems.map((item) => (
          <DesktopItemIcon
            key={item.id}
            item={item}
            selected={selectedDesktopItemId === item.id}
            onSelect={setSelectedDesktopItemId}
            onOpen={openDesktopItem}
          />
        ))}
      </section>
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
