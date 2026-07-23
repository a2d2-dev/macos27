import { Image } from 'lucide-react';
import { AppPlaceholder } from '../AppPlaceholder';
import type { AppDefinition } from '../types';

function PreviewApp() {
  return <AppPlaceholder title="Preview" body="A placeholder app surface for later document and image flows." />;
}

export const previewApp: AppDefinition = {
  id: 'preview',
  title: 'Preview',
  icon: Image,
  iconGradient: 'from-cyan-200 via-sky-400 to-blue-500',
  defaultWindow: {
    width: 600,
    height: 420,
    minWidth: 380,
    minHeight: 280,
  },
  Component: PreviewApp,
};
