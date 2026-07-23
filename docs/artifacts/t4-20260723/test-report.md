# T4 核心应用集 + Spotlight 测试报告

## 实验目的

验证 T4 交付范围：Calculator 真实四则运算与除零处理、System Settings 外观/壁纸/About 三个面板、TextEdit 标题与正文编辑、Spotlight 通过 Cmd+Space 搜索并 Enter 启动应用，以及生产构建通过。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/_wt/t4-apps` 执行 `npm install` 安装依赖。
2. 执行 `npm run build` 验证 TypeScript 与 Vite 生产构建。
3. 用绝对路径启动 dev server：`npm --prefix /data/src/github.com/a2d2-dev/_wt/t4-apps run dev -- --host 0.0.0.0`。
4. 从 Vite 输出确认本次服务端口为 `5174`，仅访问 `http://10.126.126.12:5174/`。
5. 使用 `agent-browser` 会话 `t4-apps` 进行 UI 验证和截图。

## 实验记录

- 构建：`npm run build` 通过，输出 `✓ built`。
- Calculator：通过 Dock/Spotlight 打开应用，点击 `12 + 7 =` 得到 `19`；点击 `8 ÷ 0 =` 得到 `Cannot divide by zero`。
  - 截图：`calculator-12-plus-7-result.png`
  - 截图：`calculator-divide-zero.png`
- System Settings 外观：在 Appearance 面板选择 Dark，菜单栏、窗口、Dock 和 widgets 全局切换为深色。
  - 截图：`settings-dark-theme.png`
- System Settings 壁纸：在 Wallpaper 面板选择 Aurora，桌面背景真实切换为绿色 Aurora 背景。
  - 截图：`settings-wallpaper-aurora.png`
- System Settings About：打开 About This Mac 面板，展示型号、芯片、内存、序列号 mock 信息。
  - 截图：`settings-about-this-mac.png`
- TextEdit：编辑标题和正文，重新聚焦窗口后内容仍保留在当前浏览器会话中。
  - 截图：`textedit-edited.png`
- Spotlight：按 `Meta+Space` 打开，输入 `calc` 过滤到 Calculator，按 Enter 启动 Calculator 并关闭 Spotlight；按 Escape 关闭 Spotlight 的快照检查也通过。
  - 截图：`spotlight-search-calculator.png`
  - 截图：`spotlight-enter-launch-calculator.png`
