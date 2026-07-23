import { Music } from 'lucide-react';
import { AppPlaceholder } from '../AppPlaceholder';
import type { AppDefinition } from '../types';

function MusicApp() {
  return <AppPlaceholder title="Music" body="Mock media controls will be added after the desktop foundation is merged." />;
}

export const musicApp: AppDefinition = {
  id: 'music',
  title: 'Music',
  icon: Music,
  iconGradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  defaultWindow: {
    width: 560,
    height: 360,
    minWidth: 360,
    minHeight: 260,
  },
  Component: MusicApp,
};
