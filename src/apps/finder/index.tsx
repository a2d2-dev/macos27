import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Airplay,
  AppWindow,
  Archive,
  ArrowLeft,
  ArrowRight,
  Clock3,
  Cloud,
  Columns3,
  Download,
  FileImage,
  FileText,
  Folder,
  Grid2X2,
  HardDrive,
  Image,
  Info,
  List,
  Monitor,
  MoreHorizontal,
  Network,
  Search,
  Server,
  Share,
  Tag,
} from 'lucide-react';
import type { AppDefinition } from '../types';
import { type FsItem, useFsStore } from '../../store/fsStore';

type SidebarItem = {
  label: string;
  path: string;
  icon: 'recents' | 'airdrop' | 'applications' | 'desktop' | 'documents' | 'downloads' | 'disk' | 'icloud' | 'network';
};

type ViewMode = 'icon' | 'list' | 'column' | 'gallery';

const viewButtons: { mode: ViewMode; label: string; icon: typeof Grid2X2 }[] = [
  { mode: 'icon', label: 'Icon view', icon: Grid2X2 },
  { mode: 'list', label: 'List view', icon: List },
  { mode: 'column', label: 'Column view', icon: Columns3 },
  { mode: 'gallery', label: 'Gallery view', icon: Image },
];

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

function formatAvailableGb(value: number) {
  return value.toFixed(1);
}

function itemCountLabel(count: number) {
  return `${count} ${count === 1 ? 'item' : 'items'}`;
}

function pathTitle(path: string, currentName: string) {
  if (path === '/') {
    return 'Macintosh HD';
  }

  return currentName;
}

function pathCrumbs(path: string, getItemByPath: (path: string) => FsItem | null) {
  if (path === '/') {
    return 'Macintosh HD';
  }

  const segments = path.split('/').filter(Boolean);
  const names = segments.map((_, index) => {
    const segmentPath = `/${segments.slice(0, index + 1).join('/')}`;
    return getItemByPath(segmentPath)?.name ?? segments[index];
  });

  return ['Macintosh HD', ...names].join(' / ');
}

