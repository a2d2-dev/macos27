import { StickyNote } from 'lucide-react';
import type { AppDefinition } from '../types';
import { NotesApp } from './NotesApp';

export const notesApp: AppDefinition = {
  id: 'notes',
  title: 'Notes',
  icon: StickyNote,
  iconGradient: 'from-yellow-200 via-amber-300 to-orange-400',
  defaultWindow: {
    width: 520,
    height: 380,
    minWidth: 340,
    minHeight: 240,
  },
  Component: NotesApp,
};
