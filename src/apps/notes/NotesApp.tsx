import { useMemo, useState } from 'react';
import {
  Bold,
  CheckSquare,
  Cloud,
  Folder,
  Highlighter,
  Italic,
  Link2,
  List,
  Monitor,
  Search,
  SquarePen,
  Strikethrough,
  Table2,
  Tag,
  Trash2,
  Underline,
  Upload,
} from 'lucide-react';

type Note = {
  id: string;
  title: string;
  snippet: string;
  relativeTime: string;
  folder: 'Notes' | 'Personal' | 'Travel';
  tags: string[];
  body: string;
  pinned?: boolean;
};

const seededNotes: Note[] = [
  {
    id: 'launch-checklist',
    title: 'macOS 27 Launch Checklist',
    snippet: 'Glass sidebar component docs, dock spacing, and final UI pass.',
    relativeTime: '6:05 AM',
    folder: 'Notes',
    tags: ['#work'],
    pinned: true,
    body: `macOS 27 Launch Checklist

Glass sidebar component docs
- Keep unified panes with hairline dividers
- Match the default window to the reference width
- Verify light and dark mode screenshots
- Push the feature branch after TypeScript passes`,
  },
  {
    id: 'liquid-glass-demo',
    title: 'Liquid Glass demo ideas',
    snippet: 'Refraction toggle side-by-side, subtle toolbar hover states.',
    relativeTime: '2:05 AM',
    folder: 'Notes',
    tags: ['#work'],
    body: `Liquid Glass demo ideas

Refraction toggle side-by-side
Toolbar buttons should stay quiet until hover
Folder rows need the Notes yellow accent only for selection

Potential demos:
- Split editor preview
- Tiny checklist interaction
- Export surface`,
  },
  {
    id: 'meeting-notes',
    title: 'Meeting notes -- Q3 planning',
    snippet: 'Wayne and team refreshed wraps for the Notes app surface.',
    relativeTime: 'Yesterday',
    folder: 'Personal',
    tags: ['#personal'],
    body: `Meeting notes -- Q3 planning

Wayne and team refreshed wraps for the Notes app surface.

Agenda
- Review folder navigation
- Pick the first shipped toolbar controls
- Keep rich text persistence out of scope

Follow-up: collect dark mode screenshots before handoff.`,
  },
  {
    id: 'miso-ramen',
    title: 'Recipe -- Miso ramen',
    snippet: 'Ingredients: miso paste, sesame oil, scallions, noodles, egg.',
    relativeTime: 'Sat',
    folder: 'Travel',
    tags: ['#personal'],
    body: `Recipe -- Miso ramen

Ingredients
- Miso paste
- Sesame oil
- Scallions
- Noodles
- Soft boiled egg

Finish with chili crisp and a small splash of rice vinegar.`,
  },
];

const folderSections = [
  {
    title: 'iCloud',
    items: [
      { label: 'Notes', count: 4, icon: Cloud },
      { label: 'Personal', count: 2, icon: Folder },
    ],
  },
  {
    title: 'On My Mac',
    items: [{ label: 'Travel', count: 1, icon: Monitor }],
  },
];

const tagItems = [
  { label: '#work', count: 2 },
  { label: '#personal', count: 1 },
];

const toolbarGroups = [
  [
    { label: 'Bold', icon: Bold },
    { label: 'Italic', icon: Italic },
    { label: 'Underline', icon: Underline },
    { label: 'Strikethrough', icon: Strikethrough },
  ],
  [
    { label: 'Checklist', icon: CheckSquare },
    { label: 'List', icon: List },
    { label: 'Table', icon: Table2 },
  ],
  [
    { label: 'Link', icon: Link2 },
    { label: 'Highlight', icon: Highlighter },
    { label: 'Export', icon: Upload },
  ],
];

function buildSnippet(body: string) {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .join(' ')
    .slice(0, 72);
}

