import { useMemo, useState } from 'react';
import {
  Album,
  Clock3,
  Disc3,
  ListMusic,
  Maximize2,
  Mic2,
  Music,
  Pause,
  Play,
  Radio,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  UserRound,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppDefinition } from '../types';

type MusicSectionId =
  | 'listen-now'
  | 'browse'
  | 'radio'
  | 'recently-added'
  | 'artists'
  | 'albums'
  | 'songs'
  | 'favorites-mix'
  | 'focus'
  | 'evening-drive';

type SidebarItem = {
  id: MusicSectionId;
  label: string;
  icon: LucideIcon;
  count?: number;
};

type SidebarGroup = {
  label: string;
  actionLabel?: string;
  items: SidebarItem[];
};

type MusicCard = {
  title: string;
  artist: string;
  art: string;
};

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Apple Music',
    items: [
      { id: 'listen-now', label: 'Listen Now', icon: Play },
      { id: 'browse', label: 'Browse', icon: Album },
      { id: 'radio', label: 'Radio', icon: Radio },
    ],
  },
  {
    label: 'Library',
    items: [
      { id: 'recently-added', label: 'Recently Added', icon: Clock3 },
      { id: 'artists', label: 'Artists', icon: UserRound },
      { id: 'albums', label: 'Albums', icon: Disc3 },
      { id: 'songs', label: 'Songs', icon: Music },
    ],
  },
  {
    label: 'Playlists',
    actionLabel: 'Add Playlist',
    items: [
      { id: 'favorites-mix', label: 'Favorites Mix', icon: ListMusic, count: 4 },
      { id: 'focus', label: 'Focus', icon: ListMusic, count: 2 },
      { id: 'evening-drive', label: 'Evening Drive', icon: ListMusic, count: 2 },
    ],
  },
];

const recentlyPlayed: MusicCard[] = [
  {
    title: 'Drift',
    artist: 'Isla Wave',
    art: 'linear-gradient(145deg, #eef2f7 0%, #d8dee8 38%, #8c9aaa 100%)',
  },
  {
    title: 'Blue Note Sessions',
    artist: 'The Meridian Trio',
    art: 'linear-gradient(145deg, #f8fafc 0%, #d9e7f8 40%, #4f7ba8 100%)',
  },
  {
    title: 'Golden Hour',
    artist: 'Cafe Mono',
    art: 'linear-gradient(145deg, #faf7ef 0%, #e2c078 46%, #4b3827 100%)',
  },
  {
    title: 'Neon Skyline - Single',
    artist: 'Vector Fields',
    art: 'linear-gradient(145deg, #f7fbff 0%, #c3d1df 36%, #223041 100%)',
  },
];

const madeForYou: MusicCard[] = [
  {
    title: 'Favorites Mix',
    artist: 'Apple Music',
    art: 'linear-gradient(145deg, #fff5f7 0%, #ff9fba 42%, #c9184a 100%)',
  },
  {
    title: 'Focus',
    artist: 'Instrumental essentials',
    art: 'linear-gradient(145deg, #f7f9fb 0%, #9fb4c7 46%, #35465a 100%)',
  },
  {
    title: 'Evening Drive',
    artist: 'Late day energy',
    art: 'linear-gradient(145deg, #f3f8ff 0%, #85a9d9 42%, #2c3f63 100%)',
  },
];

const contentBySection: Record<
  MusicSectionId,
  {
    title: string;
    subtitle: string;
    primaryHeading: string;
    primaryCards: MusicCard[];
    secondaryHeading: string;
    secondaryCards: MusicCard[];
  }
