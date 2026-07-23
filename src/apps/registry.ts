import type { AppDefinition } from './types';
import { calculatorApp } from './calculator';
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
  calculatorApp,
  settingsApp,
  textEditApp,
];

export const appById = new Map(apps.map((app) => [app.id, app]));
