import type { AppDefinition } from './types';
import { createElement, type ComponentType } from 'react';
import {
  CalendarDays,
  Clapperboard,
  ContactRound,
  Gamepad2,
  Grid2X2,
  Mail,
  Map as MapIcon,
  MessageCircle,
  Newspaper,
  PencilRuler,
  Phone,
  Podcast,
  RefreshCw,
  Search,
  Store,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { AppPlaceholder } from './AppPlaceholder';
import { calculatorApp } from './calculator';
import { finderApp } from './finder';
import { githubApp } from './github';
import { musicApp } from './music';
import { notesApp } from './notes';
import { previewApp } from './preview';
import { settingsApp } from './settings';
import { textEditApp } from './textedit';

type PlaceholderAppConfig = {
  id: string;
  title: string;
  icon: LucideIcon;
  iconGradient: string;
  body: string;
  width?: number;
  height?: number;
};

type RegistryAppDefinition = AppDefinition & {
  WindowToolbar?: ComponentType;
};

const appSizeOverrides: Record<string, Partial<AppDefinition['defaultWindow']>> = {
  finder: { width: 980, height: 620, minWidth: 720, minHeight: 480 },
  github: { width: 720, height: 520, minWidth: 520, minHeight: 420 },
  settings: { width: 920, height: 640, minWidth: 700, minHeight: 500 },
  textedit: { width: 660, height: 460, minWidth: 420, minHeight: 300 },
  preview: { width: 760, height: 540, minWidth: 480, minHeight: 340 },
};

function withWindowSizing(app: AppDefinition, toolbar?: ComponentType): RegistryAppDefinition {
  const override = appSizeOverrides[app.id];

  return {
    ...app,
    defaultWindow: {
      ...app.defaultWindow,
      ...override,
    },
    ...(toolbar ? { WindowToolbar: toolbar } : {}),
  };
}

function SettingsWindowToolbar() {
  return createElement(
    'div',
    { className: 'flex w-full items-center gap-3 text-[13px] text-[var(--text-secondary)]' },
    createElement(
      'label',
      {
        className:
          'flex h-8 min-w-[240px] items-center gap-2 rounded-[10px] bg-white/45 px-3 ring-1 ring-black/[0.06] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10',
      },
      createElement(Search, { size: 14 }),
      createElement('input', {
        className: 'min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--text-secondary)]',
        'aria-label': 'Search settings',
        placeholder: 'Search',
      }),
    ),
    createElement('span', { className: 'ml-auto hidden text-[12px] md:inline' }, 'Appearance'),
  );
}

function createPlaceholderApp({
  id,
  title,
  icon,
  iconGradient,
  body,
  width = 760,
  height = 520,
}: PlaceholderAppConfig): AppDefinition {
  function PlaceholderApp() {
    return createElement(AppPlaceholder, { title, body });
  }

  return {
    id,
    title,
    icon,
    iconGradient,
    defaultWindow: {
      width,
      height,
      minWidth: 420,
      minHeight: 300,
    },
    Component: PlaceholderApp,
  };
}

const launchpadApp = createPlaceholderApp({
  id: 'launchpad',
  title: 'Launchpad',
  icon: Grid2X2,
  iconGradient: 'from-neutral-500 via-zinc-600 to-stone-700',
  body: 'A system app launcher placeholder for the expanded macOS27 Dock.',
  width: 700,
  height: 500,
});

const safariApp = createPlaceholderApp({
  id: 'safari',
  title: 'Safari',
  icon: RefreshCw,
  iconGradient: 'from-sky-300 via-blue-500 to-indigo-600',
  body: 'A placeholder browser surface for future web navigation flows.',
});

const messagesApp = createPlaceholderApp({
  id: 'messages',
  title: 'Messages',
  icon: MessageCircle,
  iconGradient: 'from-lime-300 via-green-400 to-emerald-600',
  body: 'A placeholder conversations surface for the system Messages app.',
});

const mailApp = createPlaceholderApp({
  id: 'mail',
  title: 'Mail',
  icon: Mail,
  iconGradient: 'from-sky-300 via-blue-500 to-cyan-600',
  body: 'A placeholder inbox surface for the system Mail app.',
});

const mapsApp = createPlaceholderApp({
  id: 'maps',
  title: 'Maps',
  icon: MapIcon,
  iconGradient: 'from-emerald-300 via-green-400 to-sky-500',
  body: 'A placeholder maps surface for directions, locations, and guides.',
});

const photosApp = createPlaceholderApp({
  id: 'photos',
  title: 'Photos',
  icon: PencilRuler,
  iconGradient: 'from-pink-200 via-rose-300 to-fuchsia-500',
  body: 'A placeholder photo library surface for albums and memories.',
});

const facetimeApp = createPlaceholderApp({
  id: 'facetime',
  title: 'FaceTime',
  icon: Video,
  iconGradient: 'from-green-300 via-emerald-500 to-teal-600',
  body: 'A placeholder calling surface for FaceTime audio and video.',
});

const phoneApp = createPlaceholderApp({
  id: 'phone',
  title: 'Phone',
  icon: Phone,
  iconGradient: 'from-lime-300 via-green-500 to-emerald-600',
  body: 'A placeholder phone surface for recent calls, contacts, and voicemail.',
  width: 560,
  height: 520,
});

const calendarApp = createPlaceholderApp({
  id: 'calendar',
  title: 'Calendar',
  icon: CalendarDays,
  iconGradient: 'from-white via-slate-100 to-red-400',
  body: 'A placeholder calendar surface for events, schedules, and reminders.',
  width: 820,
  height: 560,
});

const contactsApp = createPlaceholderApp({
  id: 'contacts',
  title: 'Contacts',
  icon: ContactRound,
  iconGradient: 'from-stone-300 via-zinc-500 to-neutral-700',
  body: 'A placeholder contacts surface for people, companies, and groups.',
  width: 720,
  height: 520,
});

const remindersApp = createPlaceholderApp({
  id: 'reminders',
  title: 'Reminders',
  icon: RefreshCw,
  iconGradient: 'from-pink-300 via-rose-400 to-red-500',
  body: 'A placeholder reminders surface for lists, flags, and due dates.',
});

const freeformApp = createPlaceholderApp({
  id: 'freeform',
  title: 'Freeform',
  icon: PencilRuler,
  iconGradient: 'from-yellow-200 via-amber-300 to-orange-500',
  body: 'A placeholder whiteboard surface for sketches, notes, and shared boards.',
});

const podcastsApp = createPlaceholderApp({
  id: 'podcasts',
  title: 'Podcasts',
  icon: Podcast,
  iconGradient: 'from-purple-400 via-violet-500 to-fuchsia-700',
  body: 'A placeholder podcast library surface for shows and episodes.',
});

const tvApp = createPlaceholderApp({
  id: 'tv',
  title: 'TV',
  icon: Clapperboard,
  iconGradient: 'from-zinc-700 via-neutral-800 to-black',
  body: 'A placeholder TV surface for watch queues, channels, and movies.',
});

const newsApp = createPlaceholderApp({
  id: 'news',
  title: 'News',
  icon: Newspaper,
  iconGradient: 'from-red-400 via-rose-500 to-orange-500',
  body: 'A placeholder news surface for headlines, topics, and saved stories.',
});

const gamesApp = createPlaceholderApp({
  id: 'games',
  title: 'Games',
  icon: Gamepad2,
  iconGradient: 'from-orange-300 via-red-400 to-pink-500',
  body: 'A placeholder games surface for Arcade, achievements, and friends.',
});

const appStoreApp = createPlaceholderApp({
  id: 'app-store',
  title: 'App Store',
  icon: Store,
  iconGradient: 'from-sky-300 via-blue-500 to-indigo-600',
  body: 'A placeholder App Store surface for app discovery and updates.',
});

export const apps: RegistryAppDefinition[] = [
  withWindowSizing(finderApp),
  launchpadApp,
  withWindowSizing(githubApp),
  safariApp,
  messagesApp,
  mailApp,
  mapsApp,
  photosApp,
  facetimeApp,
  phoneApp,
  calendarApp,
  contactsApp,
  remindersApp,
  freeformApp,
  withWindowSizing(notesApp),
  withWindowSizing(textEditApp),
  withWindowSizing(previewApp),
  musicApp,
  podcastsApp,
  tvApp,
  newsApp,
  gamesApp,
  appStoreApp,
  calculatorApp,
  withWindowSizing(settingsApp, SettingsWindowToolbar),
];

export const appById = new Map(apps.map((app) => [app.id, app]));
