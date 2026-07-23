import { appById } from '../apps/registry';
import { useWindowStore } from '../store/windowStore';
import { WindowShell } from './Window';

export function WindowManager() {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);

  return (
    <section className="absolute inset-0 z-10" aria-label="Window manager">
      {windows
        .filter((window) => !window.minimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => {
          const app = appById.get(window.appId);
          if (!app) {
            return null;
          }

          return <WindowShell key={window.id} app={app} window={window} isActive={window.id === activeWindowId} />;
        })}
    </section>
  );
}
