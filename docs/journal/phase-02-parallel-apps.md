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

**证据/结果**（滚动回填）：

**Wave1 派发**：T2 `feat/t2-finder`@`_wt/t2-finder`、T3 `feat/t3-shell`@`_wt/t3-shell`，两 codex 并行实施。

**Wave1 实现**：T2 `2ac67c1`（Finder：侧栏/mock fsStore/图标+列表视图/导航/状态栏）、T3 `30d9e03`（日历+天气+股票 widget、完整控制中心、菜单栏下拉）。均独立 build 绿，CEO 复核截图确认真 UI。

**Wave1 对抗式 review（各 fresh-context，并行）→ 均 REQUEST_CHANGES；CEO 复核裁决（驳回过度标记）**：
- T2：① 面包屑显内部 id 非显示名(Minor)→接受；② artifacts 越所有权(Blocker)→**驳回**（证据是要求的交付物、ticket 专属目录不冲突，边界仅约束共享代码）；③ 报告称有选中态截图实无(Minor)→接受。
- T3：① 点菜单栏非下拉区不关下拉(Minor)→接受；② 删 T1 菜单栏深色开关(Major)→**驳回**（真实 macOS 深色切换在控制中心，此为更还原演进；深色经控制中心仍可用，`control-center-dark.png` 证实磁贴激活+场景变暗）；③ artifacts 越界(Minor)→**驳回**同 T2②。
- 复核义务落地：驳回 1 Blocker + 1 Major。过程修正：ticket 所有权段今后显式允许 `docs/artifacts/<ticket>/`（已补进 T4 ticket）。

**Wave1 小整改（并行派发中）**：T2 修面包屑显示名 + 报告证据一致；T3 修点外关闭覆盖菜单栏内区域。trivial 范围，CEO 自验（diff+build+截图）后合并，不再起完整二轮 review。

**合并**：（待整改回来）
**Wave2 T4**：（待 T3 合并后起）
