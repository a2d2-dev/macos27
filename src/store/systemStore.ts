import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type AppearanceMode = ThemeMode | 'auto';
export type WallpaperId = 'tahoe' | 'aurora' | 'dawn';
export type AccentColor = 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'gray';
export type HighlightColor = AccentColor;
export type IconWidgetStyle = 'default' | 'dark' | 'tinted' | 'clear';
export type SidebarIconSize = 'small' | 'medium' | 'large';
export type MenuDropdownId = 'apple' | 'app' | 'file' | 'edit' | 'view' | 'go' | 'window' | 'help';
export type ControlCenterToggleId = 'wifi' | 'bluetooth' | 'airdrop' | 'focus' | 'stageManager' | 'screenMirroring' | 'nightShift';

type ControlCenterToggles = Record<ControlCenterToggleId, boolean>;

const systemThemeQuery = '(prefers-color-scheme: dark)';
let unsubscribeSystemTheme: (() => void) | null = null;

type SystemState = {
  theme: ThemeMode;
  appearanceMode: AppearanceMode;
  wallpaperId: WallpaperId;
  accentColor: AccentColor;
  highlightColor: HighlightColor;
  iconWidgetStyle: IconWidgetStyle;
  sidebarIconSize: SidebarIconSize;
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
  setAccentColor: (accentColor: AccentColor) => void;
  setHighlightColor: (highlightColor: HighlightColor) => void;
  setIconWidgetStyle: (iconWidgetStyle: IconWidgetStyle) => void;
  setSidebarIconSize: (sidebarIconSize: SidebarIconSize) => void;
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

  return globalThis.matchMedia(systemThemeQuery).matches ? 'dark' : 'light';
}

function stopFollowingSystemTheme() {
  unsubscribeSystemTheme?.();
  unsubscribeSystemTheme = null;
}

function followSystemTheme(setTheme: (theme: ThemeMode) => void) {
  stopFollowingSystemTheme();

  if (typeof globalThis.matchMedia !== 'function') {
    return;
  }

  const mediaQuery = globalThis.matchMedia(systemThemeQuery);
  const handleChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light');

  mediaQuery.addEventListener('change', handleChange);
  unsubscribeSystemTheme = () => mediaQuery.removeEventListener('change', handleChange);
}

export const useSystemStore = create<SystemState>((set) => ({
  theme: 'light',
  appearanceMode: 'light',
  wallpaperId: 'tahoe',
  accentColor: 'blue',
  highlightColor: 'blue',
  iconWidgetStyle: 'default',
  sidebarIconSize: 'medium',
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
  toggleTheme: () => {
    stopFollowingSystemTheme();
    set((state) => {
      const theme = state.theme === 'light' ? 'dark' : 'light';
      return { theme, appearanceMode: theme };
    });
  },
  setAppearanceMode: (appearanceMode) => {
    stopFollowingSystemTheme();
    set({ appearanceMode, theme: resolveTheme(appearanceMode) });

    if (appearanceMode === 'auto') {
      followSystemTheme((theme) =>
        set((state) => {
          if (state.appearanceMode !== 'auto') {
            return {};
          }

          return { theme };
        }),
      );
    }
  },
  setWallpaper: (wallpaperId) => set({ wallpaperId }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setHighlightColor: (highlightColor) => set({ highlightColor }),
  setIconWidgetStyle: (iconWidgetStyle) => set({ iconWidgetStyle }),
  setSidebarIconSize: (sidebarIconSize) => set({ sidebarIconSize }),
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
