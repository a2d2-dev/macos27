import { ChevronRight } from 'lucide-react';
import { useSystemStore } from '../../store/systemStore';

type MenuItem = {
  label: string;
  shortcut?: string;
  separatorBefore?: boolean;
  disabled?: boolean;
  submenu?: boolean;
  action?: 'showLogin' | 'restartSystem';
};

const appleMenuItems: MenuItem[] = [
  { label: 'About This Mac' },
  { label: 'System Settings...', separatorBefore: true },
  { label: 'App Store...' },
  { label: 'Recent Items', separatorBefore: true, submenu: true },
  { label: 'Force Quit...', shortcut: '⌥⌘⎋', separatorBefore: true },
  { label: 'Sleep', separatorBefore: true },
  { label: 'Restart...', action: 'restartSystem' },
  { label: 'Shut Down...', action: 'restartSystem' },
  { label: 'Lock Screen', shortcut: '⌃⌘Q', separatorBefore: true, action: 'showLogin' },
  { label: 'Log Out LF...', shortcut: '⇧⌘Q', action: 'showLogin' },
];

const appMenuItems: MenuItem[] = [
  { label: 'About Finder' },
  { label: 'Settings...', shortcut: '⌘,' },
  { label: 'Services', separatorBefore: true, submenu: true },
  { label: 'Hide Finder', shortcut: '⌘H', separatorBefore: true },
  { label: 'Hide Others', shortcut: '⌥⌘H' },
  { label: 'Show All', disabled: true },
  { label: 'Quit Finder', shortcut: '⌘Q', separatorBefore: true },
];

const menuItemsByName: Record<string, MenuItem[]> = {
  File: [
    { label: 'New Finder Window', shortcut: '⌘N' },
    { label: 'New Folder', shortcut: '⇧⌘N' },
    { label: 'Open', shortcut: '⌘O', separatorBefore: true },
    { label: 'Close Window', shortcut: '⌘W' },
  ],
  Edit: [
    { label: 'Undo', shortcut: '⌘Z' },
    { label: 'Redo', shortcut: '⇧⌘Z' },
    { label: 'Cut', shortcut: '⌘X', separatorBefore: true },
    { label: 'Copy', shortcut: '⌘C' },
    { label: 'Paste', shortcut: '⌘V' },
  ],
  View: [
    { label: 'as Icons', shortcut: '⌘1' },
    { label: 'as List', shortcut: '⌘2' },
    { label: 'Show Sidebar', separatorBefore: true },
    { label: 'Show View Options', shortcut: '⌘J' },
  ],
  Go: [
    { label: 'Back', shortcut: '⌘[' },
    { label: 'Forward', shortcut: '⌘]' },
    { label: 'Applications', shortcut: '⇧⌘A', separatorBefore: true },
    { label: 'Home', shortcut: '⇧⌘H' },
  ],
  Window: [
    { label: 'Minimize', shortcut: '⌘M' },
    { label: 'Zoom' },
    { label: 'Bring All to Front', separatorBefore: true },
  ],
  Help: [{ label: 'macOS Help' }, { label: 'Search', shortcut: '⌘?' }],
};

function MenuContent({ items }: { items: MenuItem[] }) {
  const closeMenus = useSystemStore((state) => state.closeMenus);
  const showLogin = useSystemStore((state) => state.showLogin);
  const restartSystem = useSystemStore((state) => state.restartSystem);

  const runAction = (action: MenuItem['action']) => {
    closeMenus();

    if (action === 'showLogin') {
      showLogin();
    }

    if (action === 'restartSystem') {
      restartSystem();
    }
  };

  return (
    <div className="glass-popover min-w-[214px] rounded-xl p-1.5 text-[13px] font-normal text-[var(--text-primary)]">
      {items.map((item) => (
        <button
          key={`${item.label}-${item.shortcut ?? ''}`}
          type="button"
          disabled={item.disabled}
          className={`flex h-7 w-full items-center gap-4 rounded-lg px-2 text-left outline-none transition ${
            item.separatorBefore ? 'mt-1 border-t border-white/25 pt-1' : ''
          } ${item.disabled ? 'text-[var(--text-secondary)] opacity-45' : 'hover:bg-[#0a84ff] hover:text-white focus-visible:bg-[#0a84ff] focus-visible:text-white'}`}
          onClick={() => runAction(item.action)}
        >
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.shortcut ? <span className="text-[12px] opacity-70">{item.shortcut}</span> : null}
          {item.submenu ? <ChevronRight size={13} className="opacity-70" /> : null}
        </button>
      ))}
    </div>
  );
}

export function AppleMenu() {
  return <MenuContent items={appleMenuItems} />;
}

export function AppMenu({ appName }: { appName: string }) {
  const items = appName === 'Finder' ? appMenuItems : appMenuItems.map((item) => ({ ...item, label: item.label.replace('Finder', appName) }));

  return <MenuContent items={items} />;
}

export function NamedMenu({ name }: { name: string }) {
  return <MenuContent items={menuItemsByName[name] ?? []} />;
}
