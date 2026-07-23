# T2 Finder 应用测试报告

## 实验目的

验证 T2 Finder 应用从占位实现替换为可用 Finder：包含 Favorites/Locations 侧栏、mock 文件系统、图标/列表视图切换、文件夹导航、前进后退、选中状态、空文件夹空态、底部状态栏，以及跟随全局深浅色主题的 Liquid Glass 视觉。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/_wt/t2-finder` 执行 `npm install` 安装 worktree 依赖。
2. 执行 `npm run build` 做 TypeScript 与 Vite 生产构建验证。
3. 执行 `npm run dev -- --host 0.0.0.0` 启动 Vite，实际访问地址为 `http://10.126.126.12:5174/`。
4. 按 `agent-browser skills get core --full` 指引使用 `agent-browser` 打开页面，从 Dock 启动 Finder。
5. 通过 `agent-browser snapshot -i`、点击和双击操作验证：
   - 根目录图标视图；
   - 列表视图；
   - 双击 `Documents` 进入子文件夹；
   - Back 返回根目录、Forward 回到 `Documents`；
   - 双击空文件夹 `Invoices` 后出现空态；
   - 点击 `Roadmap.md` 后状态栏显示选中文件；
   - 菜单栏切换深色模式后 Finder 跟随全局主题。
6. 用 `agent-browser screenshot` 保存截图到本目录。

## 实验记录

- `npm install`：新增 139 个包，audit 140 个包，`found 0 vulnerabilities`。
- `npm run build`：通过，输出包含 `tsc --noEmit && vite build`、`✓ 1597 modules transformed`、`✓ built`。
- Vite dev server：5173 被占用后自动使用 5174，Network 地址为 `http://10.126.126.12:5174/`。
- 图标视图快照：包含 `Favorites`、`Locations`、`Macintosh HD files`，文件区有 `Recents`、`AirDrop`、`Applications`、`Desktop`、`Documents`、`Downloads`、`iCloud Drive`、`Network`。
- 列表视图快照：列表行包含名称、大小、类型、修改时间，例如 `Documents -- Folder Today, 10:03 AM`。
- 子目录导航：双击 `Documents` 后快照区域变为 `Documents files`，Back 按钮启用。
- 前进后退：Back 后区域回到 `Macintosh HD files` 且 Forward 启用；Forward 后区域回到 `Documents files`。
- 空态：进入 `Invoices` 后正文包含 `This folder is empty`、`0 items, 148.73 GB available`。
- 选中状态：点击 `Roadmap.md` 后正文/状态栏包含 `Roadmap.md selected`。
- 深色模式：点击菜单栏 `Toggle dark mode` 后截图显示 Finder 深色玻璃界面。

## 截图证据

- `/data/src/github.com/a2d2-dev/_wt/t2-finder/docs/artifacts/t2-20260723/01-icon-view.png`
- `/data/src/github.com/a2d2-dev/_wt/t2-finder/docs/artifacts/t2-20260723/02-list-view.png`
- `/data/src/github.com/a2d2-dev/_wt/t2-finder/docs/artifacts/t2-20260723/03-documents-folder.png`
- `/data/src/github.com/a2d2-dev/_wt/t2-finder/docs/artifacts/t2-20260723/04-dark-mode.png`
