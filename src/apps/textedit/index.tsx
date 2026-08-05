import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFsStore } from '../../store/fsStore';
import type { AppDefinition } from '../types';

const sessionDocument = {
  title: 'Untitled',
  body: 'Start writing here. This document stays in memory while this browser session is open.',
};

const desktopTextFilePaths: Record<string, string> = {
  'Welcome.txt': '/Desktop/Welcome.txt',
};

function selectedDesktopTextFilePath() {
  if (typeof document === 'undefined') {
    return null;
  }

  const selectedDesktopFile = document.querySelector<HTMLButtonElement>('.desktop-icon.is-selected[aria-label]');
  const fileName = selectedDesktopFile?.getAttribute('aria-label') ?? '';

  return desktopTextFilePaths[fileName] ?? null;
}

function TextEditApp() {
  const [openedFilePath, setOpenedFilePath] = useState(selectedDesktopTextFilePath);
  const openedFile = useFsStore((state) => (openedFilePath ? state.getItemByPath(openedFilePath) : null));
  const openedFileBody = openedFile?.kind === 'file' ? openedFile.content ?? '' : '';
  const [title, setTitle] = useState(openedFile?.name ?? sessionDocument.title);
  const [body, setBody] = useState(openedFile ? openedFileBody : sessionDocument.body);

  useEffect(() => {
    const nextFilePath = selectedDesktopTextFilePath();

    if (!nextFilePath || nextFilePath === openedFilePath) {
      return;
    }

    const nextFile = useFsStore.getState().getItemByPath(nextFilePath);

    if (nextFile?.kind !== 'file') {
      return;
    }

    setOpenedFilePath(nextFilePath);
    setTitle(nextFile.name);
    setBody(nextFile.content ?? '');
  }, [openedFilePath]);

  useEffect(() => {
    if (openedFile) {
      return;
    }

    sessionDocument.title = title;
    sessionDocument.body = body;
  }, [body, openedFile, title]);

  return (
    <div className="flex h-full flex-col bg-white/18 text-[var(--text-primary)] [.theme-dark_&]:bg-black/[0.06]">
      <div className="border-b border-white/25 bg-white/18 px-5 py-3 backdrop-blur-xl [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/28">
        <input
          className="w-full rounded-lg border border-transparent bg-transparent px-1 text-xl font-semibold outline-none transition placeholder:text-[var(--text-secondary)] focus:border-white/35 focus:bg-white/20"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Document title"
          aria-label="Document title"
        />
      </div>
      <textarea
        className="min-h-0 flex-1 resize-none bg-white/95 px-6 py-5 text-base leading-8 text-slate-900 outline-none placeholder:text-slate-500 [.theme-dark_&]:bg-slate-950 [.theme-dark_&]:text-slate-50 [.theme-dark_&]:placeholder:text-slate-500"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write something..."
        aria-label="Document body"
        spellCheck="true"
      />
    </div>
  );
}

export const textEditApp: AppDefinition = {
  id: 'textedit',
  title: 'TextEdit',
  icon: FileText,
  iconGradient: 'from-emerald-200 via-teal-400 to-cyan-500',
  defaultWindow: {
    width: 500,
    height: 360,
    minWidth: 340,
    minHeight: 240,
  },
  Component: TextEditApp,
};
