import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

type SystemState = {
  theme: ThemeMode;
  now: Date;
  isControlCenterOpen: boolean;
  setNow: (now: Date) => void;
  toggleTheme: () => void;
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
};

export const useSystemStore = create<SystemState>((set) => ({
  theme: 'light',
  now: new Date(),
  isControlCenterOpen: false,
  setNow: (now) => set({ now }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleControlCenter: () => set((state) => ({ isControlCenterOpen: !state.isControlCenterOpen })),
  closeControlCenter: () => set({ isControlCenterOpen: false }),
}));
