# 阶段 00 · 启动与流程判定

**时间**：2026-07-23
**状态**：✅ 完成

---

**目标**：LF 要求「参考 macos27.kimi.page，生成一个 macOS 模拟器，不需要连接后端」。即构建纯前端、无后端、数据全 mock 的 macOS 桌面模拟器。

**判断依据**：
- 检查项目 / 工作空间 / 全局 CLAUDE.md，均**未声明 `ceo-team.flow`**。按 ceo-team 契约：未声明 → 默认走 Matt 流程，且必须主动汇报（已汇报）。
- 仓库状态：`/data/src/github.com/a2d2-dev/macos27` 空仓、无 commit。属 greenfield。
- 抓取参考站 HTML：Vite 打包的 SPA，`<meta description>` 自称 "macOS 27 — a pixel-faithful Liquid Glass macOS simulation running entirely in your browser"。确认是纯客户端。
- 用 agent-browser 复看历史截图确立视觉基线：菜单栏(实时时钟+状态簇)、Tahoe 壁纸、桌面 widget(日历/天气/股票)、玻璃 Dock(悬停放大+运行点)、Finder 窗口(三灯+侧栏+文件网格)、控制中心下拉面板、深浅色。

**决策**：
1. 流程：Matt（默认）。
2. 技术栈（执行细节，CEO 直接定）：Vite + React + TypeScript + Tailwind + Zustand。理由：玻璃拟态 UI 组件多、窗口管理器状态复杂，React+Zustand 最顺手；无后端纯 client-side，Vite 起步快。
3. 架构主原则：**App 插件化注册表**——每个 app 自包含目录，注册表加一行即接入，把并行 ticket 的冲突面压到最小（仅注册数组）。
4. Scope 拆成 tracer-bullet 4 张 ticket：T1 地基外壳（顺序，阻塞其余）→ T2 Finder / T3 Widget+控制中心 / T4 核心应用+Spotlight（T1 合并后并行，各自独立 worktree）。

**证据/结果**：
- spec 落 `docs/spec.md`；tickets 落 `.scratch/macos-sim/issues/`。
- TaskCreate 建 T1–T4，并设 T2/T3/T4 `blockedBy` T1。
- 视觉基线截图：`/tmp/macos27-d2.png`（Finder 桌面）、`/tmp/macos27-cc.png`（控制中心）。

**开放项 / 待 LF 校准**：MVP app 集合（Finder / Notes / 计算器 / 系统设置 + Spotlight + 3 widget + 控制中心）为 CEO 拟定范围，LF 可增删。
