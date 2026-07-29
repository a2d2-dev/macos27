import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  FileText,
  Folder,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { appById, apps } from '../apps/registry';
import type { AppDefinition } from '../apps/types';
import { useWindowStore } from '../store/windowStore';

type SpotlightProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SpotlightCategory = 'apps' | 'files' | 'actions' | 'clipboard';

type SpotlightEntry = {
  id: string;
  category: SpotlightCategory;
  title: string;
  subtitle: string;
  keywords: string;
  Icon: LucideIcon;
  iconClassName: string;
  launchApp: AppDefinition;
};

const categories: Array<{ id: SpotlightCategory; label: string }> = [
  { id: 'apps', label: 'Apps' },
  { id: 'files', label: 'Files' },
  { id: 'actions', label: 'Actions' },
  { id: 'clipboard', label: 'Clipboard' },
];

function launchTarget(appId: string) {
  const app = appById.get(appId);

  if (!app) {
    throw new Error(`Spotlight launch target "${appId}" is not registered`);
  }

  return app;
}

const appEntries: SpotlightEntry[] = apps.map((app) => ({
  id: `app-${app.id}`,
  category: 'apps',
  title: app.title,
  subtitle: 'Application',
  keywords: `${app.title} ${app.id} application app`,
  Icon: app.icon,
  iconClassName: `bg-gradient-to-br ${app.iconGradient} text-white shadow-sm`,
  launchApp: app,
}));

const fileEntries: SpotlightEntry[] = [
  {
    id: 'file-tahoe-trip',
    category: 'files',
    title: 'Tahoe Trip',
    subtitle: 'Folder',
    keywords: 'tahoe trip folder finder files desktop',
    Icon: Folder,
    iconClassName:
      'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-sm',
    launchApp: launchTarget('finder'),
  },
  {
    id: 'file-welcome',
    category: 'files',
    title: 'Welcome.txt',
    subtitle: 'Text Document',
    keywords: 'welcome txt text document desktop file',
    Icon: FileText,
    iconClassName:
      'bg-gradient-to-br from-emerald-200 via-teal-400 to-cyan-500 text-white shadow-sm',
    launchApp: launchTarget('textedit'),
  },
  {
    id: 'file-design-review',
    category: 'files',
    title: 'Design review notes',
    subtitle: 'Notes Document',
    keywords: 'design review notes document meeting recents',
    Icon: FileText,
    iconClassName:
      'bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 text-slate-900 shadow-sm',
    launchApp: launchTarget('notes'),
  },
];

const actionEntries: SpotlightEntry[] = [
  {
    id: 'action-system-settings',
    category: 'actions',
    title: 'Open Appearance Settings',
    subtitle: 'Action',
    keywords: 'open appearance settings dark light wallpaper action',
    Icon: Sparkles,
    iconClassName:
      'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 text-white shadow-sm',
    launchApp: launchTarget('settings'),
  },
  {
    id: 'action-play-music',
    category: 'actions',
    title: 'Play recent music',
    subtitle: 'Action',
    keywords: 'play music recent song album action',
    Icon: Zap,
    iconClassName:
      'bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600 text-white shadow-sm',
    launchApp: launchTarget('music'),
  },
];

const clipboardEntries: SpotlightEntry[] = [
  {
    id: 'clipboard-review',
    category: 'clipboard',
    title: 'Design review',
    subtitle: 'Clipboard Text',
    keywords: 'design review clipboard copied text notes',
    Icon: ClipboardList,
    iconClassName:
      'bg-gradient-to-br from-indigo-300 via-violet-400 to-fuchsia-500 text-white shadow-sm',
    launchApp: launchTarget('notes'),
  },
  {
    id: 'clipboard-welcome',
    category: 'clipboard',
    title: 'Welcome note',
    subtitle: 'Clipboard Text',
    keywords: 'welcome note clipboard copied textedit',
    Icon: ClipboardList,
    iconClassName:
      'bg-gradient-to-br from-emerald-200 via-teal-400 to-cyan-500 text-white shadow-sm',
    launchApp: launchTarget('textedit'),
  },
];

const spotlightEntries = [
  ...appEntries,
  ...fileEntries,
  ...actionEntries,
  ...clipboardEntries,
];

