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
本轮原始 T1 walking skeleton 已完成脚手架、桌面外壳、菜单栏、Dock、窗口管理器、App 注册表、主题和 Liquid Glass 基线验证；其中窗口边界、Dock 预留、pointer 监听清理和 App 注册表视觉契约在后续对抗式 review 中发现缺陷，需以整改复验结论为准。

## 2026-07-23 对抗式 review 整改复验

### 实验目的
验证 CEO 已采纳的 5 条 T1 review 整改是否完成 root cause 修复：小视口最大化不越界、拖拽/缩放不会覆盖 Dock、pointercancel/卸载不残留监听器、Dock 图标视觉来自 AppDefinition 契约、测试结论不再过度宣称。

### 实验步骤
1. 在 `/data/src/github.com/a2d2-dev/macos27` 的 `feat/t1-foundation` 分支执行 `git pull --ff-only`。
2. 执行 `npm run build`。
3. 执行 `npm run dev` 启动 Vite dev server，实际端口为 `5174`，Network 地址包含 `http://10.126.126.12:5174/`。
4. 读取 `agent-browser skills get core --full` 后，使用 `agent-browser` 以 `800x600` 视口打开 `http://10.126.126.12:5174/`，执行针对性 UI 复验并截图。

### 实验记录
- `git pull --ff-only`：输出 `Already up to date.`。
- `npm run build`：输出 `tsc --noEmit && vite build`、`✓ 1596 modules transformed`、`✓ built in 2.97s`。
- `npm run dev`：`5173` 被占用后自动使用 `5174`；输出 `VITE v6.4.3 ready`，Network 地址含 `http://10.126.126.12:5174/`。
- 小视口最大化：`800x600` 视口下 Notes 最大化后几何值为 `x=10,y=28,width=780,height=470,right=790,bottom=498`，`inViewport=true`，`aboveDockReserve=true`。
- 底部拖拽 clamp：使用真实 mouse down/move/up 将 Notes 拖到底部，最终 `bottom=490`，Dock 顶部 `top=498`，`bottomAtClamp=true`，`aboveDock=true`。
- Dock 图标配色：6 个 Dock app 均有实际 `linear-gradient(...)` computed background，`hasUndefinedClass=false`，`hasVisibleGradient=true`。
- pointercancel 清理：active drag 取消前 `pointermove/pointerup/pointercancel` 各 1 个监听，`pointercancel` 后全部为 0；active resize 同样取消后全部为 0。
- 卸载清理：active drag 期间关闭 Notes 后监听计数从各 1 个变为 0；active resize 期间关闭 Notes 后监听计数同样从各 1 个变为 0，`notesWindowExists=false`。
- App 注册表扩展契约：Dock 通用层仅读取 `app.iconGradient`，无 `iconThemes` 硬编码 map；新增 app 的验证方式为在 app 目录导出含 `iconGradient` 的 `AppDefinition` 并在 `registry.ts` 数组追加一行，Dock 无需修改。当前 TextEdit/其他 5 个 registry app 均按该契约渲染出正常渐变。

### 截图证据
- 小视口最大化不越界：`docs/artifacts/t1-fix-20260723/small-viewport-maximized.png`
- 拖到底部不遮挡 Dock：`docs/artifacts/t1-fix-20260723/drag-bottom-above-dock.png`
- Dock 所有 app 图标配色正常：`docs/artifacts/t1-fix-20260723/dock-icon-gradients.png`

### 结论
本轮 5 条对抗式 review 整改已完成并通过针对性复验；该结论仅覆盖上述整改范围，不替代 T2/T3/T4 后续功能验收。
