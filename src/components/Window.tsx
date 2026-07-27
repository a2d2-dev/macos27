import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
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
const activeWindowResizeZIndex = 9100;

type ResizeHandleSpec = {
  direction: ResizeDirection;
  className: string;
  cursorClassName: string;
  fixedStyle: (frame: WindowFrame) => CSSProperties;
};

const resizeHandleSpecs: ResizeHandleSpec[] = [
  {
    direction: 'n',
    className: 'left-3 right-3 top-0 h-2 cursor-n-resize',
    cursorClassName: 'cursor-n-resize',
    fixedStyle: (frame) => ({ left: frame.x + 12, top: frame.y, width: Math.max(0, frame.width - 24), height: 8 }),
  },
  {
    direction: 's',
    className: 'bottom-0 left-3 right-3 h-3 cursor-s-resize',
    cursorClassName: 'cursor-s-resize',
    fixedStyle: (frame) => ({ left: frame.x + 12, top: frame.y + frame.height - 12, width: Math.max(0, frame.width - 24), height: 12 }),
  },
  {
    direction: 'e',
    className: 'bottom-3 top-3 right-0 w-3 cursor-e-resize',
    cursorClassName: 'cursor-e-resize',
    fixedStyle: (frame) => ({ left: frame.x + frame.width - 12, top: frame.y + 12, width: 12, height: Math.max(0, frame.height - 24) }),
  },
  {
    direction: 'w',
    className: 'bottom-3 left-0 top-3 w-3 cursor-w-resize',
    cursorClassName: 'cursor-w-resize',
    fixedStyle: (frame) => ({ left: frame.x, top: frame.y + 12, width: 12, height: Math.max(0, frame.height - 24) }),
  },
  {
    direction: 'ne',
    className: 'right-0 top-0 h-4 w-4 cursor-ne-resize',
    cursorClassName: 'cursor-ne-resize',
    fixedStyle: (frame) => ({ left: frame.x + frame.width - 16, top: frame.y, width: 16, height: 16 }),
  },
  {
    direction: 'nw',
    className: 'left-0 top-0 h-4 w-4 cursor-nw-resize',
    cursorClassName: 'cursor-nw-resize',
    fixedStyle: (frame) => ({ left: frame.x, top: frame.y, width: 16, height: 16 }),
  },
  {
    direction: 'se',
    className: 'bottom-0 right-0 h-5 w-5 cursor-se-resize',
    cursorClassName: 'cursor-se-resize',
    fixedStyle: (frame) => ({ left: frame.x + frame.width - 20, top: frame.y + frame.height - 20, width: 20, height: 20 }),
  },
  {
    direction: 'sw',
    className: 'bottom-0 left-0 h-5 w-5 cursor-sw-resize',
    cursorClassName: 'cursor-sw-resize',
    fixedStyle: (frame) => ({ left: frame.x, top: frame.y + frame.height - 20, width: 20, height: 20 }),
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampFrame(frame: WindowFrame, minWidth: number, minHeight: number): WindowFrame {
  const viewportWidth = globalThis.innerWidth || 1280;
  const viewportHeight = globalThis.innerHeight || 800;
  const topLimit = menuBarHeight + minViewportMargin;
  const bottomLimit = viewportHeight - dockReserve - minViewportMargin;
  const maxWidth = Math.max(1, viewportWidth - minViewportMargin * 2);
  const maxHeight = Math.max(1, bottomLimit - topLimit);
  const width = clamp(frame.width, Math.min(minWidth, maxWidth), maxWidth);
  const height = clamp(frame.height, Math.min(minHeight, maxHeight), maxHeight);
  const maxX = Math.max(minViewportMargin, viewportWidth - width - minViewportMargin);
  const maxY = Math.max(topLimit, bottomLimit - height);

  return {
    x: clamp(frame.x, minViewportMargin, maxX),
    y: clamp(frame.y, topLimit, maxY),
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
  const interactionCleanupRef = useRef<(() => void) | null>(null);
  const activeInteractionRef = useRef<'drag' | 'resize' | null>(null);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const updateWindowFrame = useWindowStore((state) => state.updateWindowFrame);
  const AppComponent = app.Component;
  const resizePortalRoot = typeof document === 'undefined' ? null : document.body;

  const clearActiveInteraction = () => {
    interactionCleanupRef.current?.();
  };

  useEffect(
    () => () => {
      interactionCleanupRef.current?.();
      interactionCleanupRef.current = null;
      activeInteractionRef.current = null;
    },
    [],
  );

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || window.maximized) {
      return;
    }

    clearActiveInteraction();
    focusWindow(window.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = window.frame;
    activeInteractionRef.current = 'drag';

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
      globalThis.removeEventListener('pointercancel', endDrag);
      interactionCleanupRef.current = null;
      activeInteractionRef.current = null;
    };

    interactionCleanupRef.current = endDrag;

    globalThis.addEventListener('pointermove', handlePointerMove);
    globalThis.addEventListener('pointerup', endDrag);
    globalThis.addEventListener('pointercancel', endDrag);
  };

  const beginResize = (direction: ResizeDirection) => (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || window.maximized) {
      return;
    }

    clearActiveInteraction();
    event.preventDefault();
    event.stopPropagation();
    focusWindow(window.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = window.frame;
    activeInteractionRef.current = 'resize';

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
      globalThis.removeEventListener('pointercancel', endResize);
      interactionCleanupRef.current = null;
      activeInteractionRef.current = null;
    };

    interactionCleanupRef.current = endResize;

    globalThis.addEventListener('pointermove', handlePointerMove);
    globalThis.addEventListener('pointerup', endResize);
    globalThis.addEventListener('pointercancel', endResize);
  };

  const resizeHandles = resizeHandleSpecs.map((handle) => (
    <div
      key={handle.direction}
      className={`resize-handle ${handle.className}`}
      onPointerDown={beginResize(handle.direction)}
    />
  ));

  return (
    <>
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
          <div className="traffic-lights group absolute left-4 top-1/2 flex -translate-y-1/2 gap-2">
            <button
              type="button"
              aria-label={`Close ${window.title}`}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#ff5f57] ring-1 ring-black/10"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => closeWindow(window.id)}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2 w-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <path d="M3.6 3.6l4.8 4.8M8.4 3.6l-4.8 4.8" stroke="rgba(0,0,0,0.5)" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={`Minimize ${window.title}`}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#febc2e] ring-1 ring-black/10"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => minimizeWindow(window.id)}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2 w-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <path d="M3 6h6" stroke="rgba(0,0,0,0.55)" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={`${window.maximized ? 'Restore' : 'Maximize'} ${window.title}`}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#28c840] ring-1 ring-black/10"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => toggleMaximizeWindow(window.id)}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-[9px] w-[9px] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <path d="M4 8.2V4.4h3.8z M8 3.8v3.8H4.2z" fill="rgba(0,0,0,0.5)" />
              </svg>
            </button>
          </div>
          <div className={`text-sm font-semibold ${isActive ? 'opacity-90' : 'opacity-[0.48]'}`}>{window.title}</div>
        </div>

        <div className="h-[calc(100%-2.5rem)] overflow-hidden">
          <AppComponent />
        </div>

        {resizeHandles}
      </article>

      {isActive && !window.maximized && resizePortalRoot
        ? createPortal(
            <div className="pointer-events-none fixed inset-0" style={{ zIndex: activeWindowResizeZIndex }}>
              {resizeHandleSpecs.map((handle) => (
                <div
                  key={handle.direction}
                  className={`resize-handle pointer-events-auto ${handle.cursorClassName}`}
                  style={{
                    ...handle.fixedStyle(window.frame),
                    position: 'fixed',
                    zIndex: activeWindowResizeZIndex,
                  }}
                  onPointerDown={beginResize(handle.direction)}
                />
              ))}
            </div>,
            resizePortalRoot,
          )
        : null}
    </>
  );
}
