# T1 — 地基与外壳（walking skeleton，阻塞 T2/T3/T4）

## 目标
搭起可运行的 macOS 桌面外壳：脚手架 + 桌面 + 菜单栏 + Dock + 窗口管理器 + App 插件注册表 + 一个示范 app，确立后续所有 app 的接入方式。

## 验收标准（可验证行为）
1. `npm install && npm run build` 成功；`npm run dev` 起本地站。
2. 打开页面：Tahoe 风格壁纸铺满，顶部菜单栏，底部 Dock。
3. 菜单栏右侧**时钟每分钟/秒实时刷新**（真实 `new Date()`，非静态字符串）；含 WiFi/电池/控制中心/Spotlight 图标（可静态图标，但布局到位）。
4. Dock：≥5 个 app 图标，**悬停时图标放大（相邻联动 fisheye）**；点击图标启动对应 app 窗口；运行中 app 图标下有小圆点。
5. 窗口管理器：
   - 窗口可用标题栏拖拽移动；可从边/角缩放。
   - 左上红/黄/绿灯：红=关闭、黄=最小化到 Dock（点 Dock 图标恢复）、绿=最大化/还原。
   - 点击某窗口置于最前（z-order 焦点正确），失焦窗口标题栏变灰。
6. **App 注册表**：`src/apps/registry.ts` 导出 app 数组；每个 app 在 `src/apps/<id>/` 自包含（导出 `AppDefinition`）。新增 app 只需加一行注册。示范 app：**Notes**（一个可编辑文本区即可）。
7. 深/浅色主题：有一个切换入口（可临时放菜单栏或控制中心占位），切换后全局玻璃/背景/文字颜色随之改变。
8. Liquid Glass 质感：菜单栏、Dock、窗口标题栏均用 `backdrop-filter: blur` + 半透明 + 细边框 + 阴影。

## 范围
- 建整个前端脚手架（package.json、vite、tailwind、tsconfig、index.html、src/*）。
- 目录建议：`src/components/`（Desktop/MenuBar/Dock/Window/WindowManager）、`src/store/`（systemStore、windowStore）、`src/apps/`（registry + notes）、`src/styles/`（glass 令牌）。
- Out of scope：Finder 内容（T2）、控制中心真实面板与 widget（T3）、计算器/设置/Spotlight（T4）。这些留占位或不做，**但注册表/store 要预留好扩展点**。
- 不提交 node_modules / dist / 编译产物（配 .gitignore）。

## 要求
- root cause 优先，禁止 mock/fallback 表象补丁（数据 mock 是允许的，指的是不要假装实现）。
- UI 用 **agent-browser** 截图实证（`npm run dev` 起站→open→screenshot），编译通过≠功能正常。
- 完成后 commit 并 push 到分支 `feat/t1-foundation`，**不要合并**。
- 汇报：做了什么、截图证据、遗留问题；未验证的写"未验证"。
