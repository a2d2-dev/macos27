import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type AppearanceMode = ThemeMode | 'auto';
export type WallpaperId = 'tahoe' | 'aurora' | 'dawn';
export type MenuDropdownId = 'apple' | 'app' | 'file' | 'edit' | 'view' | 'go' | 'window' | 'help';
export type ControlCenterToggleId = 'wifi' | 'bluetooth' | 'airdrop' | 'focus' | 'stageManager' | 'screenMirroring' | 'nightShift';

type ControlCenterToggles = Record<ControlCenterToggleId, boolean>;

type SystemState = {
  theme: ThemeMode;
  appearanceMode: AppearanceMode;
  wallpaperId: WallpaperId;
  now: Date;
  isControlCenterOpen: boolean;
  openMenuId: MenuDropdownId | null;
  brightness: number;
  volume: number;
  batteryLevel: number;
  controlCenterToggles: ControlCenterToggles;
  setNow: (now: Date) => void;
  toggleTheme: () => void;
  setAppearanceMode: (appearanceMode: AppearanceMode) => void;
  setWallpaper: (wallpaperId: WallpaperId) => void;
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
  toggleMenu: (menuId: MenuDropdownId) => void;
  closeMenus: () => void;
  setBrightness: (brightness: number) => void;
  setVolume: (volume: number) => void;
  toggleControlCenterSetting: (settingId: ControlCenterToggleId) => void;
};

function resolveTheme(appearanceMode: AppearanceMode): ThemeMode {
  if (appearanceMode !== 'auto') {
    return appearanceMode;
  }

  if (typeof globalThis.matchMedia !== 'function') {
    return 'light';
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useSystemStore = create<SystemState>((set) => ({
  theme: 'light',
  appearanceMode: 'light',
  wallpaperId: 'tahoe',
  now: new Date(),
  isControlCenterOpen: false,
  openMenuId: null,
  brightness: 82,
  volume: 68,
  batteryLevel: 84,
  controlCenterToggles: {
    wifi: true,
    bluetooth: true,
    airdrop: false,
    focus: false,
    stageManager: false,
    screenMirroring: false,
    nightShift: false,
  },
  setNow: (now) => set({ now }),
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'light' ? 'dark' : 'light';
      return { theme, appearanceMode: theme };
    }),
  setAppearanceMode: (appearanceMode) => set({ appearanceMode, theme: resolveTheme(appearanceMode) }),
  setWallpaper: (wallpaperId) => set({ wallpaperId }),
  toggleControlCenter: () => set((state) => ({ isControlCenterOpen: !state.isControlCenterOpen, openMenuId: null })),
  closeControlCenter: () => set({ isControlCenterOpen: false }),
  toggleMenu: (menuId) =>
    set((state) => ({
      openMenuId: state.openMenuId === menuId ? null : menuId,
      isControlCenterOpen: false,
    })),
  closeMenus: () => set({ openMenuId: null }),
  setBrightness: (brightness) => set({ brightness: Math.min(100, Math.max(15, brightness)) }),
  setVolume: (volume) => set({ volume: Math.min(100, Math.max(0, volume)) }),
  toggleControlCenterSetting: (settingId) =>
    set((state) => ({
      controlCenterToggles: {
        ...state.controlCenterToggles,
        [settingId]: !state.controlCenterToggles[settingId],
      },
    })),
}));
