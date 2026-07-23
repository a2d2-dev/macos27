# macOS 模拟器（macos27）— Spec

## 一句话
纯前端、无后端的 macOS "Tahoe / Liquid Glass" 桌面模拟器，全部数据 mock，浏览器直接运行。对标 https://macos27.kimi.page/ 的观感与交互。

## 非目标（Out of scope）
- 不连接任何后端 / 不做网络请求（天气、股票、文件全部本地 mock）。
- 不追求 100% 像素级复刻；追求"一眼是 macOS、交互顺手、玻璃质感到位"。
- 不做多用户 / 登录 / 持久化到服务器（可选 localStorage 存偏好）。

## 技术栈
- 构建：Vite
- UI：React + TypeScript
- 样式：Tailwind CSS（配 Liquid Glass 设计令牌）
- 状态：Zustand（窗口管理器、系统状态、文件系统全部走 store）
- 图标：lucide-react（或内联 SVG）

## 架构原则
- **App 插件化注册表**：每个 app 是 `src/apps/<name>/` 自包含目录，导出一个 `AppDefinition`（id、标题、图标、默认窗口尺寸、React 组件），在 `src/apps/registry.ts` 的数组里注册**一行**。新增 app 不改窗口管理器代码，冲突面仅限注册数组。
- **窗口管理器**是通用容器：不感知具体 app 内容，只管拖拽/缩放/焦点/最小化/z-order。
- 系统状态（主题 light/dark、壁纸、时钟、控制中心开关、Dock 运行态）集中在 `useSystemStore`。

## 视觉基线（来自参考站截图）
- 顶部**菜单栏**：左 Apple logo + 当前 app 菜单（Finder/File/View/Go/Edit/Window/Help），右状态簇（WiFi、电池、控制中心、Spotlight🔍、Siri、日期时间实时刷新）。半透明毛玻璃。
- **桌面**：Tahoe 蓝色山湖壁纸；左侧堆叠 widget（日历、天气、股票）；右上角桌面图标（文件夹/文件）。
- **Dock**：底部居中玻璃圆角条，多个 app 图标，悬停放大（fisheye），运行中 app 下方小圆点，点击启动/激活。
- **窗口**：左上红黄绿三灯；毛玻璃标题栏；可拖拽移动、边缘缩放。
- **控制中心**：右上下拉玻璃面板，磁贴（WiFi/蓝牙/AirDrop/Focus/舞台管理/屏幕镜像）+ 显示亮度滑块 + 深色模式/Night Shift + 声音滑块 + 电量。深色模式开关真实切换全局主题。
- 全局 Liquid Glass：`backdrop-filter: blur()` + 半透明白/黑 + 细边框 + 柔和阴影。

## 验收（整体）
- `npm run build` 通过；`npm run dev` 起站点。
- 打开桌面即见壁纸 + 菜单栏实时时钟 + Dock + 至少 3 个 widget。
- Dock 点击可启动多个 app，窗口可拖拽/缩放/关闭/最小化，焦点切换正确。
- 深色模式切换全局生效。
- agent-browser 截图实证每个交付。

## Ticket 拆分（tracer bullet）
- **T1 地基与外壳**（顺序，阻塞其余）：脚手架 + 桌面 + 菜单栏(实时时钟) + Dock + 窗口管理器 + App 注册表 + 示范 app(Notes) + 玻璃主题 + 深浅色。
- **T2 Finder**（依赖 T1）
- **T3 Widget + 控制中心 + 菜单栏下拉**（依赖 T1）
- **T4 核心应用集(计算器/系统设置/文本) + Spotlight**（依赖 T1）

T2/T3/T4 在 T1 合并后于各自独立 worktree 并行。
