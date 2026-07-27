import {
  Accessibility,
  Battery,
  Bell,
  Bluetooth,
  Check,
  CircleUserRound,
  Clock3,
  Dock,
  Image,
  Info,
  Keyboard,
  LockKeyhole,
  Menu,
  Monitor,
  Moon,
  Mouse,
  Network,
  Palette,
  PanelBottom,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Volume2,
  Wallpaper,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { type CSSProperties, useState } from 'react';
import {
  useSystemStore,
  type AccentColor,
  type AppearanceMode,
  type HighlightColor,
  type IconWidgetStyle,
  type SidebarIconSize,
  type WallpaperId,
} from '../../store/systemStore';
import type { AppDefinition } from '../types';

type PanelId =
  | 'apple-account'
  | 'wifi'
  | 'bluetooth'
  | 'network'
  | 'vpn'
  | 'battery'
  | 'general'
  | 'accessibility'
  | 'appearance'
  | 'menu-bar'
  | 'apple-intelligence'
  | 'desktop-dock'
  | 'displays'
  | 'wallpaper'
  | 'screen-saver'
  | 'notifications'
  | 'focus'
  | 'sound'
  | 'keyboard'
  | 'trackpad'
  | 'mouse'
  | 'privacy-security'
  | 'users-groups'
  | 'time-machine'
  | 'about';

type SettingsCategory = {
  id: PanelId;
  label: string;
  icon: LucideIcon;
};

type SettingsGroup = {
  id: string;
  items: SettingsCategory[];
};

type AccentOption = {
  id: AccentColor;
  label: string;
  value: string;
  soft: string;
};

const settingsGroups: SettingsGroup[] = [
  {
    id: 'account',
    items: [{ id: 'apple-account', label: 'Apple Account', icon: CircleUserRound }],
  },
  {
    id: 'connectivity',
    items: [
      { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
      { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
      { id: 'network', label: 'Network', icon: Network },
      { id: 'vpn', label: 'VPN', icon: LockKeyhole },
      { id: 'battery', label: 'Battery', icon: Battery },
    ],
  },
  {
    id: 'system',
    items: [
      { id: 'general', label: 'General', icon: Settings },
      { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
      { id: 'appearance', label: 'Appearance', icon: Palette },
      { id: 'menu-bar', label: 'Menu Bar', icon: Menu },
      { id: 'apple-intelligence', label: 'Apple Intelligence & Siri', icon: Sparkles },
      { id: 'desktop-dock', label: 'Desktop & Dock', icon: Dock },
      { id: 'displays', label: 'Displays', icon: Monitor },
      { id: 'wallpaper', label: 'Wallpaper', icon: Wallpaper },
      { id: 'screen-saver', label: 'Screen Saver', icon: Image },
    ],
  },
  {
    id: 'personal',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'focus', label: 'Focus', icon: Moon },
      { id: 'sound', label: 'Sound', icon: Volume2 },
    ],
  },
  {
    id: 'input',
    items: [
      { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
      { id: 'trackpad', label: 'Trackpad', icon: PanelBottom },
      { id: 'mouse', label: 'Mouse', icon: Mouse },
    ],
  },
  {
    id: 'security',
    items: [
      { id: 'privacy-security', label: 'Privacy & Security', icon: ShieldCheck },
      { id: 'users-groups', label: 'Users & Groups', icon: UsersRound },
      { id: 'time-machine', label: 'Time Machine', icon: Clock3 },
      { id: 'about', label: 'About This Mac', icon: Info },
    ],
  },
];

const settingsCategories = settingsGroups.flatMap((group) => group.items);

const appearanceOptions: Array<{ id: AppearanceMode; label: string; description: string }> = [
  { id: 'light', label: 'Light', description: 'Bright controls and translucent white glass.' },
  { id: 'dark', label: 'Dark', description: 'Dark chrome for menus, windows, and panels.' },
  { id: 'auto', label: 'Auto', description: 'Follows the browser system color scheme.' },
];

const accentOptions: AccentOption[] = [
  { id: 'blue', label: 'Blue', value: '#0a84ff', soft: 'rgba(10,132,255,0.18)' },
  { id: 'purple', label: 'Purple', value: '#af52de', soft: 'rgba(175,82,222,0.18)' },
  { id: 'pink', label: 'Pink', value: '#ff2d8f', soft: 'rgba(255,45,143,0.18)' },
  { id: 'red', label: 'Red', value: '#ff453a', soft: 'rgba(255,69,58,0.18)' },
  { id: 'orange', label: 'Orange', value: '#ff9f0a', soft: 'rgba(255,159,10,0.2)' },
  { id: 'yellow', label: 'Yellow', value: '#ffd60a', soft: 'rgba(255,214,10,0.22)' },
  { id: 'green', label: 'Green', value: '#30d158', soft: 'rgba(48,209,88,0.18)' },
  { id: 'gray', label: 'Gray', value: '#8e8e93', soft: 'rgba(142,142,147,0.2)' },
];

const highlightOptions: Array<AccentOption & { id: HighlightColor }> = accentOptions;

const iconWidgetOptions: Array<{ id: IconWidgetStyle; label: string; iconClassName: string; swatchClassName: string }> = [
  {
    id: 'default',
    label: 'Default',
    iconClassName: 'bg-[var(--settings-accent)] text-white',
    swatchClassName: 'bg-[#f5f5f7] [.theme-dark_&]:bg-slate-800',
  },
  {
    id: 'dark',
    label: 'Dark',
    iconClassName: 'bg-[#1d1d1f] text-white [.theme-dark_&]:bg-slate-100 [.theme-dark_&]:text-slate-950',
    swatchClassName: 'bg-[#f5f5f7] [.theme-dark_&]:bg-slate-800',
  },
  {
    id: 'tinted',
    label: 'Tinted',
    iconClassName: 'bg-[var(--settings-accent)] text-white',
    swatchClassName: 'bg-[var(--settings-accent-soft)]',
  },
  {
    id: 'clear',
    label: 'Clear',
    iconClassName: 'bg-white/45 text-white shadow-inner ring-white/70 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/20',
    swatchClassName: 'bg-[#f5f5f7] [.theme-dark_&]:bg-slate-800',
  },
];

const sidebarSizeOptions: Array<{ id: SidebarIconSize; label: string }> = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];

const wallpapers: Array<{ id: WallpaperId; label: string; className: string }> = [
  { id: 'tahoe', label: 'Tahoe Lake', className: 'bg-[linear-gradient(145deg,#dff8ff_0%,#6cc9ff_35%,#1f6fba_68%,#061d52_100%)]' },
  { id: 'aurora', label: 'Aurora', className: 'bg-[linear-gradient(145deg,#172554_0%,#0f766e_42%,#a7f3d0_68%,#f0fdfa_100%)]' },
  { id: 'dawn', label: 'Dawn Ridge', className: 'bg-[linear-gradient(145deg,#fff7ed_0%,#fbbf24_36%,#f97316_60%,#7c2d12_100%)]' },
];

function getColorOption(colorId: AccentColor) {
  return accentOptions.find((option) => option.id === colorId) ?? accentOptions[0];
}

function getSidebarIconSize(sidebarIconSize: SidebarIconSize) {
  if (sidebarIconSize === 'small') {
    return 15;
  }

  if (sidebarIconSize === 'large') {
    return 21;
  }

  return 17;
}

function SettingsApp() {
  const [activePanel, setActivePanel] = useState<PanelId>('appearance');
  const appearanceMode = useSystemStore((state) => state.appearanceMode);
  const theme = useSystemStore((state) => state.theme);
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const accentColor = useSystemStore((state) => state.accentColor);
  const highlightColor = useSystemStore((state) => state.highlightColor);
  const iconWidgetStyle = useSystemStore((state) => state.iconWidgetStyle);
  const sidebarIconSize = useSystemStore((state) => state.sidebarIconSize);
  const setAppearanceMode = useSystemStore((state) => state.setAppearanceMode);
  const setWallpaper = useSystemStore((state) => state.setWallpaper);
  const setAccentColor = useSystemStore((state) => state.setAccentColor);
  const setHighlightColor = useSystemStore((state) => state.setHighlightColor);
  const setIconWidgetStyle = useSystemStore((state) => state.setIconWidgetStyle);
  const setSidebarIconSize = useSystemStore((state) => state.setSidebarIconSize);
  const selectedAccent = getColorOption(accentColor);
  const activeCategory = settingsCategories.find((category) => category.id === activePanel) ?? settingsCategories[0];
  const sidebarIconPx = getSidebarIconSize(sidebarIconSize);
  const settingsStyle = {
    '--settings-accent': selectedAccent.value,
    '--settings-accent-soft': selectedAccent.soft,
  } as CSSProperties;

  return (
    <div
      className="flex h-full min-h-0 overflow-hidden bg-[#f5f5f7]/95 text-[#1d1d1f] antialiased [font-optical-sizing:auto] [.theme-dark_&]:bg-slate-950/70 [.theme-dark_&]:text-slate-100"
      style={settingsStyle}
    >
      <aside className="flex w-[232px] shrink-0 flex-col border-r border-black/[0.07] bg-white/62 px-3 py-3 backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/42">
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-white text-[#424245] shadow-[0_1px_2px_rgba(0,0,0,.06),0_8px_24px_rgba(0,0,0,.07)] ring-1 ring-black/[0.06] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:ring-white/10">
            <Settings size={18} strokeWidth={1.8} />
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.01em]">System Settings</span>
        </div>

        <label className="mb-3 flex h-8 items-center gap-2 rounded-[9px] bg-black/[0.055] px-3 text-[12px] text-[#86868b] ring-1 ring-black/[0.03] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-400 [.theme-dark_&]:ring-white/10">
          <Search size={14} strokeWidth={1.8} />
          <input
            aria-label="Search settings"
            className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#aeaeb2] [.theme-dark_&]:placeholder:text-slate-500"
            placeholder="Search"
            type="search"
          />
        </label>

        <nav className="min-h-0 flex-1 overflow-y-auto pr-1" aria-label="Settings categories">
          {settingsGroups.map((group, groupIndex) => (
            <div key={group.id} className={groupIndex === 0 ? 'pb-2' : 'border-t border-black/[0.07] py-2 [.theme-dark_&]:border-white/10'}>
              <div className="space-y-0.5">
                {group.items.map((panel) => {
                  const Icon = panel.icon;
                  const isActive = activePanel === panel.id;

                  return (
                    <button
                      key={panel.id}
                      type="button"
                      className={`flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-[13px] outline-none transition ${
                        isActive
                          ? 'font-medium text-[#1d1d1f] shadow-sm [.theme-dark_&]:text-white'
                          : 'text-[#424245] hover:bg-black/[0.045] focus-visible:bg-black/[0.06] [.theme-dark_&]:text-slate-300 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:focus-visible:bg-white/12'
                      }`}
                      style={isActive ? { backgroundColor: selectedAccent.soft } : undefined}
                      onClick={() => setActivePanel(panel.id)}
                    >
                      <Icon
                        className={isActive ? 'text-[var(--settings-accent)]' : 'text-[#6e6e73] [.theme-dark_&]:text-slate-400'}
                        size={sidebarIconPx}
                        strokeWidth={1.85}
                      />
                      <span className="truncate">{panel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 overflow-auto px-5 py-5">
        {activePanel === 'appearance' ? (
          <AppearancePanel
            accentColor={accentColor}
            appearanceMode={appearanceMode}
            highlightColor={highlightColor}
            iconWidgetStyle={iconWidgetStyle}
            setAccentColor={setAccentColor}
            setAppearanceMode={setAppearanceMode}
            setHighlightColor={setHighlightColor}
            setIconWidgetStyle={setIconWidgetStyle}
            setSidebarIconSize={setSidebarIconSize}
            sidebarIconSize={sidebarIconSize}
            theme={theme}
          />
        ) : null}

        {activePanel === 'wallpaper' ? <WallpaperPanel setWallpaper={setWallpaper} wallpaperId={wallpaperId} /> : null}

        {activePanel === 'about' ? <AboutPanel /> : null}

        {activePanel !== 'appearance' && activePanel !== 'wallpaper' && activePanel !== 'about' ? <ComingSoonPanel category={activeCategory} /> : null}
      </section>
    </div>
  );
}

function AppearancePanel({
  accentColor,
  appearanceMode,
  highlightColor,
  iconWidgetStyle,
  setAccentColor,
  setAppearanceMode,
  setHighlightColor,
  setIconWidgetStyle,
  setSidebarIconSize,
  sidebarIconSize,
  theme,
}: {
  accentColor: AccentColor;
  appearanceMode: AppearanceMode;
  highlightColor: HighlightColor;
  iconWidgetStyle: IconWidgetStyle;
  setAccentColor: (accentColor: AccentColor) => void;
  setAppearanceMode: (appearanceMode: AppearanceMode) => void;
  setHighlightColor: (highlightColor: HighlightColor) => void;
  setIconWidgetStyle: (iconWidgetStyle: IconWidgetStyle) => void;
  setSidebarIconSize: (sidebarIconSize: SidebarIconSize) => void;
  sidebarIconSize: SidebarIconSize;
  theme: string;
}) {
  return (
    <div className="mx-auto max-w-[720px]">
      <header>
        <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em]">Appearance</h2>
        <p className="mt-1 text-[13px] leading-5 text-[#6e6e73] [.theme-dark_&]:text-slate-400">Current global theme: {theme}</p>
      </header>

      <div className="mt-5 space-y-5">
        <section>
          <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-slate-900/92 [.theme-dark_&]:ring-white/10">
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {appearanceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`min-h-[124px] rounded-[14px] p-3 text-left text-[#1d1d1f] outline-none ring-1 transition ${
                    appearanceMode === option.id
                      ? 'bg-[var(--settings-accent-soft)] ring-[var(--settings-accent)]'
                      : 'bg-[#fbfbfd] ring-black/[0.06] hover:bg-black/[0.025] focus-visible:ring-[var(--settings-accent)] [.theme-dark_&]:bg-white/5 [.theme-dark_&]:ring-white/10 [.theme-dark_&]:hover:bg-white/10'
                  }`}
                  onClick={() => setAppearanceMode(option.id)}
                >
                  <span className="mb-3 flex h-12 overflow-hidden rounded-[10px] border border-black/[0.06] bg-gradient-to-r from-white via-slate-200 to-slate-900 [.theme-dark_&]:border-white/10" />
                  <span className="flex items-center justify-between text-[15px] font-semibold tracking-[-0.01em]">
                    {option.label}
                    {appearanceMode === option.id ? <Check className="text-[var(--settings-accent)]" size={16} /> : null}
                  </span>
                  <span className="mt-1 block text-[12px] leading-5 text-[#6e6e73]">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <ControlGroup label="Accent Color">
          <ColorPicker activeColor={accentColor} options={accentOptions} onChange={setAccentColor} />
        </ControlGroup>

        <ControlGroup label="Highlight Color">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <ColorPicker activeColor={highlightColor} options={highlightOptions} onChange={setHighlightColor} />
            <span className="hidden text-[12px] text-[#86868b] [.theme-dark_&]:text-slate-500 sm:inline">Used for text selections</span>
          </div>
        </ControlGroup>

        <section>
          <SectionLabel>Icon &amp; Widget Style</SectionLabel>
          <div className="grid gap-3 rounded-[18px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-slate-900/92 [.theme-dark_&]:ring-white/10 sm:grid-cols-4">
            {iconWidgetOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-[14px] text-[#1d1d1f] outline-none ring-1 transition ${
                  iconWidgetStyle === option.id
                    ? 'bg-[var(--settings-accent-soft)] ring-[var(--settings-accent)]'
                    : 'bg-transparent ring-transparent hover:bg-black/[0.035] focus-visible:ring-[var(--settings-accent)] [.theme-dark_&]:hover:bg-white/10'
                }`}
                onClick={() => setIconWidgetStyle(option.id)}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-[12px] ring-1 ring-black/[0.05] ${option.swatchClassName}`}>
                  <span className={`grid h-8 w-8 place-items-center rounded-[8px] shadow-sm ring-1 ring-black/[0.08] ${option.iconClassName}`}>
                    <Sparkles size={17} strokeWidth={1.8} />
                  </span>
                </span>
                <span className="text-[12.5px] font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </section>

        <ControlGroup label="Sidebar Icon Size">
          <div className="flex rounded-full bg-black/[0.055] p-0.5 [.theme-dark_&]:bg-white/10">
            {sidebarSizeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`h-8 min-w-[74px] rounded-full px-3 text-[12px] font-medium outline-none transition ${
                  sidebarIconSize === option.id
                    ? 'bg-white text-[#1d1d1f] shadow-sm [.theme-dark_&]:bg-slate-100 [.theme-dark_&]:text-slate-950'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] focus-visible:text-[#1d1d1f] [.theme-dark_&]:text-slate-400 [.theme-dark_&]:hover:text-white [.theme-dark_&]:focus-visible:text-white'
                }`}
                onClick={() => setSidebarIconSize(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </ControlGroup>
      </div>
    </div>
  );
}

function ColorPicker({
  activeColor,
  onChange,
  options,
}: {
  activeColor: AccentColor;
  onChange: (color: AccentColor) => void;
  options: AccentOption[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-label={option.label}
          className="grid h-8 w-8 place-items-center rounded-full outline-none ring-1 ring-black/[0.08] transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--settings-accent)] [.theme-dark_&]:ring-white/10"
          style={{ backgroundColor: option.value }}
          onClick={() => onChange(option.id)}
        >
          {activeColor === option.id ? <Check className="text-white drop-shadow" size={17} strokeWidth={2.4} /> : null}
        </button>
      ))}
    </div>
  );
}

function ControlGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex min-h-[56px] items-center rounded-[18px] bg-white px-4 shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-slate-900/92 [.theme-dark_&]:ring-white/10">
        {children}
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase text-[#6e6e73] [.theme-dark_&]:text-slate-400">{children}</h3>;
}

function WallpaperPanel({ setWallpaper, wallpaperId }: { setWallpaper: (wallpaperId: WallpaperId) => void; wallpaperId: WallpaperId }) {
  return (
    <div className="mx-auto max-w-[720px]">
      <header>
        <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em]">Wallpaper</h2>
        <p className="mt-1 text-[13px] leading-5 text-[#6e6e73] [.theme-dark_&]:text-slate-400">Choose a desktop background for this session.</p>
      </header>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {wallpapers.map((wallpaper) => (
          <button
            key={wallpaper.id}
            type="button"
            className={`rounded-[18px] bg-white p-2 text-left outline-none shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 transition [.theme-dark_&]:bg-slate-900/92 ${
              wallpaperId === wallpaper.id
                ? 'ring-[var(--settings-accent)]'
                : 'ring-black/[0.07] hover:-translate-y-0.5 focus-visible:ring-[var(--settings-accent)] [.theme-dark_&]:ring-white/10'
            }`}
            onClick={() => setWallpaper(wallpaper.id)}
          >
            <span className={`block aspect-[4/3] rounded-[14px] shadow-inner ${wallpaper.className}`} />
            <span className="mt-2 flex items-center justify-between px-1 pb-1 text-[13px] font-semibold">
              {wallpaper.label}
              {wallpaperId === wallpaper.id ? <Check className="text-[var(--settings-accent)]" size={16} /> : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="mx-auto max-w-[720px]">
      <header>
        <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em]">About This Mac</h2>
        <p className="mt-1 text-[13px] leading-5 text-[#6e6e73] [.theme-dark_&]:text-slate-400">System overview for the simulator.</p>
      </header>
      <div className="mt-5 flex items-start gap-5 rounded-[18px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-slate-900/92 [.theme-dark_&]:ring-white/10">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[18px] bg-[#f5f5f7] text-[#424245] ring-1 ring-black/[0.06] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:ring-white/10">
          <Monitor size={42} strokeWidth={1.65} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Mac27 Simulator</h3>
          <dl className="mt-3 grid gap-x-5 gap-y-2 text-[13px] sm:grid-cols-[120px_1fr]">
            <dt className="text-[#6e6e73] [.theme-dark_&]:text-slate-400">Model</dt>
            <dd>MacBook Pro 14-inch, 2026</dd>
            <dt className="text-[#6e6e73] [.theme-dark_&]:text-slate-400">Chip</dt>
            <dd>Apple M4 Pro mock</dd>
            <dt className="text-[#6e6e73] [.theme-dark_&]:text-slate-400">Memory</dt>
            <dd>36 GB unified memory</dd>
            <dt className="text-[#6e6e73] [.theme-dark_&]:text-slate-400">Serial Number</dt>
            <dd>MAC27-T4-20260723</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

function ComingSoonPanel({ category }: { category: SettingsCategory }) {
  const Icon = category.icon;

  return (
    <div className="mx-auto flex min-h-[380px] max-w-[720px] items-center justify-center">
      <div className="w-full max-w-[460px] rounded-[18px] bg-white p-8 text-center text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-[16px] bg-[var(--settings-accent-soft)] text-[var(--settings-accent)]">
          <Icon size={26} strokeWidth={1.8} />
        </span>
        <h2 className="mt-4 text-[24px] font-bold tracking-[-0.03em]">{category.label}</h2>
        <p className="mt-2 text-[13px] leading-6 text-[#6e6e73]">
          即将推出 · Coming Soon. This category is represented in the sidebar and will receive its full controls in a later pass.
        </p>
      </div>
    </div>
  );
}

export const settingsApp: AppDefinition = {
  id: 'settings',
  title: 'Settings',
  icon: Settings,
  iconGradient: 'from-slate-200 via-slate-400 to-slate-600',
  defaultWindow: {
    width: 780,
    height: 600,
    minWidth: 640,
    minHeight: 460,
  },
  Component: SettingsApp,
};
