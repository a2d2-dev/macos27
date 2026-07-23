# T4 Apps remediation 回归测试报告

## 实验目的

验证本次 remediation 范围内的真实行为：Calculator 重复等号、上下文百分号、减法、乘法、链式运算与小数；Spotlight 只响应 Cmd/Meta+Space；Appearance 的 Auto 模式能跟随浏览器/系统 color-scheme 变化，并在切离 Auto 后停止跟随；生产构建通过。

## 实验步骤

1. 在 `/data/src/github.com/a2d2-dev/_wt/t4-apps` 执行 `npm run build`。
2. 启动本 worktree 的 dev server：`npm run dev -- --host 0.0.0.0`。
3. Vite 自动避让已占用的 `5173`，本次实际服务地址为 `http://10.126.126.12:5174/`。
4. 使用 `agent-browser --session t4-apps` 访问该地址并执行 UI 回归；截图保存到 `docs/artifacts/t4-20260723/`。

## 实验记录

- 构建：`npm run build` 通过。关键输出：`✓ 1602 modules transformed.`、`✓ built in 4.79s`。
- 浏览器错误检查：`agent-browser --session t4-apps errors` 无输出。
- Calculator 链式运算：通过 Calculator 按钮执行 `AC, 2, +, 3, x, 4, =`，显示 `20`。该基础模式按即时求值处理，即 `2 + 3` 先得到 `5`，再乘以 `4`。
  - 证据截图：`calculator-chained-2-plus-3-times-4.png`
- Calculator 重复等号：通过 Calculator 按钮执行 `AC, 2, +, 3, =, =, =`，显示 `11`，覆盖 `2 + 3 = 5` 后继续两次应用 `+ 3` 得到 `8`、`11`。
  - 证据截图：`calculator-repeated-equals-2-plus-3.png`
- Calculator 上下文百分号：通过 Calculator 按钮执行 `AC, 2, 0, 0, +, 1, 0, %, =`，显示 `220`；`10 %` 在 pending `+` 下被转换为 `200` 的 `10%`，即右操作数 `20`。
  - 证据截图：`calculator-contextual-percent-200-plus-10.png`
- Calculator 减法：通过 Calculator 按钮执行 `AC, 9, -, 4, =`，浏览器返回显示值 `5`。
- Calculator 乘法：通过 Calculator 按钮执行 `AC, 6, x, 7, =`，浏览器返回显示值 `42`。
- Calculator 小数：通过 Calculator 按钮执行 `AC, 1, ., 5, +, 2, ., 2, 5, =`，浏览器返回显示值 `3.75`。
- Spotlight 快捷键：在页面中执行 `Control+Space` 后重新 snapshot，未出现 `Spotlight Search` textbox；执行 `Meta+Space` 后重新 snapshot，出现 `textbox "Spotlight Search"`。本次未截图，仅记录 agent-browser snapshot 结果。
- Appearance Auto 跟随系统主题：在 Settings 的 Appearance 面板中，先执行 `agent-browser set media light`，点击 Auto 后 `main.className` 为 `theme-light ...`；随后执行 `agent-browser set media dark`，`main.className` 变为 `theme-dark ...`；再执行 `agent-browser set media light`，`main.className` 回到 `theme-light ...`。
- Appearance 切离 Auto 清理监听：点击 Light 后执行 `agent-browser set media dark`，`main.className` 仍为 `theme-light ...`，未被 stale Auto listener 改回 dark。本次未截图，仅记录 agent-browser eval 返回值。

## 未覆盖

- 本次 remediation 回归没有重新验证旧报告中的 Finder、TextEdit、Wallpaper、About This Mac、除零截图等非本次变更范围项目；旧截图仍保留在目录中，但不作为本次结论依据。
