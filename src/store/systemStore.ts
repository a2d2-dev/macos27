import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type MenuDropdownId = 'apple' | 'app' | 'file' | 'edit' | 'view' | 'go' | 'window' | 'help';
export type ControlCenterToggleId = 'wifi' | 'bluetooth' | 'airdrop' | 'focus' | 'stageManager' | 'screenMirroring' | 'nightShift';

type ControlCenterToggles = Record<ControlCenterToggleId, boolean>;

type SystemState = {
  theme: ThemeMode;
  now: Date;
  isControlCenterOpen: boolean;
  openMenuId: MenuDropdownId | null;
  brightness: number;
  volume: number;
  batteryLevel: number;
  controlCenterToggles: ControlCenterToggles;
  setNow: (now: Date) => void;
  toggleTheme: () => void;
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
  toggleMenu: (menuId: MenuDropdownId) => void;
  closeMenus: () => void;
  setBrightness: (brightness: number) => void;
  setVolume: (volume: number) => void;
  toggleControlCenterSetting: (settingId: ControlCenterToggleId) => void;
};

export const useSystemStore = create<SystemState>((set) => ({
  theme: 'light',
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
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
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
