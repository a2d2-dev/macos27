# 菜单弹层玻璃修复验证报告

## 实验目的

验证 Apple 菜单及同类弹层不再复用桌面低 alpha 玻璃 token，并确认弹层脱离 menubar 的嵌套 backdrop root 后，背景内容被高遮盖和强模糊处理，菜单文字没有穿透混叠。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/macos27-wt-menu` 运行 `npm run dev -- --host 0.0.0.0 --port 5191`。
2. 使用 `agent-browser` 访问 `http://10.126.126.12:5191`，等待 boot 完成后点击 LF 头像进入桌面。
3. 修复前分别截取 light/dark 桌面和 Apple 菜单，并用 DOM 样式探针记录菜单 `backgroundColor`、`backdropFilter`、是否位于 `.glass-menubar` 内。
4. 修复后重新加载页面，重复 boot/login 流程，截取 light/dark 桌面、Apple 菜单、File 菜单、Spotlight、Control Center、Notifications、Dock tooltip。
5. 运行 `npx tsc --noEmit`。

## 验证记录

- 修复前 light Apple 菜单：`before-light-apple-menu.png`。日历小组件日期和日程文字穿透到菜单中，菜单文本可读性受影响。
- 修复前 dark Apple 菜单：`before-dark-apple-menu.png`。样式探针显示 `backgroundColor=rgba(44, 44, 46, 0.52)`，`inMenubarBackdropRoot=true`。
- 修复后 light Apple 菜单：`after-light-apple-menu.png`。样式探针显示 `backgroundColor=rgba(250, 250, 252, 0.82)`，`backdropFilter=blur(44px) saturate(2.3)`，`inMenubarBackdropRoot=false`。
- 修复后 dark Apple 菜单：`after-dark-apple-menu.png`。样式探针显示 `backgroundColor=rgba(40, 40, 42, 0.82)`，`backdropFilter=blur(46px) saturate(2.2)`，`inMenubarBackdropRoot=false`。
- 其他菜单：`after-light-file-menu.png` 使用同一 `MenuContent` 和 body portal，定位正常，文字清晰。
- Spotlight：`after-light-spotlight.png`、`after-dark-spotlight.png`，已切到 `glass-popover`，不在 menubar backdrop root 内。
- Control Center：`after-light-control-center.png`、`after-dark-control-center.png`，已切到 `glass-popover` 并 portal 到 body；dark 样式探针显示 `backgroundColor=rgba(40, 40, 42, 0.82)`，`inMenubarBackdropRoot=false`。
- Notifications：`after-light-notifications.png`、`after-dark-notifications.png`，已切到 `glass-popover` 并 portal 到 body。
- Dock tooltip：`after-light-dock-tooltip.png`，维持原 `rgba(0, 0, 0, 0.75)` 黑底和 `blur(12px)`，未发现同类穿透问题，未改动。
- 桌面对照：`before-light-desktop.png` / `after-light-desktop.png`、`before-dark-desktop.png` / `after-dark-desktop.png`。桌面小组件、窗口层、Dock 透明度未被回退；本次 diff 未修改 `--glass-bg`、`--window-bg`、`--menubar-bg` 等桌面层 token。

## 结论

`npx tsc --noEmit` 通过。Apple 菜单、菜单栏其他下拉菜单、Spotlight、Control Center、Notifications 在 light/dark 下均使用独立高遮盖弹层玻璃；Dock tooltip 无同类问题并保持原样。
