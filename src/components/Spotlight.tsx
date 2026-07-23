import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apps } from '../apps/registry';
import { useWindowStore } from '../store/windowStore';

type SpotlightProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore((state) => state.openApp);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return apps;
    }

    return apps.filter((app) => `${app.title} ${app.id}`.toLowerCase().includes(normalizedQuery));
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setQuery('');
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

    openApp(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[12000]" role="presentation" onPointerDown={onClose}>
      <div
        className="glass-surface-strong absolute left-1/2 top-[18vh] w-[min(680px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[24px] text-[var(--text-primary)]"
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/25 px-5">
          <Search size={24} className="shrink-0 text-[var(--text-secondary)]" />
          <input
            ref={inputRef}
            className="h-full min-w-0 flex-1 bg-transparent text-3xl font-semibold outline-none placeholder:text-[var(--text-secondary)]"
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
                setSelectedIndex((index) => (results.length ? (index + 1) % results.length : 0));
                return;
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
                return;
              }

              if (event.key === 'Enter') {
                event.preventDefault();
                launchSelected();
              }
            }}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
          />
        </div>

        <div className="max-h-[360px] overflow-auto p-2">
          {results.length ? (
            results.map((app, index) => {
              const Icon = app.icon;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={app.id}
                  type="button"
                  className={`flex h-14 w-full items-center gap-3 rounded-[14px] px-3 text-left outline-none transition ${
                    isSelected ? 'bg-white/42 shadow-sm' : 'hover:bg-white/22 focus-visible:bg-white/28'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    openApp(app);
                    onClose();
                  }}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br ${app.iconGradient} text-white shadow-md`}>
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{app.title}</span>
                    <span className="block truncate text-xs text-[var(--text-secondary)]">Application</span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">No applications found</div>
          )}
        </div>
      </div>
    </div>
  );
}
