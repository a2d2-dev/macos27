import type { PointerEvent as ReactPointerEvent } from 'react';
import type { AppDefinition } from '../apps/types';
import type { AppWindow, WindowFrame } from '../store/windowStore';
import { useWindowStore } from '../store/windowStore';

type WindowShellProps = {
  app: AppDefinition;
  window: AppWindow;
  isActive: boolean;
};

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const menuBarHeight = 28;
const dockReserve = 102;
const minViewportMargin = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampFrame(frame: WindowFrame, minWidth: number, minHeight: number): WindowFrame {
  const viewportWidth = globalThis.innerWidth || 1280;
  const viewportHeight = globalThis.innerHeight || 800;
  const maxWidth = Math.max(minWidth, viewportWidth - minViewportMargin * 2);
  const maxHeight = Math.max(minHeight, viewportHeight - menuBarHeight - dockReserve);
  const width = clamp(frame.width, minWidth, maxWidth);
  const height = clamp(frame.height, minHeight, maxHeight);
  const maxY = Math.max(menuBarHeight + minViewportMargin, viewportHeight - height - minViewportMargin);

  return {
    x: clamp(frame.x, minViewportMargin, viewportWidth - width - minViewportMargin),
    y: clamp(frame.y, menuBarHeight + minViewportMargin, maxY),
    width,
    height,
  };
}

function resizeFrame(
  startFrame: WindowFrame,
  direction: ResizeDirection,
  deltaX: number,
  deltaY: number,
  minWidth: number,
  minHeight: number,
) {
  let { x, y, width, height } = startFrame;

  if (direction.includes('e')) {
    width += deltaX;
  }

  if (direction.includes('s')) {
    height += deltaY;
  }

  if (direction.includes('w')) {
    x += deltaX;
    width -= deltaX;
  }

  if (direction.includes('n')) {
    y += deltaY;
    height -= deltaY;
  }

  if (width < minWidth) {
    if (direction.includes('w')) {
      x -= minWidth - width;
    }
    width = minWidth;
  }

  if (height < minHeight) {
    if (direction.includes('n')) {
      y -= minHeight - height;
    }
    height = minHeight;
  }

  return clampFrame({ x, y, width, height }, minWidth, minHeight);
}

export function WindowShell({ app, window, isActive }: WindowShellProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const updateWindowFrame = useWindowStore((state) => state.updateWindowFrame);
  const AppComponent = app.Component;

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || window.maximized) {
      return;
    }

    focusWindow(window.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = window.frame;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextFrame = clampFrame(
        {
          ...startFrame,
          x: startFrame.x + moveEvent.clientX - startX,
          y: startFrame.y + moveEvent.clientY - startY,
        },
        app.defaultWindow.minWidth,
        app.defaultWindow.minHeight,
      );
      updateWindowFrame(window.id, nextFrame);
    };

    const endDrag = () => {
      globalThis.removeEventListener('pointermove', handlePointerMove);
      globalThis.removeEventListener('pointerup', endDrag);
    };

    globalThis.addEventListener('pointermove', handlePointerMove);
    globalThis.addEventListener('pointerup', endDrag);
  };

  const beginResize = (direction: ResizeDirection) => (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || window.maximized) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusWindow(window.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = window.frame;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateWindowFrame(
        window.id,
        resizeFrame(
          startFrame,
          direction,
          moveEvent.clientX - startX,
          moveEvent.clientY - startY,
          app.defaultWindow.minWidth,
          app.defaultWindow.minHeight,
        ),
      );
    };

    const endResize = () => {
      globalThis.removeEventListener('pointermove', handlePointerMove);
      globalThis.removeEventListener('pointerup', endResize);
    };

    globalThis.addEventListener('pointermove', handlePointerMove);
    globalThis.addEventListener('pointerup', endResize);
  };

  return (
    <article
      className="glass-surface-strong absolute overflow-hidden rounded-[18px] text-[var(--text-primary)]"
      style={{
        left: window.frame.x,
        top: window.frame.y,
        width: window.frame.width,
        height: window.frame.height,
        zIndex: window.zIndex,
      }}
      onPointerDown={() => focusWindow(window.id)}
      aria-label={`${window.title} window`}
    >
      <div
        className="glass-titlebar flex h-10 cursor-move select-none items-center justify-center px-4"
        data-active={isActive}
        onPointerDown={beginDrag}
      >
        <div className="absolute left-4 top-1/2 flex -translate-y-1/2 gap-2">
          <button
            type="button"
            aria-label={`Close ${window.title}`}
            className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] shadow-inner ring-1 ring-black/10"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => closeWindow(window.id)}
          />
          <button
            type="button"
            aria-label={`Minimize ${window.title}`}
            className="h-3.5 w-3.5 rounded-full bg-[#febc2e] shadow-inner ring-1 ring-black/10"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => minimizeWindow(window.id)}
          />
          <button
            type="button"
            aria-label={`${window.maximized ? 'Restore' : 'Maximize'} ${window.title}`}
            className="h-3.5 w-3.5 rounded-full bg-[#28c840] shadow-inner ring-1 ring-black/10"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => toggleMaximizeWindow(window.id)}
          />
        </div>
        <div className={`text-sm font-semibold ${isActive ? 'opacity-90' : 'opacity-[0.48]'}`}>{window.title}</div>
      </div>

      <div className="h-[calc(100%-2.5rem)] overflow-hidden">
        <AppComponent />
      </div>

      <div className="resize-handle left-3 right-3 top-0 h-2 cursor-n-resize" onPointerDown={beginResize('n')} />
      <div className="resize-handle bottom-0 left-3 right-3 h-3 cursor-s-resize" onPointerDown={beginResize('s')} />
      <div className="resize-handle bottom-3 top-3 right-0 w-3 cursor-e-resize" onPointerDown={beginResize('e')} />
      <div className="resize-handle bottom-3 left-0 top-3 w-3 cursor-w-resize" onPointerDown={beginResize('w')} />
      <div className="resize-handle right-0 top-0 h-4 w-4 cursor-ne-resize" onPointerDown={beginResize('ne')} />
      <div className="resize-handle left-0 top-0 h-4 w-4 cursor-nw-resize" onPointerDown={beginResize('nw')} />
      <div className="resize-handle bottom-0 right-0 h-5 w-5 cursor-se-resize" onPointerDown={beginResize('se')} />
      <div className="resize-handle bottom-0 left-0 h-5 w-5 cursor-sw-resize" onPointerDown={beginResize('sw')} />
    </article>
  );
}
