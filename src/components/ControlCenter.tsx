import type { LucideIcon } from 'lucide-react';
import {
  Airplay,
  BatteryFull,
  Bluetooth,
  CircleDot,
  Moon,
  PanelsTopLeft,
  Radio,
  ScreenShare,
  SunMedium,
  Volume2,
  Wifi,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ControlCenterToggleId } from '../store/systemStore';
import { useSystemStore } from '../store/systemStore';

type ToggleTileConfig = {
  id: ControlCenterToggleId;
  title: string;
  subtitle: (enabled: boolean) => string;
  icon: LucideIcon;
};

const toggleTiles: ToggleTileConfig[] = [
  { id: 'wifi', title: 'Wi-Fi', subtitle: (enabled) => (enabled ? 'HomeNet-5G' : 'Off'), icon: Wifi },
  { id: 'bluetooth', title: 'Bluetooth', subtitle: (enabled) => (enabled ? 'On' : 'Off'), icon: Bluetooth },
  { id: 'airdrop', title: 'AirDrop', subtitle: (enabled) => (enabled ? 'Contacts Only' : 'Receiving Off'), icon: Radio },
  { id: 'focus', title: 'Focus', subtitle: (enabled) => (enabled ? 'On' : 'Off'), icon: Moon },
  { id: 'stageManager', title: 'Stage Manager', subtitle: (enabled) => (enabled ? 'On' : 'Off'), icon: PanelsTopLeft },
  { id: 'screenMirroring', title: 'Screen Mirroring', subtitle: (enabled) => (enabled ? 'Living Room' : 'AirPlay'), icon: ScreenShare },
];

function rangeBackground(value: number) {
  return `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.95) ${value}%, rgba(148,163,184,0.34) ${value}%, rgba(148,163,184,0.34) 100%)`;
}

const moduleClass = 'rounded-[18px] bg-white/[0.22] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] ring-1 ring-white/25 backdrop-blur-[18px] [.theme-dark_&]:bg-white/[0.08] [.theme-dark_&]:ring-white/10';
const moduleHoverClass = 'hover:bg-white/[0.32] [.theme-dark_&]:hover:bg-white/[0.12]';

function ToggleTile({ tile }: { tile: ToggleTileConfig }) {
  const enabled = useSystemStore((state) => state.controlCenterToggles[tile.id]);
  const toggle = useSystemStore((state) => state.toggleControlCenterSetting);
  const Icon = tile.icon;

  return (
    <button
      type="button"
      className={`flex h-[60px] min-w-0 items-center gap-3 ${moduleClass} px-3 text-left outline-none transition ${
        enabled ? 'bg-white/[0.42] shadow-sm [.theme-dark_&]:bg-white/[0.14]' : moduleHoverClass
      } focus-visible:ring-2 focus-visible:ring-white/70`}
      aria-pressed={enabled}
      onClick={() => toggle(tile.id)}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${enabled ? 'bg-[#0a84ff] text-white' : 'bg-black/10 text-[var(--text-secondary)]'}`}>
        <Icon size={16} strokeWidth={2.25} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium leading-4">{tile.title}</span>
        <span className="block truncate text-[11px] leading-4 text-[var(--text-secondary)]">{tile.subtitle(enabled)}</span>
      </span>
    </button>
  );
}

function ActionTile({
  label,
  active,
  icon: Icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex h-10 items-center gap-3 rounded-[16px] px-3 text-left text-[13px] outline-none transition ${
        active ? 'bg-white/[0.42] shadow-sm [.theme-dark_&]:bg-white/[0.14]' : `bg-white/[0.18] ${moduleHoverClass}`
      } focus-visible:ring-2 focus-visible:ring-white/70`}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className={`grid h-7 w-7 place-items-center rounded-full ${active ? 'bg-[#0a84ff] text-white' : 'bg-black/10 text-[var(--text-secondary)]'}`}>
        <Icon size={14} strokeWidth={2.25} />
      </span>
      <span>{label}</span>
    </button>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="grid h-10 w-[54px] shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      aria-label={label}
      aria-pressed={checked}
      onClick={onChange}
    >
      <span className={`relative h-[26px] w-[46px] rounded-full transition ${checked ? 'bg-[#34c759]' : 'bg-black/15 [.theme-dark_&]:bg-white/18'}`}>
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.24)] transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
    </button>
  );
}

