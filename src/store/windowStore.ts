import { create } from 'zustand';
import type { AppDefinition } from '../apps/types';

export type WindowFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AppWindow = {
  id: string;
  appId: string;
  title: string;
  frame: WindowFrame;
  restoreFrame: WindowFrame | null;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};

type WindowState = {
  windows: AppWindow[];
  activeWindowId: string | null;
  activeAppId: string;
  openApp: (app: AppDefinition) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  toggleMaximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowFrame: (windowId: string, frame: WindowFrame) => void;
};

export const menuBarHeight = 28;
export const dockReserve = 102;
export const minViewportMargin = 8;
const defaultZ = 100;

function nextZ(windows: AppWindow[]) {
  return windows.reduce((highest, window) => Math.max(highest, window.zIndex), defaultZ) + 1;
}

function getViewportSize() {
  return {
    width: typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1280,
    height: typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 800,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getViewportLimits() {
  const viewport = getViewportSize();
  const topLimit = menuBarHeight + minViewportMargin;
  const bottomLimit = viewport.height - dockReserve - minViewportMargin;
  const maxWidth = Math.max(1, viewport.width - minViewportMargin * 2);
  const maxHeight = Math.max(1, bottomLimit - topLimit);

  return {
    ...viewport,
    topLimit,
    bottomLimit,
    maxWidth,
    maxHeight,
  };
}

export function clampFrame(frame: WindowFrame, minWidth: number, minHeight: number): WindowFrame {
  const { width: viewportWidth, topLimit, bottomLimit, maxWidth, maxHeight } = getViewportLimits();
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

function centeredFrame(app: AppDefinition, offset: number): WindowFrame {
  const { width: viewportWidth, topLimit, maxHeight } = getViewportLimits();
  const frame = clampFrame(
    {
      x: Math.round((viewportWidth - app.defaultWindow.width) / 2) + offset,
      y: Math.round(topLimit + (maxHeight - app.defaultWindow.height) / 2) + offset,
      width: app.defaultWindow.width,
      height: app.defaultWindow.height,
    },
    app.defaultWindow.minWidth,
    app.defaultWindow.minHeight,
  );

  return clampFrame(
    {
      ...frame,
      x: Math.round((viewportWidth - frame.width) / 2) + offset,
      y: Math.round(topLimit + (maxHeight - frame.height) / 2) + offset,
    },
    app.defaultWindow.minWidth,
    app.defaultWindow.minHeight,
  );
}

function getActiveAppId(windows: AppWindow[], activeWindowId: string | null) {
  if (!activeWindowId) {
    return 'finder';
  }

  return windows.find((window) => window.id === activeWindowId)?.appId ?? 'finder';
}

function maximizedFrame(): WindowFrame {
  const { topLimit, maxWidth, maxHeight } = getViewportLimits();

  return clampFrame({ x: minViewportMargin, y: topLimit, width: maxWidth, height: maxHeight }, 1, 1);
}

export const useWindowStore = create<WindowState>((set) => ({
  windows: [],
  activeWindowId: null,
  activeAppId: 'finder',
  openApp: (app) =>
    set((state) => {
      const existing = state.windows.find((window) => window.appId === app.id);
      const zIndex = nextZ(state.windows);

      if (existing) {
        const windows = state.windows.map((window) =>
          window.id === existing.id ? { ...window, minimized: false, zIndex } : window,
        );
        return {
          windows,
          activeWindowId: existing.id,
          activeAppId: app.id,
        };
      }

      const windowCount = state.windows.length;
      const id = `${app.id}-${Date.now()}`;
      const newWindow: AppWindow = {
        id,
        appId: app.id,
        title: app.title,
        frame: centeredFrame(app, windowCount * 18),
        restoreFrame: null,
        minimized: false,
        maximized: false,
        zIndex,
      };

      return {
        windows: [...state.windows, newWindow],
        activeWindowId: id,
        activeAppId: app.id,
      };
    }),
  closeWindow: (windowId) =>
    set((state) => {
      const windows = state.windows.filter((window) => window.id !== windowId);
      const activeWindowId =
        state.activeWindowId === windowId
          ? windows.filter((window) => !window.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : state.activeWindowId;

      return {
        windows,
        activeWindowId,
        activeAppId: getActiveAppId(windows, activeWindowId),
      };
    }),
  minimizeWindow: (windowId) =>
    set((state) => {
      const windows = state.windows.map((window) =>
        window.id === windowId ? { ...window, minimized: true } : window,
      );
      const activeWindowId =
        state.activeWindowId === windowId
          ? windows.filter((window) => !window.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : state.activeWindowId;

      return {
        windows,
        activeWindowId,
        activeAppId: getActiveAppId(windows, activeWindowId),
      };
    }),
  toggleMaximizeWindow: (windowId) =>
    set((state) => {
      const zIndex = nextZ(state.windows);
      const windows = state.windows.map((window) => {
        if (window.id !== windowId) {
          return window;
        }

        if (window.maximized && window.restoreFrame) {
          return {
            ...window,
            frame: window.restoreFrame,
            restoreFrame: null,
            maximized: false,
            minimized: false,
            zIndex,
          };
        }

        return {
          ...window,
          frame: maximizedFrame(),
          restoreFrame: window.frame,
          maximized: true,
          minimized: false,
          zIndex,
        };
      });

      return {
        windows,
        activeWindowId: windowId,
        activeAppId: getActiveAppId(windows, windowId),
      };
    }),
  focusWindow: (windowId) =>
    set((state) => {
      const target = state.windows.find((window) => window.id === windowId);
      if (!target) {
        return state;
      }

      const zIndex = nextZ(state.windows);
      const windows = state.windows.map((window) =>
        window.id === windowId ? { ...window, minimized: false, zIndex } : window,
      );

      return {
        windows,
        activeWindowId: windowId,
        activeAppId: target.appId,
      };
    }),
  updateWindowFrame: (windowId, frame) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId
          ? {
              ...window,
              frame,
              maximized: false,
              restoreFrame: null,
            }
          : window,
      ),
    })),
}));
