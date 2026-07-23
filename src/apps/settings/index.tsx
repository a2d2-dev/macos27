import { Check, Info, Monitor, Settings, SunMoon, Wallpaper } from 'lucide-react';
import { useState } from 'react';
import { useSystemStore, type AppearanceMode, type WallpaperId } from '../../store/systemStore';
import type { AppDefinition } from '../types';

type PanelId = 'appearance' | 'wallpaper' | 'about';

const panels: Array<{ id: PanelId; label: string; icon: typeof SunMoon }> = [
  { id: 'appearance', label: 'Appearance', icon: SunMoon },
  { id: 'wallpaper', label: 'Wallpaper', icon: Wallpaper },
  { id: 'about', label: 'About This Mac', icon: Info },
];

const appearanceOptions: Array<{ id: AppearanceMode; label: string; description: string }> = [
  { id: 'light', label: 'Light', description: 'Bright controls and translucent white glass.' },
  { id: 'dark', label: 'Dark', description: 'Dark chrome for menus, windows, and panels.' },
  { id: 'auto', label: 'Auto', description: 'Follows the browser system color scheme.' },
];

const wallpapers: Array<{ id: WallpaperId; label: string; className: string }> = [
  { id: 'tahoe', label: 'Tahoe Lake', className: 'bg-[linear-gradient(145deg,#dff8ff_0%,#6cc9ff_35%,#1f6fba_68%,#061d52_100%)]' },
  { id: 'aurora', label: 'Aurora', className: 'bg-[linear-gradient(145deg,#172554_0%,#0f766e_42%,#a7f3d0_68%,#f0fdfa_100%)]' },
  { id: 'dawn', label: 'Dawn Ridge', className: 'bg-[linear-gradient(145deg,#fff7ed_0%,#fbbf24_36%,#f97316_60%,#7c2d12_100%)]' },
];

function SettingsApp() {
  const [activePanel, setActivePanel] = useState<PanelId>('appearance');
  const appearanceMode = useSystemStore((state) => state.appearanceMode);
  const theme = useSystemStore((state) => state.theme);
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const setAppearanceMode = useSystemStore((state) => state.setAppearanceMode);
  const setWallpaper = useSystemStore((state) => state.setWallpaper);

  return (
    <div className="flex h-full bg-white/10 text-[var(--text-primary)]">
      <aside className="w-[190px] shrink-0 border-r border-white/25 bg-white/18 p-3 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-slate-100 to-slate-500 text-slate-700 shadow-sm">
            <Settings size={18} />
          </span>
          System Settings
        </div>
        <nav className="space-y-1" aria-label="Settings categories">
          {panels.map((panel) => {
            const Icon = panel.icon;
            const isActive = activePanel === panel.id;

            return (
              <button
                key={panel.id}
                type="button"
                className={`flex h-9 w-full items-center gap-2 rounded-lg px-2 text-left text-sm outline-none transition ${
                  isActive ? 'bg-white/40 shadow-sm' : 'hover:bg-white/22 focus-visible:bg-white/28'
                }`}
                onClick={() => setActivePanel(panel.id)}
              >
                <Icon size={17} />
                <span className="truncate">{panel.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 overflow-auto p-5">
        {activePanel === 'appearance' ? (
          <div>
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Current global theme: {theme}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {appearanceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`min-h-[128px] rounded-[14px] border p-3 text-left outline-none transition ${
                    appearanceMode === option.id ? 'border-white/80 bg-white/38 shadow-lg' : 'border-white/28 bg-white/16 hover:bg-white/24'
                  }`}
                  onClick={() => setAppearanceMode(option.id)}
                >
                  <span className="mb-3 flex h-12 rounded-[10px] border border-white/30 bg-gradient-to-r from-white via-slate-200 to-slate-900" />
                  <span className="flex items-center justify-between font-semibold">
                    {option.label}
                    {appearanceMode === option.id ? <Check size={16} /> : null}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--text-secondary)]">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === 'wallpaper' ? (
          <div>
            <h2 className="text-xl font-semibold">Wallpaper</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Choose a desktop background for this session.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  type="button"
                  className={`rounded-[14px] border p-2 text-left outline-none transition ${
                    wallpaperId === wallpaper.id ? 'border-white/80 bg-white/38 shadow-lg' : 'border-white/28 bg-white/16 hover:bg-white/24'
                  }`}
                  onClick={() => setWallpaper(wallpaper.id)}
                >
                  <span className={`block aspect-[4/3] rounded-[10px] shadow-inner ${wallpaper.className}`} />
                  <span className="mt-2 flex items-center justify-between text-sm font-semibold">
                    {wallpaper.label}
                    {wallpaperId === wallpaper.id ? <Check size={16} /> : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === 'about' ? (
          <div>
            <h2 className="text-xl font-semibold">About This Mac</h2>
            <div className="mt-5 flex items-start gap-5 rounded-[16px] border border-white/30 bg-white/18 p-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-slate-100 via-slate-300 to-slate-700 text-slate-800 shadow-lg">
                <Monitor size={42} />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">Mac27 Simulator</h3>
                <dl className="mt-3 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-[120px_1fr]">
                  <dt className="text-[var(--text-secondary)]">Model</dt>
                  <dd>MacBook Pro 14-inch, 2026</dd>
                  <dt className="text-[var(--text-secondary)]">Chip</dt>
                  <dd>Apple M4 Pro mock</dd>
                  <dt className="text-[var(--text-secondary)]">Memory</dt>
                  <dd>36 GB unified memory</dd>
                  <dt className="text-[var(--text-secondary)]">Serial Number</dt>
                  <dd>MAC27-T4-20260723</dd>
                </dl>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export const settingsApp: AppDefinition = {
  id: 'settings',
  title: 'Settings',
  icon: Settings,
  iconGradient: 'from-slate-200 via-slate-400 to-slate-600',
  defaultWindow: {
    width: 760,
    height: 500,
    minWidth: 560,
    minHeight: 390,
  },
  Component: SettingsApp,
};
