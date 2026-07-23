# T2 — Finder 应用（依赖 T1，已合并）

## 目标
把 T1 的 Finder 占位替换为可用的 Finder：侧边栏 + mock 文件系统 + 图标/列表视图 + 导航 + 状态栏。对标参考站 Finder（历史截图 `/tmp/macos27-d2.png`：Favorites/Locations 侧栏、文件网格、底部状态栏、工具栏视图切换）。

## 文件所有权（避免与 T3/T4 冲突）
- **只改**：`src/apps/finder/`（整个目录，自包含）、新增 `src/store/fsStore.ts`（mock 文件系统）。
- **不改**：`src/components/*`（Desktop/MenuBar/Dock/Window/WindowManager）、`src/store/windowStore.ts`、`src/store/systemStore.ts`、`registry.ts`（finder 已注册，勿动）。若确需微调通用层，先在汇报里说明并保持最小、additive。

## 验收标准
1. Finder 窗口含：左侧 **Sidebar**（Favorites: Recents/AirDrop/Applications/Desktop/Documents/Downloads；Locations: Macintosh HD/iCloud/Network），右侧文件区，底部 **状态栏**（"N items, X GB available"）。
2. **mock 文件系统**：`fsStore.ts` 用内存树（文件夹/文件、名称、类型、大小、图标），至少 3 层、含若干 .txt/.md/文件夹。数据全 mock，无网络。
3. **导航**：点侧栏项/双击文件夹进入该目录并刷新文件区；工具栏 **前进/后退** 可用；当前路径反映在标题或路径栏。
4. **视图切换**：工具栏图标视图 ⇄ 列表视图切换真实生效（图标网格 / 多列列表带名称+大小+类型）。
5. 选中文件高亮；空文件夹显示合理空态。
6. Liquid Glass 风格与 T1 一致；深浅色跟随全局 `theme`。
7. `npm run build` 绿；agent-browser 截图实证：图标视图、列表视图、进入子文件夹、深色模式。截图存 `docs/artifacts/t2-<日期>/`，写 `test-report.md`（目的/步骤/记录三要素）。

## Out of scope
不做真实文件读写、拖拽移动文件、右键菜单、搜索后端。搜索框可存在但可只做前端过滤或占位。