function SidebarRow({
  active,
  count,
  icon: Icon,
  label,
}: {
  active?: boolean;
  count: number;
  icon: typeof Cloud;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-[13px] font-medium outline-none transition ${
        active
          ? 'bg-yellow-400/85 text-slate-950 shadow-sm ring-1 ring-yellow-500/20 [.theme-dark_&]:bg-yellow-300/90'
          : 'text-[var(--text-primary)] hover:bg-white/50 focus-visible:bg-white/60 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:focus-visible:bg-white/15'
      }`}
    >
      <Icon size={15} strokeWidth={1.9} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={active ? 'text-slate-800/65' : 'text-[var(--text-secondary)]'}>{count}</span>
    </button>
  );
}

function ToolbarButton({ icon: Icon, label, onClick }: { icon: typeof Bold; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-[8px] text-[var(--text-primary)] outline-none transition hover:bg-black/[0.055] focus-visible:bg-black/[0.075] active:scale-[0.97] [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:focus-visible:bg-white/15"
    >
      <Icon size={16} strokeWidth={1.85} />
    </button>
  );
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(seededNotes);
  const [selectedId, setSelectedId] = useState(seededNotes[0].id);
  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0] ?? null;

  const folderCounts = useMemo(
    () =>
      notes.reduce<Record<string, number>>((counts, note) => {
        counts[note.folder] = (counts[note.folder] ?? 0) + 1;
        return counts;
      }, {}),
    [notes],
  );

  const tagCounts = useMemo(
    () =>
      notes.reduce<Record<string, number>>((counts, note) => {
        note.tags.forEach((tag) => {
          counts[tag] = (counts[tag] ?? 0) + 1;
        });
        return counts;
      }, {}),
    [notes],
  );

  const updateSelectedBody = (body: string) => {
    if (!selectedNote) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: body.split('\n').find((line) => line.trim())?.trim() || 'Untitled Note',
              snippet: buildSnippet(body) || 'No additional text',
              body,
            }
          : note,
      ),
    );
  };

  const createNote = () => {
    const newNote: Note = {
      id: `new-note-${Date.now()}`,
      title: 'Untitled Note',
      snippet: 'No additional text',
      relativeTime: 'Now',
      folder: 'Notes',
      tags: [],
      body: '',
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedId(newNote.id);
  };

  const deleteSelectedNote = () => {
    if (!selectedNote) {
      return;
    }

    setNotes((currentNotes) => {
      const remainingNotes = currentNotes.filter((note) => note.id !== selectedNote.id);
      setSelectedId(remainingNotes[0]?.id ?? '');
      return remainingNotes;
    });
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-[#f5f5f7]/95 text-[var(--text-primary)] antialiased [.theme-dark_&]:bg-slate-950/60">
      <aside className="flex w-[205px] shrink-0 flex-col border-r border-black/[0.07] bg-white/50 px-3 py-3 backdrop-blur-2xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/40">
        <div className="min-h-0 flex-1 space-y-4 overflow-auto">
          {folderSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-1 px-2 text-[11px] font-semibold leading-5 text-[var(--text-secondary)]">{section.title}</h2>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarRow
                    key={item.label}
                    active={item.label === 'Notes'}
                    count={item.label === 'Notes' ? notes.length : folderCounts[item.label] ?? item.count}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="mb-1 px-2 text-[11px] font-semibold leading-5 text-[var(--text-secondary)]">Tags</h2>
            <div className="space-y-0.5">
              {tagItems.map((tag) => (
                <SidebarRow
                  key={tag.label}
                  count={tagCounts[tag.label] ?? tag.count}
                  icon={Tag}
                  label={tag.label}
                />
              ))}
            </div>
          </section>
        </div>

        <SidebarRow count={0} icon={Trash2} label="Recently Deleted" />
      </aside>

      <section className="flex w-[245px] shrink-0 flex-col border-r border-black/[0.07] bg-white/80 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-900/80">
        <div className="border-b border-black/[0.07] p-3 [.theme-dark_&]:border-white/10">
          <div className="flex h-8 items-center gap-2 rounded-[8px] bg-black/[0.055] px-3 text-[12px] text-[var(--text-secondary)] [.theme-dark_&]:bg-white/10">
            <Search size={14} strokeWidth={1.8} />
            <span>Search all notes</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="px-3 pb-1 pt-2 text-[11px] font-medium text-[var(--text-secondary)]">Pinned</div>
          {notes.map((note) => {
            const selected = note.id === selectedNote?.id;
            return (
              <button
                key={note.id}
                type="button"
                className={`block w-full border-b border-black/[0.07] px-3 py-3 text-left outline-none transition last:border-b-0 [.theme-dark_&]:border-white/10 ${
                  selected
                    ? 'bg-yellow-100/95 shadow-[inset_3px_0_0_rgba(250,204,21,0.95)] [.theme-dark_&]:bg-yellow-300/20'
                    : 'hover:bg-black/[0.035] focus-visible:bg-black/[0.045] [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:focus-visible:bg-white/10'
                }`}
                onClick={() => setSelectedId(note.id)}
              >
                <div className="truncate text-[14px] font-semibold leading-5 tracking-[-0.01em]">{note.title}</div>
                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[12px] leading-4">
                  <span className={selected ? 'shrink-0 text-slate-600 [.theme-dark_&]:text-yellow-100/85' : 'shrink-0 text-[var(--text-primary)]'}>
                    {note.relativeTime}
                  </span>
                  <span className="min-w-0 truncate text-[var(--text-secondary)]">{note.snippet}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <main className="flex min-w-0 flex-1 flex-col bg-white [.theme-dark_&]:bg-slate-950">
        <header className="flex h-[44px] shrink-0 items-center justify-between gap-2 border-b border-black/[0.07] bg-white/90 px-3 backdrop-blur-xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/80">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="flex h-8 items-center gap-6 rounded-[8px] px-3 text-[13px] text-[var(--text-primary)] outline-none transition hover:bg-black/[0.055] focus-visible:bg-black/[0.075] [.theme-dark_&]:hover:bg-white/10"
              aria-label="Paragraph style"
            >
              <span>Body</span>
              <span className="text-[var(--text-secondary)]">⌄</span>
            </button>

            {toolbarGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex items-center border-l border-black/[0.07] pl-2 [.theme-dark_&]:border-white/10">
                {group.map((item) => (
                  <ToolbarButton key={item.label} icon={item.icon} label={item.label} />
                ))}
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 border-l border-black/[0.07] pl-2 [.theme-dark_&]:border-white/10">
            <ToolbarButton icon={Trash2} label="Delete note" onClick={deleteSelectedNote} />
            <ToolbarButton icon={SquarePen} label="New note" onClick={createNote} />
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-hidden">
          {selectedNote ? (
            <textarea
              key={selectedNote.id}
              className="h-full w-full resize-none bg-transparent px-8 py-7 text-[16px] leading-7 text-slate-900 outline-none placeholder:text-slate-400 [.theme-dark_&]:text-slate-50 [.theme-dark_&]:placeholder:text-slate-500"
              value={selectedNote.body}
              onChange={(event) => updateSelectedBody(event.target.value)}
              placeholder="Start a new note"
              spellCheck
              aria-label={`${selectedNote.title} note editor`}
            />
          ) : (
            <div className="grid h-full place-items-center">
              <button
                type="button"
                onClick={createNote}
                className="flex h-10 items-center gap-2 rounded-[12px] bg-white px-4 text-[13px] font-medium text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,.05),0_8px_24px_rgba(0,0,0,.06)] ring-1 ring-black/[0.07] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,.1)] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:ring-white/10"
              >
                <SquarePen size={16} strokeWidth={1.85} />
                New Note
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
