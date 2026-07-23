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

const menuBarHeight = 28;
const dockReserve = 102;
const defaultZ = 100;
const maximizedViewportMargin = 10;

function nextZ(windows: AppWindow[]) {
  return windows.reduce((highest, window) => Math.max(highest, window.zIndex), defaultZ) + 1;
}

function centeredFrame(app: AppDefinition, offset: number): WindowFrame {
  const width = app.defaultWindow.width;
  const height = app.defaultWindow.height;
  const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight;

  return {
    x: Math.max(24, Math.round((viewportWidth - width) / 2) + offset),
    y: Math.max(menuBarHeight + 18, Math.round((viewportHeight - dockReserve - height) / 2) + offset),
    width,
    height,
  };
}

function getActiveAppId(windows: AppWindow[], activeWindowId: string | null) {
  if (!activeWindowId) {
    return 'finder';
  }

  return windows.find((window) => window.id === activeWindowId)?.appId ?? 'finder';
}

function maximizedFrame(): WindowFrame {
  const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight;

  return {
    x: maximizedViewportMargin,
    y: menuBarHeight,
    width: Math.max(1, viewportWidth - maximizedViewportMargin * 2),
    height: Math.max(1, viewportHeight - menuBarHeight - dockReserve),
  };
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
