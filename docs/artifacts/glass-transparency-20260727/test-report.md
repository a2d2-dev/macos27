# macOS27 玻璃透明度打磨验证报告

## 实验目的

- 对齐 `docs/artifacts/kimi-gap-20260727/screenshots/ref-*` 的液态玻璃参考观感，让桌面小组件、Finder、Control Center、Spotlight、菜单栏的壁纸折射更明显。
- 在降低背景 alpha 后确认 light / dark 两套主题文字、图标仍清晰可读。

## 实验步骤

1. 在指定 worktree `/data/src/github.com/a2d2-dev/macos27-wt-trans` 启动 Vite：`npm run dev -- --port 5188`。
2. 用 `agent-browser` 访问 `http://10.126.126.12:5188/`，固定视口 `1440x900`。
3. 改动前采集 before：桌面小组件/菜单栏、Finder、Control Center、Spotlight，覆盖 light 和 dark。
4. 调整 glass/window/menu/widget/Control Center/Finder/Spotlight 的 alpha、blur、saturate 后，采集同场景 after。
5. 用 `montage` 生成 before / after / ref 三联对比图。
6. 运行 `npx tsc --noEmit`。

## 验证记录

- `npx tsc --noEmit`：通过，无输出。
- light 模式：小组件、Finder 窗口、Control Center、Spotlight 的壁纸纹理相较 before 更明显；菜单栏仍能识别图标和文字。
- dark 模式：面板整体变薄，但主文字、次级文字和图标未出现发飘；Control Center 的激活态仍保留更强背景区分层级。
- 可读性保护手段：未改正文颜色；通过增加 `backdrop-filter` blur/saturate、保留 hairline/ring/inset highlight，并让激活态保留较高 alpha 保持层级。

## 证据路径

- before：`docs/artifacts/glass-transparency-20260727/screenshots/before/`
- after：`docs/artifacts/glass-transparency-20260727/screenshots/after/`
- before / after / ref 三联对比：`docs/artifacts/glass-transparency-20260727/screenshots/comparison/`
