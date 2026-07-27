# resize-fix-v2 验证报告

## 实验目的

验证 Dock 图标放大后的可视区域与点击命中区域一致，同时验证活动窗口靠近 Dock 时，底边 `s`、左下角 `sw`、右下角 `se` resize handles 不被 Dock 阻挡。

## 实验步骤

1. 使用 agent-browser 打开 `http://10.126.126.12:5174`，固定视口为 `1280x800`。
2. 分别切换到 light / dark 主题。
3. 悬停 Dock 的 Finder 图标，移动到放大后 icon 顶部溢出坐标，记录 `elementFromPoint()` 和点击后窗口状态，并截图。
4. 点击 Finder 打开窗口，将窗口拖到下边界接近 Dock 的位置。
5. 对 `s`、`sw`、`se` 三个 handle，记录起始坐标、Dock z-index、命中的元素、portal handle z-index；随后用 agent-browser mouse down/move/up 执行真实拖拽，记录拖拽前后的窗口 frame。

## 实验记录

- Dock hit-area：light / dark 的顶部 probe 坐标均命中 `Open Finder` button，随后点击打开 `Finder window`。
- Resize handles：light / dark 的 `s`、`sw`、`se` 起点均命中 `resize-handle pointer-events-auto cursor-*-resize` portal handle，portal z-index 为 `9100`，Dock z-index 为 `9000`。
- Drag proof：light / dark 的 `s`、`sw`、`se` 拖拽结果 `changed=true`，窗口 frame 均发生变化。
- 证据文件：同目录下的 `*-dock-*.json`、`*-dock-*.png`、`*-resize-*-probe-before-drag.json`、`*-resize-*-drag-proof.json`、`*-resize-*-probe.png`。
