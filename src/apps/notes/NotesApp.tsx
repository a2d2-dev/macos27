import { useState } from 'react';

const starterText = `Meeting notes

- Keep the window shell generic
- Apps register themselves through src/apps/registry.ts
- Notes owns only its content`;

export function NotesApp() {
  const [text, setText] = useState(starterText);

  return (
    <div className="flex h-full flex-col bg-[rgba(255,255,255,0.2)] text-[var(--text-primary)]">
      <textarea
        className="h-full w-full resize-none bg-transparent p-5 text-[15px] leading-6 outline-none placeholder:text-slate-400"
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck
        aria-label="Notes editor"
      />
    </div>
  );
}
