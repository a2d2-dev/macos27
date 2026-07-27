# Music App 验证记录

## 实验目的

验证 macOS27 模拟器 Music App 已从占位页替换为 Apple Music 风格界面，并确认导航、主内容、底部播放器、播放状态切换、导航切换、light/dark 外观和 TypeScript 静态检查满足验收要求。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/macos27-wt-music` 执行 `npx tsc --noEmit`。
2. 启动 Vite 开发服务，实际访问地址为 `http://10.126.126.12:5182/`。
3. 使用 `agent-browser` 设置 1440x900 视口，打开桌面并从 Dock 启动 Music。
4. 保存 Music light 模式截图与 accessibility snapshot。
5. 点击 `Play/Pause`，记录播放器本地 mock 状态。
6. 点击 `Browse`，记录导航切换后的 accessibility snapshot。
7. 通过 Control Center 切换 Dark Mode，保存 Music dark 模式截图。

## 实验记录

- `npx tsc --noEmit`：通过，无 TypeScript 错误。
- Light 截图：`music-app.png`。
- Dark 截图：`music-app-dark.png`。
- 初始 snapshot：`music-snapshot.txt`，包含 `Previous`、`Play/Pause`、`Next`、`Shuffle`、`Repeat`、`Mute/Volume`、`Lyrics`、`Up Next`、`MiniPlayer`。
- 播放状态记录：`music-play-state.json`，点击后 `playPressed` 为 `true`，底部播放器显示 `Drift` / `Isla Wave`。
- 导航切换记录：`music-browse-snapshot.txt`，点击 `Browse` 后主区标题切换为 `Browse`。
