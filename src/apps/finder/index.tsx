import { Folder } from 'lucide-react';
import { AppPlaceholder } from '../AppPlaceholder';
import type { AppDefinition } from '../types';

function FinderApp() {
  return (
    <AppPlaceholder
      title="Finder"
      body="Finder content is reserved for T2. This shell proves the app can launch through the shared window manager."
    />
  );
}

export const finderApp: AppDefinition = {
  id: 'finder',
  title: 'Finder',
  icon: Folder,
  defaultWindow: {
    width: 680,
    height: 440,
    minWidth: 420,
    minHeight: 300,
  },
  Component: FinderApp,
};