export function ControlCenter() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = useSystemStore((state) => state.isControlCenterOpen);
  const closeControlCenter = useSystemStore((state) => state.closeControlCenter);
  const theme = useSystemStore((state) => state.theme);
  const toggleTheme = useSystemStore((state) => state.toggleTheme);
  const brightness = useSystemStore((state) => state.brightness);
  const setBrightness = useSystemStore((state) => state.setBrightness);
  const volume = useSystemStore((state) => state.volume);
  const setVolume = useSystemStore((state) => state.setVolume);
  const nightShift = useSystemStore((state) => state.controlCenterToggles.nightShift);
  const lowPowerMode = useSystemStore((state) => state.controlCenterToggles.lowPowerMode);
  const toggleSetting = useSystemStore((state) => state.toggleControlCenterSetting);
  const batteryLevel = useSystemStore((state) => state.batteryLevel);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;

      if (target?.closest('[data-control-center-trigger="true"]')) {
        return;
      }

      if (panelRef.current && target && !panelRef.current.contains(target)) {
        closeControlCenter();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeControlCenter();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeControlCenter, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="glass-surface-strong fixed right-3 top-9 z-[10001] flex h-[600px] w-[320px] flex-col overflow-hidden rounded-[22px] p-3 text-[var(--text-primary)]"
      role="dialog"
      aria-label="Control Center"
    >
      <div className="grid grid-cols-2 gap-2">
        {toggleTiles.map((tile) => (
          <ToggleTile key={tile.id} tile={tile} />
        ))}
      </div>

      <section className={`mt-2 ${moduleClass} p-2.5`} aria-label="Display controls">
        <h2 className="mb-2 text-[13px] font-semibold">Display</h2>
        <label className="flex items-center gap-3">
          <SunMedium size={16} className="shrink-0 text-[var(--text-secondary)]" />
          <input
            type="range"
            min="15"
            max="100"
            value={brightness}
            aria-label="Display brightness"
            className="h-5 w-full cursor-pointer rounded-full bg-white/40 accent-[#0a84ff]"
            style={{ background: rangeBackground(brightness) }}
            onChange={(event) => setBrightness(Number(event.currentTarget.value))}
          />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ActionTile label="Dark Mode" active={theme === 'dark'} icon={Moon} onClick={toggleTheme} />
          <ActionTile label="Night Shift" active={nightShift} icon={CircleDot} onClick={() => toggleSetting('nightShift')} />
        </div>
      </section>

      <section className={`mt-2 ${moduleClass} p-2.5`} aria-label="Sound controls">
        <h2 className="mb-2 text-[13px] font-semibold">Sound</h2>
        <label className="flex items-center gap-3">
          <Volume2 size={16} className="shrink-0 text-[var(--text-secondary)]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            aria-label="Output volume"
            className="h-5 w-full cursor-pointer rounded-full bg-white/40 accent-[#0a84ff]"
            style={{ background: rangeBackground(volume) }}
            onChange={(event) => setVolume(Number(event.currentTarget.value))}
          />
        </label>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">MacBook Pro Speakers</p>
      </section>

      <section className={`mt-2 ${moduleClass} p-2.5`} aria-label="Battery status">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/35 text-emerald-500 ring-1 ring-white/25 [.theme-dark_&]:bg-white/10">
            <BatteryFull size={19} />
          </span>
          <div>
            <p className="text-[14px] font-semibold">{batteryLevel}%</p>
            <p className="text-[11px] text-[var(--text-secondary)]">Battery</p>
          </div>
          <Airplay size={16} className="ml-auto text-[var(--text-secondary)]" aria-hidden="true" />
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-white/20 pt-2 [.theme-dark_&]:border-white/10">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium">Low Power Mode</p>
            <p className="text-[11px] text-[var(--text-secondary)]">{lowPowerMode ? 'Reducing energy use' : 'Off'}</p>
          </div>
          <Switch
            checked={lowPowerMode}
            label="Low Power Mode"
            onChange={() => toggleSetting('lowPowerMode')}
          />
        </div>
      </section>

      <button
        type="button"
        className={`mt-auto flex h-10 shrink-0 items-center justify-center rounded-[16px] bg-white/[0.18] text-[13px] font-medium outline-none ring-1 ring-white/20 transition ${moduleHoverClass} focus-visible:ring-2 focus-visible:ring-white/70 [.theme-dark_&]:bg-white/[0.07]`}
      >
        Edit Controls…
      </button>
    </div>
  );
}
