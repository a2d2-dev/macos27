# Spotlight 紧凑分类面板验证记录

## 实验目的

验证 Spotlight 已从大标题应用启动器调整为紧凑分类搜索面板，并覆盖 light / dark 主题与分类切换过滤。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/macos27-wt-spot` 执行 `npx tsc --noEmit`。
2. 启动 Vite dev server，通过 `http://10.126.126.12:5177/` 访问当前 worktree。
3. 使用 agent-browser 连接 Chrome CDP，打开 `http://10.126.126.12:5177/`，设置 1440x900 视口。
4. 在 light 主题下打开 Spotlight，截图默认 Apps / Recents 状态。
5. 点击 Files 分类胶囊，截图分类过滤状态。
6. 通过 Control Center 切换 dark 主题，重新打开 Spotlight，截图默认 Apps / Recents 状态。
7. 点击 Clipboard 分类胶囊，截图分类过滤状态。
8. 在 Spotlight 中输入 `calc` 并按 Enter，确认 Calculator 窗口打开；重新打开 Spotlight 后按 Escape，确认面板关闭。

## 实验记录

- `npx tsc --noEmit`：通过。
- Spotlight 面板实测尺寸：`680x187`，默认高度显著低于旧版约 `680x425`。
- 分类切换：Apps、Files、Clipboard 均能切换选中态并过滤结果类别。
- 键盘验证：`calc` + Enter 后 `calculatorOpen=true` 且 `spotlightOpen=false`；Escape 后 `spotlightOpenAfterEscape=false`。
- 截图证据：
  - `light-apps-recents.png`
  - `light-files-recents.png`
  - `dark-apps-recents.png`
  - `dark-clipboard-recents.png`
