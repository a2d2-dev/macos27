# Dock 动画打磨验证记录

## 实验目的

验证 Dock 连续放大、点击反馈动画、light/dark 主题表现，以及 resize handle / tooltip / badge / running dot / separator / Downloads / Trash 红线回归。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/macos27-wt-dockanim` 执行 `npx tsc --noEmit`。
2. 执行 `npm run build` 后，用 `npm run preview -- --host 0.0.0.0 --port 5190` 暴露 `http://10.126.126.12:5190/`。
3. 用 agent-browser 打开本地页面，按同一 y 坐标横向移动鼠标，采集 Dock hover 多点截图。
4. 用 agent-browser 鼠标 down/up 采集点击按下和弹跳帧。
5. 打开参考站 `https://macos27.kimi.page/`，进入桌面后采集 Dock hover 对照截图。
6. 用 DOM 取样核对放大后的 `elementFromPoint` 命中、resize portal handle z-index、角标、separator、Downloads、Trash。
7. 切换暗色主题后采集 Dock hover 截图。

## 实验记录

- TypeScript：`npx tsc --noEmit` 通过。
- Build：`npm run build` 通过。
- 连续放大：`local-hover-left.png`、`local-hover-midleft.png`、`local-hover-center.png`、`local-hover-right.png`、`local-final-hover-center.png`。
- 中心采样 scale：相邻图标出现连续值 `1.1721 -> 1.4344 -> 1.4616 -> 1.2064`，非整数档位跳变。
- 命中区跟随视觉放大：在 Notes 放大后 box 右侧外沿取点 `{ x: 779, y: 851 }`，`elementFromPoint(...).closest('button')` 返回 `Open Notes`。
- 点击反馈：`local-click-press.png`、`local-click-bounce.png`、`local-click-settled-running.png`。
- 红线回归：`local-badge-tooltip.png`、`local-downloads-trash.png`、`local-dark-hover.png`。
- resize handle：active resize portal 内 fixed handles 计算 `z-index: 9100`，`pointer-events: auto`。
- 参考站：`reference-desktop.png`、`reference-hover-center.png`。
