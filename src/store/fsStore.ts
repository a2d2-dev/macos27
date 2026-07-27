import { create } from 'zustand';

export type FsItemKind = 'folder' | 'file';

export type FsItem = {
  id: string;
  name: string;
  kind: FsItemKind;
  type: string;
  size: number | null;
  icon: string;
  modified: string;
  children?: FsItem[];
};

type FsState = {
  root: FsItem;
  availableGb: number;
  getItemByPath: (path: string) => FsItem | null;
  getChildren: (path: string) => FsItem[];
};

function folder(id: string, name: string, icon: string, modified: string, children: FsItem[]): FsItem {
  return {
    id,
    name,
    kind: 'folder',
    type: 'Folder',
    size: null,
    icon,
    modified,
    children,
  };
}

function file(id: string, name: string, type: string, size: number, icon: string, modified: string): FsItem {
  return {
    id,
    name,
    kind: 'file',
    type,
    size,
    icon,
    modified,
  };
}

const mockFileSystem = folder('root', 'Macintosh HD', 'hard-drive', 'Today, 9:00 AM', [
  folder('recents', 'Recents', 'clock', 'Today, 9:12 AM', [
    file('recents-project-brief', 'Project Brief.md', 'Markdown Document', 420_000, 'text', 'Today, 9:10 AM'),
    file('recents-launch-notes', 'Launch Notes.txt', 'Plain Text', 78_000, 'text', 'Yesterday, 4:22 PM'),
    file('recents-window-study', 'Window Study.png', 'PNG Image', 2_850_000, 'image', 'Yesterday, 2:18 PM'),
    folder('recents-archive', 'Archive', 'folder', 'Mon, 11:42 AM', [
      file('archive-sprint-plan', 'Sprint Plan.md', 'Markdown Document', 132_000, 'text', 'Mon, 11:42 AM'),
      file('archive-checklist', 'QA Checklist.txt', 'Plain Text', 46_000, 'text', 'Sun, 5:18 PM'),
    ]),
  ]),
  folder('airdrop', 'AirDrop', 'airdrop', 'Today, 8:00 AM', []),
  folder('applications', 'Applications', 'app-window', 'Yesterday, 7:45 PM', [
    folder('applications-creative', 'Creative Suite', 'folder', 'Yesterday, 7:45 PM', [
      file('pixel-studio', 'Pixel Studio.app', 'Application', 214_000_000, 'app', 'Yesterday, 7:45 PM'),
      file('motion-board', 'Motion Board.app', 'Application', 188_000_000, 'app', 'Tue, 10:04 AM'),
    ]),
    file('notes-app', 'Notes.app', 'Application', 86_000_000, 'app', 'Today, 7:18 AM'),
    file('preview-app', 'Preview.app', 'Application', 94_000_000, 'app', 'Mon, 3:52 PM'),
    file('music-app', 'Music.app', 'Application', 127_000_000, 'app', 'Fri, 1:08 PM'),
  ]),
  folder('desktop', 'Desktop', 'desktop', 'Today, 8:52 AM', [
    folder('desktop-tahoe-trip', 'Tahoe Trip', 'folder', 'Today, 8:58 AM', [
      file('tahoe-trip-itinerary', 'Itinerary.txt', 'Plain Text', 22_000, 'text', 'Today, 8:58 AM'),
      file('tahoe-trip-viewpoints', 'Viewpoints.md', 'Markdown Document', 36_000, 'text', 'Today, 8:55 AM'),
    ]),
    file('desktop-welcome', 'Welcome.txt', 'Plain Text', 14_000, 'text', 'Today, 8:57 AM'),
    folder('desktop-mockups', 'Mockups', 'folder', 'Today, 8:52 AM', [
      file('mockups-finder-grid', 'Finder Grid.png', 'PNG Image', 3_600_000, 'image', 'Today, 8:51 AM'),
      file('mockups-sidebar-study', 'Sidebar Study.png', 'PNG Image', 2_940_000, 'image', 'Today, 8:45 AM'),
      folder('mockups-empty-drop', 'Drop Zone', 'folder', 'Today, 8:30 AM', []),
    ]),
    file('desktop-readme', 'README.md', 'Markdown Document', 64_000, 'text', 'Today, 8:15 AM'),
    file('desktop-todo', 'Todo.txt', 'Plain Text', 18_000, 'text', 'Yesterday, 6:30 PM'),
  ]),
  folder('documents', 'Documents', 'folder', 'Today, 10:03 AM', [
    folder('documents-design', 'Design', 'folder', 'Today, 10:03 AM', [
      folder('documents-design-liquid', 'Liquid Glass', 'folder', 'Today, 9:40 AM', [
        file('liquid-notes', 'Material Notes.md', 'Markdown Document', 91_000, 'text', 'Today, 9:38 AM'),
        file('liquid-tokens', 'Glass Tokens.txt', 'Plain Text', 34_000, 'text', 'Today, 9:36 AM'),
      ]),
      file('design-review', 'Review Checklist.md', 'Markdown Document', 118_000, 'text', 'Yesterday, 2:54 PM'),
    ]),
    folder('documents-empty', 'Invoices', 'folder', 'Wed, 12:00 PM', []),
    file('documents-roadmap', 'Roadmap.md', 'Markdown Document', 156_000, 'text', 'Today, 10:01 AM'),
    file('documents-retrospective', 'Retrospective.txt', 'Plain Text', 52_000, 'text', 'Tue, 4:20 PM'),
  ]),
  folder('downloads', 'Downloads', 'download', 'Today, 11:12 AM', [
    file('downloads-installer', 'GlassKit.dmg', 'Disk Image', 624_000_000, 'disk', 'Today, 11:12 AM'),
    file('downloads-icons', 'Finder Icons.zip', 'Archive', 42_000_000, 'archive', 'Yesterday, 9:04 PM'),
    folder('downloads-samples', 'Samples', 'folder', 'Yesterday, 8:10 PM', [
      file('samples-readme', 'Read Me.txt', 'Plain Text', 12_000, 'text', 'Yesterday, 8:10 PM'),
      file('samples-data', 'File Tree.md', 'Markdown Document', 28_000, 'text', 'Yesterday, 8:08 PM'),
    ]),
  ]),
  folder('icloud', 'iCloud Drive', 'cloud', 'Today, 6:30 AM', [
    folder('icloud-documents', 'Documents', 'folder', 'Today, 6:30 AM', [
      file('icloud-sync-notes', 'Sync Notes.md', 'Markdown Document', 74_000, 'text', 'Today, 6:25 AM'),
    ]),
    file('icloud-shared', 'Shared Links.txt', 'Plain Text', 31_000, 'text', 'Yesterday, 10:19 AM'),
  ]),
  folder('network', 'Network', 'network', 'Today, 7:00 AM', [
    folder('network-studio-nas', 'Studio NAS', 'server', 'Today, 7:00 AM', [
      file('network-style-guide', 'Style Guide.md', 'Markdown Document', 210_000, 'text', 'Today, 6:48 AM'),
      folder('network-shared-assets', 'Shared Assets', 'folder', 'Yesterday, 1:00 PM', [
        file('network-wallpaper', 'Tahoe Wallpaper.png', 'PNG Image', 5_300_000, 'image', 'Yesterday, 12:58 PM'),
      ]),
    ]),
  ]),
]);

function segmentsForPath(path: string) {
  return path.split('/').filter(Boolean);
}

function findChild(parent: FsItem, segment: string) {
  return parent.children?.find((child) => child.id === segment || child.name === segment) ?? null;
}

function getItemByPath(root: FsItem, path: string) {
  const segments = segmentsForPath(path);
  let current: FsItem = root;

  for (const segment of segments) {
    const next = findChild(current, segment);
    if (!next) {
      return null;
    }
    current = next;
  }

  return current;
}

export const useFsStore = create<FsState>((_set, _get) => ({
  root: mockFileSystem,
  availableGb: 148.73,
  getItemByPath: (path) => getItemByPath(mockFileSystem, path),
  getChildren: (path) => getItemByPath(mockFileSystem, path)?.children ?? [],
}));
