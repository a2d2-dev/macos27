# Finder 工具栏/状态栏验证记录

## 实验目的

验证 Finder 顶部工具栏、四种视图切换、Action/Tags/Share/Search、底部状态栏和 Icon size 滑杆均真实可交互，并确认 light/dark 主题下渲染正常。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/macos27-wt-finder` 运行 `npx tsc --noEmit`。
2. 启动 Vite：`npm run dev -- --host 0.0.0.0 --port 5181`，实际可访问地址为 `http://10.126.126.12:5182/`。
3. 使用 `agent-browser` 打开 `http://10.126.126.12:5182/`，从 Dock 打开 Finder。
4. 进入 Desktop 目录，确认内容来自 `fsStore`：`Tahoe Trip`、`Welcome.txt`、`Mockups`、`README.md`、`Todo.txt`。
5. 分别切换 Icon/List/Column/Gallery 视图并截图。
6. 将 Icon size slider 从 56 调到 88，并截图对比。
7. 打开 Action 菜单截图，确认 `Open`、`Get Info`、`Show in Columns`、`Clear Selection` 菜单项呈现。
8. 通过 Control Center 切换 Dark Mode，重复关键视图截图。

## 实验记录

- TypeScript：`npx tsc --noEmit` 通过，无错误。
- 状态栏：显示 `5 items, 148.7 GB available`，中间显示选中状态/文件夹文件统计，右侧显示 `Icon size` 滑杆。
- Icon size：slider snapshot 从 `56` 变化到 `88`，图标网格尺寸实时变化。
- 四种视图：Icon/List/Column/Gallery 均切换为不同布局，不是仅按钮样式变化。
- light 证据：
  - `light-icon-before-slider.png`
  - `light-icon-after-slider-max.png`
  - `light-list-view.png`
  - `light-column-view.png`
  - `light-gallery-view.png`
  - `light-action-menu.png`
- dark 证据：
  - `dark-icon-view.png`
  - `dark-list-view.png`
  - `dark-column-view.png`
  - `dark-gallery-view.png`