export function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] =
    useState<SpotlightCategory>('apps');
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore((state) => state.openApp);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryEntries = spotlightEntries.filter(
      (entry) => entry.category === activeCategory,
    );

    if (!normalizedQuery) {
      return categoryEntries.slice(0, 2);
    }

    return categoryEntries.filter((entry) =>
      `${entry.title} ${entry.subtitle} ${entry.keywords}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [activeCategory, query]);

  const sectionLabel = query.trim()
    ? categories.find((category) => category.id === activeCategory)?.label
    : 'Recents';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery('');
    setActiveCategory('apps');
    setSelectedIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex > results.length - 1) {
      setSelectedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, selectedIndex]);

  if (!isOpen) {
    return null;
  }

  const launchSelected = () => {
    const selected = results[selectedIndex];
    if (!selected) {
      return;
    }

    openApp(selected.launchApp);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[12000]"
      role="presentation"
      onPointerDown={onClose}
    >
      <style>{`
        .spotlight-panel {
          transform-origin: top center;
          transition:
            transform 400ms cubic-bezier(0.32, 0.72, 0, 1),
            opacity 400ms cubic-bezier(0.32, 0.72, 0, 1),
            backdrop-filter 400ms cubic-bezier(0.32, 0.72, 0, 1),
            -webkit-backdrop-filter 400ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        .spotlight-category:active,
        .spotlight-result:active {
          transform: scale(0.98);
          transition: transform 100ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .spotlight-panel,
          .spotlight-category,
          .spotlight-result {
            transition: opacity 200ms ease;
            transform: none !important;
          }
        }

        @media (prefers-reduced-transparency: reduce) {
          .spotlight-panel {
            background: #fff;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }

          .theme-dark .spotlight-panel {
            background: #0f172a;
          }
        }

        @media (prefers-contrast: more) {
          .spotlight-panel {
            background: #fff;
            border: 1px solid rgba(0, 0, 0, 0.35);
          }

          .theme-dark .spotlight-panel {
            background: #0f172a;
            border-color: rgba(255, 255, 255, 0.42);
          }
        }
      `}</style>
      <div
        className="spotlight-panel glass-popover absolute left-1/2 top-[22vh] w-[min(680px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[22px] text-[var(--text-primary)] antialiased"
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-16 items-center gap-3 border-b border-[var(--hairline)] px-4 py-2.5 max-[640px]:flex-wrap">
          <div className="flex h-11 min-w-[220px] flex-1 items-center gap-3">
            <Search
              size={23}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--text-secondary)]"
            />
            <input
              ref={inputRef}
              className="h-full min-w-0 flex-1 bg-transparent text-[26px] font-normal leading-none tracking-[-0.01em] outline-none placeholder:text-[var(--text-secondary)]"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  onClose();
                  return;
                }

                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setSelectedIndex((index) =>
                    results.length ? (index + 1) % results.length : 0,
                  );
                  return;
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setSelectedIndex((index) =>
                    results.length
                      ? (index - 1 + results.length) % results.length
                      : 0,
                  );
                  return;
                }

                if (event.key === 'Enter') {
                  event.preventDefault();
                  launchSelected();
                }
              }}
              placeholder="Search"
              aria-label="Search Spotlight"
            />
          </div>

          <div
            className="flex h-[30px] shrink-0 items-center rounded-full bg-black/[0.045] p-0.5 text-[12px] font-medium text-[var(--text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] [.theme-dark_&]:bg-white/[0.08]"
            role="tablist"
            aria-label="Spotlight categories"
          >
            {categories.map((category) => {
              const isActive = category.id === activeCategory;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`spotlight-category h-7 rounded-full px-3 outline-none transition-[background,box-shadow,color,transform] duration-200 ${
                    isActive
                      ? 'bg-white/75 text-[var(--text-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.14)] [.theme-dark_&]:bg-white/16'
                      : 'hover:bg-white/28 focus-visible:bg-white/36 [.theme-dark_&]:hover:bg-white/[0.08] [.theme-dark_&]:focus-visible:bg-white/12'
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-[316px] overflow-auto px-3 pb-2 pt-1">
          <div className="px-1 pb-1 text-[11px] font-medium leading-4 text-[var(--text-secondary)]">
            {sectionLabel}
          </div>
          {results.length ? (
            <div className="overflow-hidden rounded-[12px] bg-white/[0.12] ring-1 ring-white/26 [.theme-dark_&]:bg-white/[0.045] [.theme-dark_&]:ring-white/10">
              {results.map((entry, index) => {
                const Icon = entry.Icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    className={`spotlight-result flex h-11 w-full items-center gap-3 border-t border-[var(--hairline)] px-3 text-left outline-none transition-[background,box-shadow,transform] first:border-t-0 ${
                      isSelected
                        ? 'bg-[#0a84ff]/35 shadow-[inset_0_0_0_1px_rgba(10,132,255,0.18)]'
                        : 'hover:bg-white/20 focus-visible:bg-white/24 [.theme-dark_&]:hover:bg-white/[0.08] [.theme-dark_&]:focus-visible:bg-white/10'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      openApp(entry.launchApp);
                      onClose();
                    }}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] ${entry.iconClassName}`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-semibold leading-5 tracking-[-0.01em]">
                        {entry.title}
                      </span>
                      <span className="block truncate text-[11.5px] leading-4 text-[var(--text-secondary)]">
                        {entry.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
