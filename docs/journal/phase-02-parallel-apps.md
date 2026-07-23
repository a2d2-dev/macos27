# 阶段 02 · T2/T3/T4 并行开发

**时间**：2026-07-23 起
**状态**：⏳ 进行中

---

**目标**：在 T1 地基上补齐三块内容——T2 Finder、T3 桌面 widget+控制中心+菜单栏下拉、T4 核心应用+Spotlight。

**判断依据（并行波次与冲突控制）**：
- 三者都可能触碰 shell 层 `Desktop.tsx`/`MenuBar.tsx`，直接三路并行写会在 shell 文件撞车。
- 按**文件所有权**切分：T2 只动 `apps/finder/` + 新 `fsStore`（最隔离）；T3 拥有 `Desktop.tsx`+`MenuBar.tsx`+`systemStore`+新 widgets/ControlCenter/menus；T4 拥有 calculator/settings/textedit + Spotlight（挂 App 根），仅在必要时最小改 MenuBar。
- 结论：**Wave1 = T2 + T3 并行**（所有权不重叠）；T3 合并后再上 T4（承接最终 MenuBar，避免与 T3 的 MenuBar 改动冲突）。

**决策**：
- 每个 ticket 独立持久 worktree（`git worktree add`，非 Agent isolation——遵 CLAUDE.md：codex 后台任务禁用 Agent worktree isolation）。
- 分支：`feat/t2-finder`、`feat/t3-shell`、`feat/t4-apps`，均从最新 main 切。
- 派发用 dev 模板，锁定各自 worktree 目录；每条走 实现→对抗式 review→裁决→复审→合并 闭环。

**证据/结果**：（滚动回填）
- Wave1 派发：
- T2 review/合并：
- T3 review/合并：
- Wave2 T4：
