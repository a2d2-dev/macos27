# T1 地基与外壳验证报告

## 实验目的
验证 macOS 27 桌面模拟器 T1 walking skeleton 是否满足脚手架、桌面外壳、菜单栏时钟、Dock、窗口管理器、App 注册表、深浅色主题和 Liquid Glass 质感的验收要求。

## 实验步骤
1. 在 `/data/src/github.com/a2d2-dev/macos27` 的 `feat/t1-foundation` 分支执行 `npm install`。
2. 执行 `npm run build` 做 TypeScript 类型检查和 Vite 生产构建。
3. 执行 `npm run dev` 启动 Vite dev server，实际端口为 `5174`，Network 地址为 `http://10.126.126.12:5174/`。
4. 使用 `agent-browser` 打开 dev server，设置 `1440x900` 视口，截图并做交互验证。

## 实验记录
- `npm install && npm run build`：`npm install` 输出 `up to date, audited 140 packages` 和 `found 0 vulnerabilities`；`npm run build` 输出 `tsc --noEmit && vite build`、`✓ 1596 modules transformed`、`✓ built in 2.88s`。
- `npm run dev`：`5173` 被占用后自动使用 `5174`；输出 `VITE v6.4.3 ready`，Network 地址含 `http://10.126.126.12:5174/`。
- `agent-browser errors`：无输出，未发现页面运行时报错。
- `agent-browser console`：仅有 Vite 连接/HMR 和 React DevTools 开发提示。
- 时钟验证：两次读取 `time` 文本分别为 `Thu, Jul 23, 3:15:45 AM` 与 `Thu, Jul 23, 3:16:11 AM`。
- Dock/玻璃样式验证：DOM 查询显示 Dock button 数为 `6`，Notes 运行态圆点数为 `1`；菜单栏、Dock、窗口标题栏 `backdropFilter` 分别为 `blur(30px) saturate(1.8)`、`blur(30px) saturate(1.8)`、`blur(28px) saturate(1.8)`。
- 拖拽验证：Notes 窗口从 `x=460,y=209,width=520,height=380` 移动到 `x=540,y=259,width=520,height=380`。
- 缩放验证：右下角 resize handle 命中 `cursor-se-resize`，拖动后 Notes 尺寸变为 `x=540,y=259,width=590,height=440`。
- z-order 验证：打开 Finder 后 Finder `zIndex=105`、Notes `zIndex=104`；点击 Notes 可见区域后 Notes `zIndex=106,data-active=true`，Finder `data-active=false`。
- 最大化/还原验证：Notes 最大化后 `x=10,y=38,width=1420,height=770`；再次点击绿灯后还原为 `x=540,y=259,width=590,height=440`。
- 最小化/恢复验证：点击黄灯后 `notesVisible=false,finderVisible=true,activeMenuText=Finder`；点击 Dock Notes 后 `notesVisible=true,activeMenuText=Notes`。
- 关闭验证：点击红灯后 `notesVisible=false,finderVisible=true,activeMenuText=Finder,visibleWindowCount=1`。

## 截图证据
- 桌面全景：`docs/artifacts/t1-20260723/desktop-overview.png`
- 打开的 Notes 窗口：`docs/artifacts/t1-20260723/notes-window.png`
- Dock 悬停 fisheye：`docs/artifacts/t1-20260723/dock-fisheye.png`
- 深色模式：`docs/artifacts/t1-20260723/dark-mode.png`

## 结论
T1 验收标准 1-8 均已通过本地命令和 agent-browser 截图/交互验证。
