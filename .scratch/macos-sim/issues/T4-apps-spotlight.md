# T4 — 核心应用集 + Spotlight（依赖 T1；建议 T3 合并后再起，承接最终 MenuBar）

## 目标
补几个"真能用"的 app + Spotlight 全局搜索，让模拟器有实际可玩内容。

## 文件所有权
- **拥有并可改**：新增 `src/apps/calculator/`、增强 `src/apps/settings/`、增强 `src/apps/textedit/`；`registry.ts`（加 calculator 一行注册）；新增 `src/components/Spotlight.tsx` + 在 app 根（`src/App.tsx` 或等价挂载点）挂 Spotlight overlay + 全局 Cmd+Space 监听。
- **谨慎改**：`MenuBar.tsx` 仅在需要把 Spotlight 图标接上打开逻辑时最小改动（若 T3 已接好则复用）。改前看最新 main。
- **不改**：Finder（T2）、widgets/控制中心（T3）的目录。
- **证据目录**：`docs/artifacts/t4-<日期>/`（截图+报告）为**允许且要求**的交付物——所有权边界仅约束共享代码，ticket 专属证据目录不构成越界。

## 验收标准
1. **计算器**：标准布局（数字 + 四则 + 清除 + 正负 + 百分比 + 小数点），点击/键盘输入真实计算，连续运算正确，除零给合理提示。玻璃风格。
2. **系统设置**：左侧分类导航 + 右侧面板，至少 3 个可用面板：**外观**（浅/深/自动，切换真实驱动全局 theme）、**壁纸**（≥2 张可选，切换真实换桌面壁纸）、**关于本机**（型号/芯片/内存/序列号 mock 展示）。
3. **文本编辑增强**：TextEdit 支持多文档或至少标题 + 正文编辑，内容随窗口保留（同一会话内不丢）。
4. **Spotlight**：`Cmd+Space` 打开居中玻璃搜索框，输入过滤已注册 app（读 `registry`），↑↓ 选择、Enter 启动对应 app 并关闭；Esc/点外部关闭。
5. 新增 app（计算器）走"一行注册"契约：`apps/calculator/index.tsx` 自声明 `AppDefinition`（含 `iconGradient`）+ registry 加一行，通用层不改。
6. `npm run build` 绿；agent-browser 截图实证：计算器运算、系统设置外观/壁纸切换生效、Spotlight 搜索并启动 app、TextEdit 编辑。截图存 `docs/artifacts/t4-<日期>/` + `test-report.md`。

## Out of scope
不做持久化到磁盘/后端；设置项只需覆盖上述 3 面板；Spotlight 只搜 app，不搜文件/网页。