> = {
  'listen-now': {
    title: 'Listen Now',
    subtitle: 'Your music, right where you left it.',
    primaryHeading: 'Recently Played',
    primaryCards: recentlyPlayed,
    secondaryHeading: 'Made for You',
    secondaryCards: madeForYou,
  },
  browse: {
    title: 'Browse',
    subtitle: 'Fresh releases and essential albums selected for today.',
    primaryHeading: 'New Music',
    primaryCards: recentlyPlayed.slice(1),
    secondaryHeading: 'Editors Picks',
    secondaryCards: madeForYou,
  },
  radio: {
    title: 'Radio',
    subtitle: 'Live stations and hosted shows for every moment.',
    primaryHeading: 'Featured Stations',
    primaryCards: [
      { title: 'Apple Music 1', artist: 'Live worldwide', art: 'linear-gradient(145deg, #f8fbff 0%, #9fd0ff 42%, #0071e3 100%)' },
      { title: 'Apple Music Hits', artist: 'Classic pop', art: 'linear-gradient(145deg, #fbfbfd 0%, #d6d6dc 44%, #6e6e73 100%)' },
      { title: 'Apple Music Chill', artist: 'Low tempo', art: 'linear-gradient(145deg, #f4fbf9 0%, #86d8c7 42%, #1b6a63 100%)' },
    ],
    secondaryHeading: 'Shows',
    secondaryCards: madeForYou,
  },
  'recently-added': {
    title: 'Recently Added',
    subtitle: 'Albums and playlists added to your library.',
    primaryHeading: 'This Week',
    primaryCards: recentlyPlayed,
    secondaryHeading: 'Last Month',
    secondaryCards: madeForYou,
  },
  artists: {
    title: 'Artists',
    subtitle: 'A focused view of artists in your library.',
    primaryHeading: 'Recently Played Artists',
    primaryCards: recentlyPlayed.map((card) => ({ ...card, title: card.artist, artist: 'Artist' })),
    secondaryHeading: 'Recommended',
    secondaryCards: madeForYou.map((card) => ({ ...card, artist: 'Artist radio' })),
  },
  albums: {
    title: 'Albums',
    subtitle: 'Full-length releases saved in your library.',
    primaryHeading: 'Albums',
    primaryCards: recentlyPlayed,
    secondaryHeading: 'Suggested Albums',
    secondaryCards: madeForYou,
  },
  songs: {
    title: 'Songs',
    subtitle: 'Tracks ready for quick playback.',
    primaryHeading: 'Recently Played Songs',
    primaryCards: recentlyPlayed,
    secondaryHeading: 'Top Songs',
    secondaryCards: madeForYou,
  },
  'favorites-mix': {
    title: 'Favorites Mix',
    subtitle: 'A playlist built from the tracks you return to most.',
    primaryHeading: 'Favorites',
    primaryCards: madeForYou,
    secondaryHeading: 'More Like This',
    secondaryCards: recentlyPlayed.slice(0, 3),
  },
  focus: {
    title: 'Focus',
    subtitle: 'Instrumental music for deep work.',
    primaryHeading: 'Focus Playlist',
    primaryCards: madeForYou.slice(1),
    secondaryHeading: 'Recently Played',
    secondaryCards: recentlyPlayed,
  },
  'evening-drive': {
    title: 'Evening Drive',
    subtitle: 'Music for the way home.',
    primaryHeading: 'Drive Playlist',
    primaryCards: madeForYou.slice(2).concat(madeForYou.slice(0, 1)),
    secondaryHeading: 'Recently Played',
    secondaryCards: recentlyPlayed,
  },
};

