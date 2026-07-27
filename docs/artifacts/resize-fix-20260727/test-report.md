# resize handle occlusion 验证报告

日期：2026-07-27

## 实验目的

验证 macOS27 模拟器窗口移动到 Dock 上方后，底边 `s`、右下角 `se`、左下角 `sw` resize handle 不再被 Dock 放大图标的 pointer hit target 遮挡，同时 Dock 悬停放大与点击开 App 仍正常。

## 环境

- worktree：`/data/src/github.com/a2d2-dev/macos27-wt-resize`
- 分支：`fix/resize-handle-occlusion`
- dev server：`http://10.126.126.12:5182/`
- 浏览器工具：`agent-browser`
- viewport：`1280x800`

## 步骤与记录

1. 修复前打开 Calculator，将窗口拖到最底部可达位置。
   - 截图：`before-bottom-position.png`
   - 记录：Calculator frame 为 `left=475 top=260 width=330 height=430 bottom=690`，Dock pill 为 `top=698 bottom=784 zIndex=9000`。

2. 修复前先悬停 Dock 图标触发 fisheye，再采样窗口底边中心。
   - 截图：`before-dock-hover-occlusion.png`
   - 记录：`x=640 y=688` 的 top hit target 是 Dock 图标 `SPAN`，其父 `BUTTON` transform 为 `matrix(1.54, 0, 0, 1.54, 0, -12.32)`；`resize-handle bottom-0 ... cursor-s-resize` 排在命中栈后面。

3. 修复前从 `x=640 y=688` 拖拽到底边上方。
   - 截图：`before-resize-attempt-failed.png`
   - 记录：拖拽前后 Calculator frame 未变化，仍为 `left=475 top=260 width=330 height=430 bottom=690`。

4. 修复后重复 Dock hover，并采样 `s`、`se`、`sw`。
   - 截图：`after-dock-hover-handle-on-top.png`
   - 记录：
     - `s-center x=640 y=688` top target 为 `resize-handle ... cursor-s-resize`
     - `se-inside x=791 y=680` top target 为 `resize-handle ... cursor-se-resize`
     - `sw-inside x=489 y=680` top target 为 `resize-handle ... cursor-sw-resize`

5. 修复后实际拖拽底边与底角。
   - `s`：`after-s-resize-success.png`，高度 `430 -> 400`
   - `se`：`after-se-resize-success.png`，宽度 `330 -> 300`
   - `sw`：`after-sw-resize-success.png`，`left 475 -> 436`，宽度 `300 -> 339`

6. 验证 Dock 自身交互。
   - 截图：`after-dock-hover-still-works.png`
   - 记录：Settings 图标 hover 后内部视觉层 transform 为 `matrix(1.54, 0, 0, 1.54, 0, -12.32)`。
   - 截图：`after-dock-click-opens-settings.png`
   - 记录：点击 Dock Settings 后，窗口列表出现 `Settings window`。

7. 切换 dark 主题后复测底边 resize。
   - 截图：`dark-theme-enabled.png`
   - 记录：`main.className` 包含 `theme-dark`。
   - 截图：`dark-before-s-resize-handle-on-top.png`
   - 记录：Dock hover 后底边 `x=606 y=688` top target 仍为 `resize-handle ... cursor-s-resize`。
   - 截图：`dark-after-s-resize-success.png`
   - 记录：暗色主题下高度 `432 -> 400`。

## 编译检查

`npx tsc --noEmit` 通过，退出码 0。

## 遗留问题

未发现与本修复相关的遗留问题。
