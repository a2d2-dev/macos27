# 壁纸与桌面图标验证记录

## 实验目的

验证桌面从纯 CSS 渐变替换为真实照片级 Tahoe 湖岸壁纸后，light / dark 主题下玻璃叠层可透出照片纹理，并确认右侧桌面文件图标的选中态与双击打开行为。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/macos27-wt-wall` 启动 Vite：`npm run dev -- --port 5184`。
2. 使用 `agent-browser open http://10.126.126.12:5184/` 打开页面。
3. 截取改动前基线 light / dark 桌面。
4. 实现照片壁纸与桌面图标后，截取 final light / dark 桌面。
5. 点击 `Welcome.txt` 验证选中态，双击 `Welcome.txt` 验证打开 TextEdit。
6. 双击 `Tahoe Trip` 验证打开 Finder。
7. 运行 `npx tsc --noEmit`。

## 实验记录

- `baseline-light.png`：改动前 light 主题，背景为纯 CSS 几何渐变，右侧无桌面图标。
- `baseline-dark.png`：改动前 dark 主题，背景仍为纯 CSS 几何渐变。
- `final-light.png`：改动后 light 主题，照片级 Tahoe 湖岸壁纸生效，右侧显示 `Tahoe Trip` 与 `Welcome.txt`。
- `final-dark.png`：改动后 dark 主题，壁纸整体压暗，小组件与 Dock 仍透出照片纹理。
- `after-selected-welcome.png`：`Welcome.txt` 单击选中态。
- `after-open-welcome.png`：`Welcome.txt` 双击后打开 TextEdit。
- `after-open-tahoe-trip.png`：`Tahoe Trip` 双击后打开 Finder。
- `npx tsc --noEmit`：通过，无 TypeScript 错误。
