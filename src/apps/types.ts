import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

export type AppDefinition = {
  id: string;
  title: string;
  icon: LucideIcon;
  defaultWindow: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
  Component: ComponentType;
};
