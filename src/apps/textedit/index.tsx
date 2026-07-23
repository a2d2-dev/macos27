import { FileText } from 'lucide-react';
import { AppPlaceholder } from '../AppPlaceholder';
import type { AppDefinition } from '../types';

function TextEditApp() {
  return <AppPlaceholder title="TextEdit" body="A registered placeholder showing that new apps only need one registry entry." />;
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
