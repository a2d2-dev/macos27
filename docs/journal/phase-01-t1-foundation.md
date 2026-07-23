# 阶段 01 · T1 地基派发与实施

**时间**：2026-07-23 起
**状态**：✅ 已实施，待 review/裁决

---

**目标**：交付 walking skeleton——脚手架 + 桌面 + 菜单栏(实时时钟) + Dock + 窗口管理器 + App 插件注册表 + 示范 app(Notes) + 玻璃主题 + 深浅色。确立后续所有 app 的接入方式。阻塞 T2/T3/T4。

**判断依据**：
- greenfield 无基线，T1 与后续强耦合（窗口系统、store、注册表），先出一条能跑通的骨架再并行，避免早期多 worktree 撞车。
- codex read-only 沙箱无网络/不可写，脚手架需 npm install + 写文件 → 派发必须要求转发器带 `--write`（danger-full-access）。
- T1 无并行任务，codex 直接在主 checkout 分支 `feat/t1-foundation` 工作即可，暂不建 worktree；worktree 留给 T1 合并后的 T2/T3/T4 并行。

**决策**：
- 先在 main 打 base 初始提交（spec / tickets / journal / .gitignore / README），给分支一个基点。
- 按 codex-dispatch dev 模板派发 T1，锁定工作目录，要求 agent-browser 截图实证，push 到 `feat/t1-foundation` 不合并。

**证据/结果**：
- 派发时间 / codex 会话：2026-07-23，Codex 在 `feat/t1-foundation` 分支实施。
- 实施产出：新增 Vite + React + TypeScript + Tailwind CSS + Zustand + lucide-react 前端骨架；实现 Desktop/MenuBar/Dock/Window/WindowManager；实现 `systemStore`、`windowStore`；实现 `src/apps/registry.ts` 插件注册表和 Notes 示例 app，并注册 Finder/Preview/Music/Settings/TextEdit 占位 app。
- 命令证据：`npm install && npm run build` 成功，输出 `up to date, audited 140 packages`、`found 0 vulnerabilities`、`tsc --noEmit && vite build`、`✓ 1596 modules transformed`、`✓ built in 2.88s`；`npm run dev` 成功启动，实际地址 `http://10.126.126.12:5174/`。
- 截图证据：`docs/artifacts/t1-20260723/desktop-overview.png`、`docs/artifacts/t1-20260723/notes-window.png`、`docs/artifacts/t1-20260723/dock-fisheye.png`、`docs/artifacts/t1-20260723/dark-mode.png`。
- 交互证据：详见 `docs/artifacts/t1-20260723/test-report.md`，覆盖时钟刷新、Dock 运行态、拖拽、缩放、最小化恢复、最大化还原、关闭、z-order 和 Liquid Glass 样式。
- 对抗式 review 结论：待 CEO 派发 fresh-context review。
- 裁决与合并：待 CEO review 闭环后处理。