function ItemGlyph({ item, selected, pixelSize = 56 }: { item: FsItem; selected: boolean; pixelSize?: number }) {
  const Icon = iconComponents[item.icon as keyof typeof iconComponents] ?? (item.kind === 'folder' ? Folder : FileText);
  const isFolder = item.kind === 'folder';
  const iconSize = Math.max(16, Math.round(pixelSize * 0.52));

  return (
    <span
      className={`grid shrink-0 place-items-center ring-1 ${
        isFolder
          ? selected
            ? 'bg-blue-500 text-white ring-white/40'
            : 'bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 text-white ring-white/50'
          : selected
            ? 'bg-blue-500 text-white ring-white/40'
            : 'bg-white/80 text-slate-600 ring-black/[0.07] [.theme-dark_&]:bg-white/15 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:ring-white/10'
      } shadow-sm`}
      style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: Math.max(10, Math.round(pixelSize * 0.22)),
      }}
    >
      <Icon size={iconSize} strokeWidth={2.1} />
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
  const [iconSize, setIconSize] = useState(56);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const currentItem = getItemByPath(currentPath);
  const allItems = useMemo(() => getChildren(currentPath), [currentPath, getChildren]);
  const items = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return allItems;
    }

    return allItems.filter((item) => `${item.name} ${item.type}`.toLowerCase().includes(normalizedSearch));
  }, [allItems, searchTerm]);
  const selectedItem = allItems.find((item) => item.id === selectedId) ?? null;
  const visibleSelectedItem = items.find((item) => item.id === selectedId) ?? null;
  const galleryItem = visibleSelectedItem ?? items[0] ?? null;
  const columnFolderPath = visibleSelectedItem?.kind === 'folder' ? joinPath(currentPath, visibleSelectedItem) : null;
  const columnItems = columnFolderPath ? getChildren(columnFolderPath) : [];
  const folders = items.filter((item) => item.kind === 'folder').length;
  const files = items.length - folders;

  useEffect(() => {
    if (!actionMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setActionMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActionMenuOpen(false);
      }
    };

    globalThis.addEventListener('pointerdown', handlePointerDown);
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.removeEventListener('pointerdown', handlePointerDown);
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [actionMenuOpen]);

  const navigateTo = (nextPath: string) => {
    const normalizedPath = normalizePath(nextPath);
    if (normalizedPath === currentPath || !getItemByPath(normalizedPath)) {
      return;
    }

    setBackStack((stack) => [...stack, currentPath]);
    setForwardStack([]);
    setCurrentPath(normalizedPath);
    setSelectedId(null);
    setSearchTerm('');
    setActionMessage('');
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
    setSearchTerm('');
    setActionMessage('');
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
    setSearchTerm('');
    setActionMessage('');
  };

  const openItem = (item: FsItem) => {
    setSelectedId(item.id);
    if (item.kind === 'folder') {
      navigateTo(joinPath(currentPath, item));
    }
  };

  const title = pathTitle(currentPath, currentItem?.name ?? 'Finder');
  const itemStatus = `${itemCountLabel(items.length)}, ${formatAvailableGb(availableGb)} GB available`;
  const selectedStatus = actionMessage || (selectedItem ? `${selectedItem.name} selected` : `${folders} folders, ${files} files`);

  const performAction = (action: 'open' | 'info' | 'column' | 'clear') => {
    if (action === 'open' && selectedItem?.kind === 'folder') {
      openItem(selectedItem);
      setActionMenuOpen(false);
      return;
    }

    if (action === 'info' && selectedItem) {
      setActionMessage(`${selectedItem.name}: ${selectedItem.type}, ${formatBytes(selectedItem.size)}`);
    } else if (action === 'column') {
      setViewMode('column');
      setActionMessage('Column view enabled');
    } else if (action === 'clear') {
      setSelectedId(null);
      setActionMessage('Selection cleared');
    }

    setActionMenuOpen(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[rgba(255,255,255,0.28)] text-[var(--text-primary)] [.theme-dark_&]:bg-black/10">
      <div className="flex min-h-0 flex-1">
        <aside className="w-[190px] shrink-0 border-r border-black/[0.07] bg-white/[0.38] px-3 py-3 backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/25">
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

        <main className="flex min-w-0 flex-1 flex-col bg-white/[0.82] [.theme-dark_&]:bg-slate-950/30">
          <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-black/[0.07] bg-[rgba(245,245,247,0.72)] px-4 backdrop-blur-[20px] backdrop-saturate-[180%] [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/45">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-[10px] bg-white/30 text-[var(--text-primary)] outline-none ring-1 ring-black/[0.07] transition hover:bg-white/55 active:scale-[0.97] disabled:cursor-default disabled:opacity-35 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10 [.theme-dark_&]:hover:bg-white/15"
                aria-label="Back"
                disabled={backStack.length === 0}
                onClick={goBack}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-[10px] bg-white/30 text-[var(--text-primary)] outline-none ring-1 ring-black/[0.07] transition hover:bg-white/55 active:scale-[0.97] disabled:cursor-default disabled:opacity-35 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10 [.theme-dark_&]:hover:bg-white/15"
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
                {pathCrumbs(currentPath, getItemByPath)}
              </div>
            </div>

            <div className="flex h-9 rounded-[10px] bg-black/[0.045] p-0.5 ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10">
              {viewButtons.map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  className={`grid h-8 w-9 place-items-center rounded-[9px] outline-none transition active:scale-[0.97] ${
                    viewMode === mode
                      ? 'bg-white text-[var(--text-primary)] shadow-sm [.theme-dark_&]:bg-white/20'
                      : 'text-[var(--text-secondary)] hover:bg-white/55 [.theme-dark_&]:hover:bg-white/10'
                  }`}
                  aria-label={label}
                  aria-pressed={viewMode === mode}
                  onClick={() => setViewMode(mode)}
                >
                  <Icon size={mode === 'list' ? 17 : 16} strokeWidth={2} />
                </button>
              ))}
            </div>

            <div className="relative flex items-center gap-1" ref={actionMenuRef}>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-[10px] text-[var(--text-secondary)] outline-none transition hover:bg-white/55 active:scale-[0.97] [.theme-dark_&]:hover:bg-white/10"
                aria-label="Action menu"
                aria-expanded={actionMenuOpen}
                onClick={() => setActionMenuOpen((open) => !open)}
              >
                <MoreHorizontal size={18} />
              </button>
              {actionMenuOpen ? (
                <div className="absolute right-0 top-11 z-20 w-48 origin-top-right overflow-hidden rounded-[16px] border border-black/[0.07] bg-[rgba(245,245,247,0.78)] p-1.5 text-[13px] shadow-[0_2px_8px_rgba(0,0,0,0.10),0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-[20px] backdrop-saturate-[180%] transition [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/80">
                  <button
                    type="button"
                    className="flex h-8 w-full items-center justify-between rounded-[10px] px-3 text-left outline-none hover:bg-white/55 disabled:cursor-default disabled:opacity-40 [.theme-dark_&]:hover:bg-white/10"
                    disabled={!selectedItem || selectedItem.kind !== 'folder'}
                    onClick={() => performAction('open')}
                  >
                    Open <span className="text-[11px] text-[var(--text-secondary)]">Return</span>
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-full items-center gap-2 rounded-[10px] px-3 text-left outline-none hover:bg-white/55 disabled:cursor-default disabled:opacity-40 [.theme-dark_&]:hover:bg-white/10"
                    disabled={!selectedItem}
                    onClick={() => performAction('info')}
                  >
                    <Info size={14} /> Get Info
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-full items-center gap-2 rounded-[10px] px-3 text-left outline-none hover:bg-white/55 [.theme-dark_&]:hover:bg-white/10"
                    onClick={() => performAction('column')}
                  >
                    <Columns3 size={14} /> Show in Columns
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-full items-center rounded-[10px] px-3 text-left outline-none hover:bg-white/55 disabled:cursor-default disabled:opacity-40 [.theme-dark_&]:hover:bg-white/10"
                    disabled={!selectedItem}
                    onClick={() => performAction('clear')}
                  >
                    Clear Selection
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-[10px] text-[var(--text-secondary)] outline-none transition hover:bg-white/55 active:scale-[0.97] [.theme-dark_&]:hover:bg-white/10"
                aria-label="Tags"
                onClick={() => setActionMessage(selectedItem ? `Tag ready for ${selectedItem.name}` : 'Select an item to tag')}
              >
                <Tag size={17} />
              </button>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-[10px] text-[var(--text-secondary)] outline-none transition hover:bg-white/55 active:scale-[0.97] [.theme-dark_&]:hover:bg-white/10"
                aria-label="Share"
                onClick={() => setActionMessage(selectedItem ? `Share ready for ${selectedItem.name}` : 'Select an item to share')}
              >
                <Share size={17} />
              </button>
            </div>

            <label className="hidden h-9 min-w-[160px] items-center gap-2 rounded-[12px] bg-white/55 px-3 text-[12px] text-[var(--text-secondary)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10 md:flex">
              <Search size={14} />
              <input
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-secondary)]"
                value={searchTerm}
                placeholder="Search"
                aria-label="Search files"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSelectedId(null);
                }}
              />
            </label>
          </header>

          <section className="min-h-0 flex-1 overflow-auto bg-white/80 px-4 py-4 [.theme-dark_&]:bg-slate-950/20" aria-label={`${title} files`}>
            {items.length === 0 ? (
              <div className="grid h-full place-items-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-[16px] bg-black/[0.04] text-[var(--text-secondary)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10">
                    <Folder size={28} />
                  </div>
                  <div className="text-sm font-semibold">{searchTerm ? 'No matching items' : 'This folder is empty'}</div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)]">
                    {searchTerm ? `No files in ${title} match "${searchTerm}".` : 'No files are stored here.'}
                  </div>
                </div>
              </div>
            ) : viewMode === 'icon' ? (
              <div
                className="grid gap-x-4 gap-y-5"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(88, iconSize + 46)}px, 1fr))` }}
              >
                {items.map((item) => {
                  const selected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`group flex flex-col items-center justify-start rounded-[12px] px-2 py-2 text-center outline-none transition ${
                        selected ? 'bg-blue-500/20 ring-1 ring-blue-400/45' : 'hover:bg-black/[0.035] focus-visible:bg-black/[0.045] [.theme-dark_&]:hover:bg-white/10'
                      }`}
                      style={{ minHeight: iconSize + 56 }}
                      onClick={() => setSelectedId(item.id)}
                      onDoubleClick={() => openItem(item)}
                    >
                      <ItemGlyph item={item} selected={selected} pixelSize={iconSize} />
                      <span
                        className={`mt-2 max-w-full rounded-[6px] px-1.5 py-0.5 font-medium leading-4 ${
                          selected ? 'bg-blue-500 text-white' : 'text-[var(--text-primary)]'
                        }`}
                        style={{ fontSize: Math.max(11, Math.min(13, Math.round(iconSize * 0.21))) }}
                      >
                        <span className="line-clamp-2 break-words">{item.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : viewMode === 'list' ? (
              <div className="overflow-hidden rounded-[12px] bg-white ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/5 [.theme-dark_&]:ring-white/10">
                <div className="grid h-8 grid-cols-[minmax(160px,1fr)_86px_150px_118px] items-center border-b border-black/[0.07] px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] [.theme-dark_&]:border-white/10">
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
                      className={`grid h-11 w-full grid-cols-[minmax(160px,1fr)_86px_150px_118px] items-center border-b border-black/[0.05] px-3 text-left text-[13px] outline-none last:border-b-0 [.theme-dark_&]:border-white/10 ${
                        selected
                          ? 'bg-blue-500/85 text-white'
                          : 'hover:bg-black/[0.035] focus-visible:bg-black/[0.045] [.theme-dark_&]:hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedId(item.id)}
                      onDoubleClick={() => openItem(item)}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <ItemGlyph item={item} selected={selected} pixelSize={32} />
                        <span className="truncate font-medium">{item.name}</span>
                      </div>
                      <div className={selected ? 'text-white/85' : 'text-[var(--text-secondary)]'}>{formatBytes(item.size)}</div>
                      <div className={`truncate ${selected ? 'text-white/85' : 'text-[var(--text-secondary)]'}`}>{item.type}</div>
                      <div className={`truncate ${selected ? 'text-white/85' : 'text-[var(--text-secondary)]'}`}>{item.modified}</div>
                    </button>
                  );
                })}
              </div>
            ) : viewMode === 'column' ? (
              <div className="grid h-full min-h-[260px] grid-cols-[minmax(190px,0.95fr)_minmax(190px,1fr)_minmax(180px,0.9fr)] overflow-hidden rounded-[12px] bg-white ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/5 [.theme-dark_&]:ring-white/10">
                <div className="min-w-0 overflow-auto border-r border-black/[0.07] [.theme-dark_&]:border-white/10">
                  {items.map((item) => {
                    const selected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`flex h-10 w-full items-center gap-2 px-3 text-left text-[13px] outline-none ${
                          selected ? 'bg-blue-500/85 text-white' : 'hover:bg-black/[0.035] [.theme-dark_&]:hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedId(item.id)}
                        onDoubleClick={() => openItem(item)}
                      >
                        <ItemGlyph item={item} selected={selected} pixelSize={28} />
                        <span className="min-w-0 flex-1 truncate font-medium">{item.name}</span>
                        {item.kind === 'folder' ? <span className={selected ? 'text-white/75' : 'text-[var(--text-secondary)]'}>›</span> : null}
                      </button>
                    );
                  })}
                </div>
                <div className="min-w-0 overflow-auto border-r border-black/[0.07] bg-black/[0.015] [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/[0.03]">
                  {columnFolderPath ? (
                    columnItems.length > 0 ? (
                      columnItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="flex h-10 w-full items-center gap-2 px-3 text-left text-[13px] outline-none hover:bg-black/[0.035] [.theme-dark_&]:hover:bg-white/10"
                          onClick={() => setActionMessage(`${item.name} in ${visibleSelectedItem?.name}`)}
                          onDoubleClick={() => {
                            if (item.kind === 'folder' && columnFolderPath) {
                              navigateTo(`${columnFolderPath}/${item.id}`);
                            }
                          }}
                        >
                          <ItemGlyph item={item} selected={false} pixelSize={28} />
                          <span className="min-w-0 flex-1 truncate font-medium">{item.name}</span>
                          {item.kind === 'folder' ? <span className="text-[var(--text-secondary)]">›</span> : null}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-5 text-[13px] text-[var(--text-secondary)]">No items</div>
                    )
                  ) : (
                    <div className="px-4 py-5 text-[13px] text-[var(--text-secondary)]">Select a folder to browse its contents.</div>
                  )}
                </div>
                <div className="min-w-0 p-4">
                  {visibleSelectedItem ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <ItemGlyph item={visibleSelectedItem} selected={false} pixelSize={72} />
                      <div className="mt-3 max-w-full truncate text-[14px] font-semibold">{visibleSelectedItem.name}</div>
                      <div className="mt-1 text-[12px] text-[var(--text-secondary)]">{visibleSelectedItem.type}</div>
                      <div className="mt-3 grid w-full gap-1 text-left text-[12px] text-[var(--text-secondary)]">
                        <div className="flex justify-between gap-4">
                          <span>Size</span>
                          <span>{formatBytes(visibleSelectedItem.size)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Modified</span>
                          <span className="truncate">{visibleSelectedItem.modified}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid h-full place-items-center text-[13px] text-[var(--text-secondary)]">No item selected</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid h-full min-h-[260px] grid-rows-[minmax(0,1fr)_92px] gap-4">
                <div className="grid place-items-center rounded-[12px] bg-white ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/5 [.theme-dark_&]:ring-white/10">
                  {galleryItem ? (
                    <div className="flex max-w-[420px] flex-col items-center p-6 text-center">
                      <ItemGlyph item={galleryItem} selected={galleryItem.id === selectedId} pixelSize={96} />
                      <div className="mt-4 max-w-full truncate text-[17px] font-semibold tracking-[-0.01em]">{galleryItem.name}</div>
                      <div className="mt-1 text-[13px] text-[var(--text-secondary)]">{galleryItem.type}</div>
                      <div className="mt-4 grid w-full max-w-[260px] gap-1 text-left text-[12px] text-[var(--text-secondary)]">
                        <div className="flex justify-between gap-4">
                          <span>Size</span>
                          <span>{formatBytes(galleryItem.size)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Modified</span>
                          <span className="truncate">{galleryItem.modified}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2 overflow-x-auto rounded-[12px] bg-white p-2 ring-1 ring-black/[0.07] [.theme-dark_&]:bg-white/5 [.theme-dark_&]:ring-white/10">
                  {items.map((item) => {
                    const selected = (selectedId ?? galleryItem?.id) === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`flex w-[86px] shrink-0 flex-col items-center justify-center rounded-[10px] p-2 text-center outline-none ${
                          selected ? 'bg-blue-500/15 ring-1 ring-blue-400/45' : 'hover:bg-black/[0.035] [.theme-dark_&]:hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedId(item.id)}
                        onDoubleClick={() => openItem(item)}
                      >
                        <ItemGlyph item={item} selected={selected} pixelSize={42} />
                        <span className={`mt-1 line-clamp-1 max-w-full text-[11px] ${selected ? 'font-semibold' : 'text-[var(--text-secondary)]'}`}>
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <footer className="flex h-8 shrink-0 items-center gap-4 border-t border-black/[0.07] bg-[rgba(245,245,247,0.72)] px-4 text-[12px] text-[var(--text-secondary)] backdrop-blur-[20px] backdrop-saturate-[180%] [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/45">
        <span className="shrink-0 tabular-nums">{itemStatus}</span>
        <span className="min-w-0 flex-1 truncate text-center">{selectedStatus}</span>
        <label className="flex shrink-0 items-center gap-2">
          <span className="whitespace-nowrap text-[11px]">Icon size</span>
          <input
            className="h-4 w-[120px] accent-blue-500"
            type="range"
            min={36}
            max={88}
            step={1}
            value={iconSize}
            aria-label="Icon size"
            onChange={(event) => setIconSize(Number(event.target.value))}
          />
        </label>
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
    height: 420,
    minWidth: 640,
    minHeight: 390,
  },
  Component: FinderApp,
};
