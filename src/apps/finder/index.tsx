import { useMemo, useState } from 'react';
import {
  Airplay,
  AppWindow,
  Archive,
  ArrowLeft,
  ArrowRight,
  Clock3,
  Cloud,
  Download,
  FileImage,
  FileText,
  Folder,
  Grid2X2,
  HardDrive,
  List,
  Monitor,
  Network,
  Search,
  Server,
} from 'lucide-react';
import type { AppDefinition } from '../types';
import { type FsItem, useFsStore } from '../../store/fsStore';

type SidebarItem = {
  label: string;
  path: string;
  icon: 'recents' | 'airdrop' | 'applications' | 'desktop' | 'documents' | 'downloads' | 'disk' | 'icloud' | 'network';
};

type ViewMode = 'icon' | 'list';

const sidebarSections: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'Favorites',
    items: [
      { label: 'Recents', path: '/recents', icon: 'recents' },
      { label: 'AirDrop', path: '/airdrop', icon: 'airdrop' },
      { label: 'Applications', path: '/applications', icon: 'applications' },
      { label: 'Desktop', path: '/desktop', icon: 'desktop' },
      { label: 'Documents', path: '/documents', icon: 'documents' },
      { label: 'Downloads', path: '/downloads', icon: 'downloads' },
    ],
  },
  {
    title: 'Locations',
    items: [
      { label: 'Macintosh HD', path: '/', icon: 'disk' },
      { label: 'iCloud', path: '/icloud', icon: 'icloud' },
      { label: 'Network', path: '/network', icon: 'network' },
    ],
  },
];

const iconComponents = {
  airdrop: Airplay,
  'app-window': AppWindow,
  app: AppWindow,
  archive: Archive,
  clock: Clock3,
  cloud: Cloud,
  desktop: Monitor,
  disk: HardDrive,
  download: Download,
  file: FileText,
  folder: Folder,
  'hard-drive': HardDrive,
  image: FileImage,
  network: Network,
  server: Server,
  text: FileText,
};

function normalizePath(path: string) {
  if (path === '/') {
    return '/';
  }

  return `/${path.split('/').filter(Boolean).join('/')}`;
}

function joinPath(parentPath: string, item: FsItem) {
  return normalizePath(`${parentPath}/${item.id}`);
}

function formatBytes(size: number | null) {
  if (size === null) {
    return '--';
  }

  if (size >= 1_000_000_000) {
    return `${(size / 1_000_000_000).toFixed(1)} GB`;
  }

  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1_000))} KB`;
}

function pathTitle(path: string, currentName: string) {
  if (path === '/') {
    return 'Macintosh HD';
  }

  return currentName;
}

function pathCrumbs(path: string, currentName: string) {
  if (path === '/') {
    return 'Macintosh HD';
  }

  const segments = path.split('/').filter(Boolean);
  return ['Macintosh HD', ...segments.slice(0, -1), currentName].join(' / ');
}

function ItemGlyph({ item, selected, size = 'large' }: { item: FsItem; selected: boolean; size?: 'small' | 'large' }) {
  const Icon = iconComponents[item.icon as keyof typeof iconComponents] ?? (item.kind === 'folder' ? Folder : FileText);
  const isFolder = item.kind === 'folder';
  const isSmall = size === 'small';

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[12px] ring-1 ${
        isSmall ? 'h-8 w-8' : 'h-14 w-14'
      } ${
        isFolder
          ? selected
            ? 'bg-blue-500 text-white ring-white/40'
            : 'bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 text-white ring-white/50'
          : selected
            ? 'bg-blue-500 text-white ring-white/40'
            : 'bg-white/70 text-slate-600 ring-white/60 [.theme-dark_&]:bg-white/15 [.theme-dark_&]:text-slate-100'
      } shadow-sm`}
    >
      <Icon size={isSmall ? 18 : 29} strokeWidth={2.1} />
    </span>
  );
}

function SidebarIcon({ icon }: { icon: SidebarItem['icon'] }) {
  const Icon =
    icon === 'recents'
      ? Clock3
      : icon === 'airdrop'
        ? Airplay
        : icon === 'applications'
          ? AppWindow
          : icon === 'desktop'
            ? Monitor
            : icon === 'documents'
              ? Folder
              : icon === 'downloads'
                ? Download
                : icon === 'icloud'
                  ? Cloud
                  : icon === 'network'
                    ? Network
                    : HardDrive;

  return <Icon size={15} strokeWidth={2.2} />;
}

