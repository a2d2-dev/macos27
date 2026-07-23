import { Settings } from 'lucide-react';
import { AppPlaceholder } from '../AppPlaceholder';
import type { AppDefinition } from '../types';

function SettingsApp() {
  return (
    <AppPlaceholder
      title="System Settings"
      body="Settings is intentionally a placeholder in T1; theme state is already centralized for future panels."
    />
  );
}

export const settingsApp: AppDefinition = {
  id: 'settings',
  title: 'Settings',
  icon: Settings,
  defaultWindow: {
    width: 620,
    height: 430,
    minWidth: 420,
    minHeight: 300,
  },
  Component: SettingsApp,
};
