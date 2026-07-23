# T3 桌面 widget + 控制中心 + 菜单栏下拉测试报告

## 实验目的

验证 T3 交付范围：桌面三类 widget、控制中心面板及其真实全局深色模式切换、菜单栏 Apple/当前 app 下拉、点外/Esc 关闭、亮度滑块驱动真实视觉状态。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/_wt/t3-shell` 执行 `npm install` 安装依赖。
2. 执行 `npm run build`，确认 TypeScript 与 Vite production build 通过。
3. 执行 `npm run dev -- --host 0.0.0.0`，Vite 自动选择 `http://10.126.126.12:5175/`。
4. 使用 `agent-browser --session t3-shell` 打开 `http://10.126.126.12:5175/`，设置视口 `1280x720` 后截图。
5. 通过 agent-browser snapshot/ref 点击菜单栏 Control Center 图标，截图控制中心展开态。
6. 通过控制中心内 `Dark Mode` 磁贴切换主题，截图并读取 `main` class。
7. 打开 Apple 菜单截图；点击 Finder 当前 app 菜单，确认同一时刻只保留当前 app 菜单；按 Esc 后确认菜单关闭。
8. 操作亮度 slider，读取 slider value 与桌面遮罩 style，确认视觉状态随 slider 改变；点击桌面空白处确认控制中心点外关闭。

## 实验记录

- `npm install`：完成，新增依赖安装成功，审计结果 `found 0 vulnerabilities`。
- `npm run build`：通过，输出 `✓ built in 3.71s`。
- 三 widget 截图：`widgets-light.png`，可见 Calendar / Cupertino Weather / Stocks(AAPL、MSFT、NVDA)，日历高亮 `2026-07-23`。
- 控制中心展开截图：`control-center-light.png`，可见 Wi-Fi、Bluetooth、AirDrop、Focus、Stage Manager、Screen Mirroring、Display、Dark Mode、Night Shift、Sound、Battery。
- 深色模式截图：`control-center-dark.png`；agent-browser 读取 `main` class 为 `theme-dark desktop-wallpaper ...`，确认复用全局 theme 机制。
- Apple 菜单截图：`apple-menu-dark.png`，可见 About This Mac / System Settings... / Sleep / Restart... / Shut Down... 等菜单项。
- 当前 app 菜单：点击 Finder 后 snapshot 显示 Apple 菜单 `expanded=false`、Finder 菜单 `expanded=true`，同一时刻只开一个。
- Esc 关闭：按 Esc 后 snapshot 显示 Apple/Finder/File/Edit/View/Go/Window/Help 全部 `expanded=false`。
- 亮度联动：Display brightness UI 操作后 value 从 `82` 变为 `58`，桌面遮罩 style 从 `opacity: 0.0756` 变为 `opacity: 0.1764`；补充截图 `brightness-58-dark.png`。
- 点外关闭：控制中心展开后点击 `main`，snapshot 中不再出现 Wi-Fi/Bluetooth/Display/Sound 控制中心内容。

## 证据文件

- `docs/artifacts/t3-20260723/widgets-light.png`
- `docs/artifacts/t3-20260723/control-center-light.png`
- `docs/artifacts/t3-20260723/control-center-dark.png`
- `docs/artifacts/t3-20260723/apple-menu-dark.png`
- `docs/artifacts/t3-20260723/brightness-58-dark.png`
