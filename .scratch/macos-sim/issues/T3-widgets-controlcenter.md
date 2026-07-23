# T3 — 桌面小组件 + 控制中心 + 菜单栏下拉（依赖 T1，已合并）

## 目标
补齐桌面外壳的"活"元素：左侧桌面 widget（日历/天气/股票）、右上控制中心面板、菜单栏下拉菜单。对标历史截图 `/tmp/macos27-d2.png`（widget 堆叠）与 `/tmp/macos27-cc.png`（控制中心）。全部 mock，无网络。

## 文件所有权（避免与 T2/T4 冲突）
- **拥有并可改**：`src/components/Desktop.tsx`（挂 widget 层）、`src/components/MenuBar.tsx`（下拉 + 控制中心触发）、`src/store/systemStore.ts`（控制中心开关/亮度/音量/主题）、新增 `src/components/widgets/*`、新增 `src/components/ControlCenter.tsx`、新增 `src/components/menus/*`。
- **不改**：`src/apps/*`（各 app 目录归 T2/T4）、`registry.ts`、`windowStore.ts`、`Dock.tsx`、`Window.tsx`。

## 验收标准
1. **桌面 widget**（左侧竖向堆叠，玻璃卡片）：
   - 日历：当前月网格 + 高亮今天（真实 `new Date()`）。
   - 天气：城市 + 温度 + 天气图标 + 高低温（mock 静态数据即可）。
   - 股票：≥3 支（AAPL/MSFT/NVDA）代码 + 公司名 + 涨跌（mock）。
2. **控制中心**：点菜单栏控制中心图标，右上弹出玻璃面板，含磁贴 WiFi/蓝牙/AirDrop/Focus/舞台管理/屏幕镜像（可 toggle 视觉态）、显示 **亮度滑块**、**深色模式**磁贴（真实切换全局 `theme`）、Night Shift、**声音滑块**、电量显示。开关状态入 `systemStore`。点面板外关闭。
3. **深色模式磁贴必须真实生效**（复用 T1 的 theme 机制），切换后全站玻璃/文字随之变化。
4. **菜单栏下拉**：点 Apple logo 出苹果菜单（About This Mac / System Settings… / Sleep / Restart / Shut Down，可为视觉+关闭，不必真功能）；点当前 app 菜单名（如 File/Edit）出对应下拉（菜单项可为占位）。点外部或 Esc 关闭；同一时刻只开一个。
5. 亮度滑块可联动一个视觉效果（如桌面 overlay 透明度），证明滑块真的驱动状态，而非死控件。
6. `npm run build` 绿；agent-browser 截图实证：三 widget、控制中心展开、深色模式经控制中心切换、Apple 菜单下拉。截图存 `docs/artifacts/t3-<日期>/` + `test-report.md`。

## Out of scope
天气/股票不接真实 API；焦点模式/舞台管理不做真实行为（仅视觉 toggle）；菜单项不必都有真功能，但结构与关闭交互要真。
