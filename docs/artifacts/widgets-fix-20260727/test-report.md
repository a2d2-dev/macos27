# Widgets Dock Overlap 修复验证报告

## 实验目的

验证 1280x577 等短视口下桌面 widgets 不再与 Dock 视觉或几何重叠，同时确认 1440x900 下原 4-widget 布局与间距不回归。

## 实验步骤

1. 在当前 worktree 启动 Vite：`npm run dev -- --port 5182 --strictPort`，访问 `http://10.126.126.12:5182/`。
2. 临时恢复改前 `DesktopWidgets.tsx` 的两列固定布局，使用 agent-browser 在 1280x577 light 下复现并截图。
3. 应用修复后，使用 agent-browser 分别验证：
   - 1280x577 light
   - 1280x577 dark
   - 1440x900 light
   - 1440x900 dark
   - 1280x700 light
4. 对每组读取 `Desktop widgets`、`Stocks widget`、`Dock` 的 `getBoundingClientRect()`，计算 widget rail 与 Dock 的纵向 overlap。
5. 对 1440x900 light/dark 的左侧 widget 区域截图裁剪执行 ImageMagick `compare -metric AE`。
6. 运行 `npm run build`，覆盖 `tsc --noEmit` 与 Vite production build。

## 实验记录

- 改前 1280x577 light：`before-1280x577-light-overlap-worktree.png`
  - widgets: top 40, bottom 573.5, height 533.5
  - Stocks: top 405.5, bottom 573.5
  - Dock: top 469, bottom 561, height 92
  - vertical overlap: 92px
  - Stocks 底边到 Dock 顶边间隔: -104.5px

- 修复后 1280x577 light：`after-1280x577-light.png`
  - grid columns: `172px 172px 172px 172px`
  - widgets: top 40, bottom 415.5, height 375.5
  - Stocks: top 247.5, bottom 415.5
  - Dock: top 469, bottom 561
  - vertical overlap: 0px
  - Stocks 底边到 Dock 顶边间隔: 53.5px

- 修复后 1280x577 dark：`after-1280x577-dark.png`
  - grid columns: `172px 172px 172px 172px`
  - widgets: top 40, bottom 415.5, height 375.5
  - Stocks: top 247.5, bottom 415.5
  - Dock: top 469, bottom 561
  - vertical overlap: 0px
  - Stocks 底边到 Dock 顶边间隔: 53.5px

- 修复后 1280x700 light：`after-1280x700-light.png`
  - grid columns: `172px 172px`
  - widgets: top 40, bottom 573.5, height 533.5
  - Stocks: top 405.5, bottom 573.5
  - Dock: top 592, bottom 684
  - vertical overlap: 0px
  - Stocks 底边到 Dock 顶边间隔: 18.5px

- 1440x900 light 基线：`before-1440x900-light-baseline-worktree.png`
- 1440x900 light 修复后：`after-1440x900-light.png`
  - grid columns 均为 `172px 172px`
  - widgets/stocks/Dock 矩形均与基线一致
  - widget 区域裁剪像素比较：`AE=0`

- 1440x900 dark 基线：`before-1440x900-dark-baseline-worktree.png`
- 1440x900 dark 修复后：`after-1440x900-dark.png`
  - grid columns 均为 `172px 172px`
  - widgets/stocks/Dock 矩形均与基线一致
  - widget 区域裁剪像素比较：`AE=0`

- `npm run build`：通过。
  - `tsc --noEmit`：0 errors
  - `vite build`：通过
