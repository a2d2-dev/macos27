import type { AppDefinition } from './types';
import { finderApp } from './finder';
import { musicApp } from './music';
import { notesApp } from './notes';
import { previewApp } from './preview';
import { settingsApp } from './settings';
import { textEditApp } from './textedit';

export const apps: AppDefinition[] = [
  finderApp,
  notesApp,
  previewApp,
  musicApp,
  settingsApp,
  textEditApp,
];

export const appById = new Map(apps.map((app) => [app.id, app]));