function Sidebar({ activeSection, onSelect }: { activeSection: MusicSectionId; onSelect: (section: MusicSectionId) => void }) {
  return (
    <aside className="w-[222px] shrink-0 overflow-y-auto border-r border-black/[0.07] bg-[#f5f5f7]/80 px-4 py-4 text-[#1d1d1f] backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/55 [.theme-dark_&]:text-slate-100">
      <nav className="space-y-5" aria-label="Music sections">
        {sidebarGroups.map((group) => (
          <section key={group.label}>
            <div className="mb-1 flex h-6 items-center justify-between px-2">
              <h2 className="text-[11px] font-semibold tracking-[0.01em] text-[#6e6e73] [.theme-dark_&]:text-slate-400">{group.label}</h2>
              {group.actionLabel ? (
                <button
                  type="button"
                  aria-label={group.actionLabel}
                  className="grid h-6 w-6 place-items-center rounded-full text-[#6e6e73] outline-none transition hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-400 [.theme-dark_&]:hover:bg-white/10"
                >
                  +
                </button>
              ) : null}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-[13.5px] font-medium outline-none transition ${
                      active
                        ? 'bg-[#0071e3]/24 text-[#1d1d1f] shadow-sm [.theme-dark_&]:bg-[#0a84ff]/36 [.theme-dark_&]:text-white'
                        : 'text-[#424245] hover:bg-black/[0.05] focus-visible:bg-black/[0.06] [.theme-dark_&]:text-slate-300 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:focus-visible:bg-white/12'
                    }`}
                    onClick={() => onSelect(item.id)}
                  >
                    <Icon className={active ? 'text-[#0071e3] [.theme-dark_&]:text-[#5eb0ff]' : 'text-[#6e6e73] [.theme-dark_&]:text-slate-400'} size={16} strokeWidth={1.9} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {typeof item.count === 'number' ? (
                      <span className="font-variant-numeric tabular-nums text-[12px] text-[#86868b] [.theme-dark_&]:text-slate-500">{item.count}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}

function MusicCardGrid({ heading, cards }: { heading: string; cards: MusicCard[] }) {
  return (
    <section>
      <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1d1d1f] [.theme-dark_&]:text-slate-100">{heading}</h2>
      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(130px,150px))] gap-x-4 gap-y-6">
        {cards.map((card) => (
          <button
            key={`${heading}-${card.title}`}
            type="button"
            className="group min-w-0 text-left outline-none"
            aria-label={`${card.title} by ${card.artist}`}
          >
            <span
              className="relative block aspect-square overflow-hidden rounded-[12px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.03] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] [.theme-dark_&]:ring-white/10"
              style={{ background: card.art }}
            >
              <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent" />
              <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-white/24 text-white backdrop-blur-md">
                <Music size={19} strokeWidth={1.8} />
              </span>
            </span>
            <span className="mt-2 block truncate text-[13.5px] font-medium tracking-[-0.01em] text-[#1d1d1f] [.theme-dark_&]:text-slate-100">{card.title}</span>
            <span className="block truncate text-[12.5px] leading-5 text-[#6e6e73] [.theme-dark_&]:text-slate-400">{card.artist}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PlayerBar({
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
}: {
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}) {
  const PlayIcon = isPlaying ? Pause : Play;
  const VolumeIcon = isMuted ? VolumeX : Volume2;

  return (
    <footer className="grid h-[68px] shrink-0 grid-cols-[210px_1fr_260px] items-center border-t border-black/[0.07] bg-[#f5f5f7]/86 px-4 text-[#1d1d1f] backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/62 [.theme-dark_&]:text-slate-100 max-[820px]:grid-cols-[1fr_auto] max-[820px]:gap-3">
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium">{isPlaying ? 'Drift' : 'Not Playing'}</p>
        <p className="truncate text-[12px] text-[#6e6e73] [.theme-dark_&]:text-slate-400">{isPlaying ? 'Isla Wave' : 'Ready to play'}</p>
      </div>

      <div className="flex min-w-0 flex-col items-center gap-2 max-[820px]:order-3 max-[820px]:col-span-2">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
            <SkipBack size={17} fill="currentColor" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Play/Pause"
            aria-pressed={isPlaying}
            className="grid h-10 w-10 place-items-center rounded-full text-[#1d1d1f] outline-none transition hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-100 [.theme-dark_&]:hover:bg-white/10"
            onClick={onTogglePlay}
          >
            <PlayIcon size={22} fill="currentColor" strokeWidth={1.8} />
          </button>
          <button type="button" aria-label="Next" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
            <SkipForward size={17} fill="currentColor" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex w-full max-w-[460px] items-center gap-2 text-[11px] font-medium tabular-nums text-[#86868b] [.theme-dark_&]:text-slate-500">
          <span>0:00</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#d2d2d7] [.theme-dark_&]:bg-white/14">
            <div className={`h-full rounded-full bg-[#0071e3] transition-all ${isPlaying ? 'w-[34%]' : 'w-0'}`} />
          </div>
          <span>-0:00</span>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-1.5 max-[820px]:justify-end">
        <button type="button" aria-label="Shuffle" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
          <Shuffle size={15.5} strokeWidth={1.8} />
        </button>
        <button type="button" aria-label="Repeat" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
          <Repeat2 size={15.5} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label="Mute/Volume"
          aria-pressed={isMuted}
          className="grid h-8 w-8 place-items-center rounded-full text-[#6e6e73] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-400 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100"
          onClick={onToggleMute}
        >
          <VolumeIcon size={16} strokeWidth={1.8} />
        </button>
        <div className="h-1.5 w-[78px] overflow-hidden rounded-full bg-[#d2d2d7] [.theme-dark_&]:bg-white/14 max-[900px]:hidden" aria-hidden="true">
          <div className={`h-full rounded-full bg-[#1d1d1f] [.theme-dark_&]:bg-slate-100 ${isMuted ? 'w-0' : 'w-[82%]'}`} />
        </div>
        <button type="button" aria-label="Lyrics" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
          <Mic2 size={15.5} strokeWidth={1.8} />
        </button>
        <button type="button" aria-label="Up Next" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
          <ListMusic size={15.5} strokeWidth={1.8} />
        </button>
        <button type="button" aria-label="MiniPlayer" className="grid h-8 w-8 place-items-center rounded-full text-[#86868b] outline-none transition hover:bg-black/[0.05] hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3] [.theme-dark_&]:text-slate-500 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-slate-100">
          <Maximize2 size={15.5} strokeWidth={1.8} />
        </button>
      </div>
    </footer>
  );
}

function MusicApp() {
  const [activeSection, setActiveSection] = useState<MusicSectionId>('listen-now');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const content = useMemo(() => contentBySection[activeSection], [activeSection]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] antialiased [.theme-dark_&]:bg-slate-950 [.theme-dark_&]:text-slate-100">
      <div className="flex min-h-0 flex-1">
        <Sidebar activeSection={activeSection} onSelect={setActiveSection} />

        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mx-auto max-w-[720px]">
            <header>
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#1d1d1f] [.theme-dark_&]:text-slate-100">{content.title}</h1>
              <p className="mt-1 text-[13px] leading-5 text-[#6e6e73] [.theme-dark_&]:text-slate-400">{content.subtitle}</p>
            </header>

            <div className="mt-4 space-y-7 pb-6">
              <MusicCardGrid heading={content.primaryHeading} cards={content.primaryCards} />
              <MusicCardGrid heading={content.secondaryHeading} cards={content.secondaryCards} />
            </div>
          </div>
        </main>
      </div>

      <PlayerBar
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={() => setIsPlaying((playing) => !playing)}
        onToggleMute={() => setIsMuted((muted) => !muted)}
      />
    </div>
  );
}

export const musicApp: AppDefinition = {
  id: 'music',
  title: 'Music',
  icon: Music,
  iconGradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  defaultWindow: {
    width: 980,
    height: 700,
    minWidth: 720,
    minHeight: 500,
  },
  Component: MusicApp,
};