function FinderApp() {
  const getChildren = useFsStore((state) => state.getChildren);
  const getItemByPath = useFsStore((state) => state.getItemByPath);
  const availableGb = useFsStore((state) => state.availableGb);
  const [currentPath, setCurrentPath] = useState('/');
  const [backStack, setBackStack] = useState<string[]>([]);
  const [forwardStack, setForwardStack] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('icon');

  const currentItem = getItemByPath(currentPath);
  const items = useMemo(() => getChildren(currentPath), [currentPath, getChildren]);
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const folders = items.filter((item) => item.kind === 'folder').length;
  const files = items.length - folders;

  const navigateTo = (nextPath: string) => {
    const normalizedPath = normalizePath(nextPath);
    if (normalizedPath === currentPath || !getItemByPath(normalizedPath)) {
      return;
    }

    setBackStack((stack) => [...stack, currentPath]);
    setForwardStack([]);
    setCurrentPath(normalizedPath);
    setSelectedId(null);
  };

  const goBack = () => {
    const previousPath = backStack[backStack.length - 1];
    if (!previousPath) {
      return;
    }

    setBackStack((stack) => stack.slice(0, -1));
    setForwardStack((stack) => [currentPath, ...stack]);
    setCurrentPath(previousPath);
    setSelectedId(null);
  };

  const goForward = () => {
    const nextPath = forwardStack[0];
    if (!nextPath) {
      return;
    }

    setForwardStack((stack) => stack.slice(1));
    setBackStack((stack) => [...stack, currentPath]);
    setCurrentPath(nextPath);
    setSelectedId(null);
  };

  const openItem = (item: FsItem) => {
    setSelectedId(item.id);
    if (item.kind === 'folder') {
      navigateTo(joinPath(currentPath, item));
    }
  };

  const title = pathTitle(currentPath, currentItem?.name ?? 'Finder');

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[rgba(255,255,255,0.18)] text-[var(--text-primary)] [.theme-dark_&]:bg-black/10">
      <div className="flex min-h-0 flex-1">
        <aside className="w-[190px] shrink-0 border-r border-white/35 bg-white/20 px-3 py-3 backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/20">
          <div className="space-y-3">
            {sidebarSections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  {section.title}
                </h2>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = currentPath === item.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        className={`flex h-7 w-full items-center gap-2 rounded-[8px] px-2 text-left text-[13px] font-medium outline-none transition ${
                          active
                            ? 'bg-blue-500/90 text-white shadow-sm'
                            : 'text-[var(--text-primary)] hover:bg-white/35 focus-visible:bg-white/45 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:focus-visible:bg-white/15'
                        }`}
                        onClick={() => navigateTo(item.path)}
                      >
                        <SidebarIcon icon={item.icon} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-white/35 bg-white/20 px-4 backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/20">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-[8px] bg-white/25 text-[var(--text-primary)] outline-none ring-1 ring-white/35 transition hover:bg-white/40 disabled:cursor-default disabled:opacity-35 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10 [.theme-dark_&]:hover:bg-white/15"
                aria-label="Back"
                disabled={backStack.length === 0}
                onClick={goBack}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-[8px] bg-white/25 text-[var(--text-primary)] outline-none ring-1 ring-white/35 transition hover:bg-white/40 disabled:cursor-default disabled:opacity-35 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10 [.theme-dark_&]:hover:bg-white/15"
                aria-label="Forward"
                disabled={forwardStack.length === 0}
                onClick={goForward}
              >
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold leading-5">{title}</div>
              <div className="truncate text-[11px] text-[var(--text-secondary)]">
                {pathCrumbs(currentPath, currentItem?.name ?? 'Finder')}
              </div>
            </div>

            <div className="flex h-8 rounded-[9px] bg-white/25 p-0.5 ring-1 ring-white/35 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10">
              <button
                type="button"
                className={`grid h-7 w-8 place-items-center rounded-[7px] outline-none transition ${
                  viewMode === 'icon' ? 'bg-white/75 shadow-sm [.theme-dark_&]:bg-white/20' : 'hover:bg-white/35 [.theme-dark_&]:hover:bg-white/10'
                }`}
                aria-label="Icon view"
                aria-pressed={viewMode === 'icon'}
                onClick={() => setViewMode('icon')}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                type="button"
                className={`grid h-7 w-8 place-items-center rounded-[7px] outline-none transition ${
                  viewMode === 'list' ? 'bg-white/75 shadow-sm [.theme-dark_&]:bg-white/20' : 'hover:bg-white/35 [.theme-dark_&]:hover:bg-white/10'
                }`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <List size={17} />
              </button>
            </div>

            <div className="hidden h-8 min-w-[142px] items-center gap-2 rounded-[9px] bg-white/25 px-3 text-[12px] text-[var(--text-secondary)] ring-1 ring-white/35 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10 md:flex">
              <Search size={14} />
              <span>Search</span>
            </div>
          </header>

          <section className="min-h-0 flex-1 overflow-auto px-4 py-4" aria-label={`${title} files`}>
            {items.length === 0 ? (
              <div className="grid h-full place-items-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-[16px] bg-white/30 text-[var(--text-secondary)] ring-1 ring-white/40 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10">
                    <Folder size={28} />
                  </div>
                  <div className="text-sm font-semibold">This folder is empty</div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)]">No mock files are stored here yet.</div>
                </div>
              </div>
            ) : viewMode === 'icon' ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-4 gap-y-5">
                {items.map((item) => {
                  const selected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`group flex min-h-[108px] flex-col items-center justify-start rounded-[12px] px-2 py-2 text-center outline-none transition ${
                        selected ? 'bg-blue-500/20 ring-1 ring-blue-400/45' : 'hover:bg-white/25 focus-visible:bg-white/30 [.theme-dark_&]:hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedId(item.id)}
                      onDoubleClick={() => openItem(item)}
                    >
                      <ItemGlyph item={item} selected={selected} />
                      <span
                        className={`mt-2 max-w-full rounded-[6px] px-1.5 py-0.5 text-[12px] font-medium leading-4 ${
                          selected ? 'bg-blue-500 text-white' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="line-clamp-2 break-words">{item.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-hidden rounded-[12px] bg-white/[0.18] ring-1 ring-white/35 [.theme-dark_&]:bg-white/5 [.theme-dark_&]:ring-white/10">
                <div className="grid h-8 grid-cols-[minmax(150px,1fr)_76px_128px_112px] items-center border-b border-white/35 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] [.theme-dark_&]:border-white/10">
                  <div>Name</div>
                  <div>Size</div>
                  <div>Kind</div>
                  <div>Modified</div>
                </div>
                {items.map((item) => {
                  const selected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`grid h-11 w-full grid-cols-[minmax(150px,1fr)_76px_128px_112px] items-center border-b border-white/20 px-3 text-left text-[13px] outline-none last:border-b-0 [.theme-dark_&]:border-white/10 ${
                        selected
                          ? 'bg-blue-500/85 text-white'
                          : 'hover:bg-white/25 focus-visible:bg-white/30 [.theme-dark_&]:hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedId(item.id)}
                      onDoubleClick={() => openItem(item)}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <ItemGlyph item={item} selected={selected} size="small" />
                        <span className="truncate font-medium">{item.name}</span>
                      </div>
                      <div className={selected ? 'text-white/85' : 'text-[var(--text-secondary)]'}>{formatBytes(item.size)}</div>
                      <div className={`truncate ${selected ? 'text-white/85' : 'text-[var(--text-secondary)]'}`}>{item.type}</div>
                      <div className={`truncate ${selected ? 'text-white/85' : 'text-[var(--text-secondary)]'}`}>{item.modified}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      <footer className="flex h-8 shrink-0 items-center justify-between border-t border-white/35 bg-white/20 px-4 text-[12px] text-[var(--text-secondary)] backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/20">
        <span>
          {items.length} items, {availableGb.toFixed(2)} GB available
        </span>
        <span className="truncate pl-4">
          {selectedItem ? `${selectedItem.name} selected` : `${folders} folders, ${files} files`}
        </span>
      </footer>
    </div>
  );
}

export const finderApp: AppDefinition = {
  id: 'finder',
  title: 'Finder',
  icon: Folder,
  iconGradient: 'from-sky-400 via-blue-500 to-indigo-600',
  defaultWindow: {
    width: 780,
    height: 450,
    minWidth: 640,
    minHeight: 390,
  },
  Component: FinderApp,
};
