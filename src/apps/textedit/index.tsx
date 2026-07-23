import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppDefinition } from '../types';

const sessionDocument = {
  title: 'Untitled',
  body: 'Start writing here. This document stays in memory while this browser session is open.',
};

function TextEditApp() {
  const [title, setTitle] = useState(sessionDocument.title);
  const [body, setBody] = useState(sessionDocument.body);

  useEffect(() => {
    sessionDocument.title = title;
    sessionDocument.body = body;
  }, [body, title]);

  return (
    <div className="flex h-full flex-col bg-white/18 text-[var(--text-primary)]">
      <div className="border-b border-white/25 bg-white/18 px-5 py-3 backdrop-blur-xl">
        <input
          className="w-full rounded-lg border border-transparent bg-transparent px-1 text-xl font-semibold outline-none transition placeholder:text-[var(--text-secondary)] focus:border-white/35 focus:bg-white/20"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Document title"
          aria-label="Document title"
        />
      </div>
      <textarea
        className="min-h-0 flex-1 resize-none bg-white/95 px-6 py-5 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-500"
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
