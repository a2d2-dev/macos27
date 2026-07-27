# Kimi 参考站保真度差距清单

调研日期：2026-07-27  
视口：1440x900，所有截图均为 agent-browser `screenshot --full` 采集。  
站点：参考站 `https://macos27.kimi.page/`；本地站 `http://127.0.0.1:5181/`。  
说明：数值为基于 1440x900 截图的目测估计；本地组件尺寸同时参考了源码中的 Tailwind/CSS 常量。参考站可访问树已用 `agent-browser snapshot -i -c` 提取，因其多为非语义/自绘 DOM，报告以截图证据为主。

## 对比总览表

| 维度 | 参考站表现 | 本地表现 | 差距严重度 | 建议改法 |
|---|---|---|---|---|
| 壁纸与桌面内容 | 真实湖岸航拍照片，桌面右侧有 Tahoe Trip 文件夹和 Welcome.txt；小组件叠在照片上形成真实玻璃折射感。 | CSS 渐变/几何壁纸，无桌面文件图标。 | P0 | 引入真实壁纸资产和桌面文件图标层，补充文件/文件夹布局与阴影。 |
| Dock 内容与密度 | 23 个图标，含 Apps、Safari、Messages、Mail、Maps、Photos、FaceTime、Phone、Calendar、Contacts、Reminders、Freeform、Podcasts、TV、News、Games、App Store、Downloads、Trash 等；右侧有分隔区。 | 7 个 App 图标，无分隔区、Downloads/Trash、徽标数量远少。 | P0 | 扩展 App registry / Dock 项模型，支持系统 App、分隔区、下载栈、废纸篓和角标。 |
| App 完整度 | Finder/Notes/Music/System Settings 都是多栏、多控件、带真实内容的数据界面。 | Notes/Music 明显为空壳或单区面板，Settings 类目少，Finder 工具栏少。 | P0 | 优先补齐 3 个核心 App 的信息架构、数据内容和控件。 |
| 菜单栏 | 约 28px 高、背景几乎透明贴合照片；右侧有 Wi-Fi、Battery、Spotlight、Siri、Control Center、Notifications。 | 28px 高但浅蓝半透明带明显底色；右侧无 Notifications，Control Center/Spotlight 顺序与参考站不同。 | P1 | 调整状态项顺序与数量，降低菜单栏底色不透明度，贴合背景采样。 |
| 窗口装饰 | 窗口圆角约 14-16px；标题栏/工具栏合计约 88px；红黄绿按钮直径约 12px，窗口有柔和大阴影。 | 窗口圆角 18px；标题栏 40px；交通灯直径 12px；多数窗口更厚、更小、更蓝。 | P1 | 重做窗口 shell 层级：标题栏、toolbar、status bar、阴影、圆角按 App 可配置。 |
| 玻璃材质 | 参考站小组件/弹层透明度更高，底图细节可见，饱和度和模糊更像 Liquid Glass。 | 本地玻璃面板多为浅蓝/浅白实色，底图被大面积洗平。 | P1 | 调整 glass token：降低背景 alpha、提高背景采样/折射层次，按面板类型区分 blur/saturate。 |
| Spotlight | 宽约 680px，高约 185px；搜索框与分类胶囊同一行，含 Apps/Files/Actions/Clipboard，结果区紧凑。 | 宽约 680px，高约 425px；标题字约 30px，结果为 App 列表，无分类切换。 | P1 | 改为参考站的紧凑高度、顶部分类胶囊、最近结果/分类过滤模型。 |
| Control Center | 右上面板约 320x600，含 2x3 toggle、Display/Sound/Battery、Low Power Mode、Edit Controls。 | 右上面板约 316x525，结构接近但无 Edit Controls，低电量开关表现弱，背景更实。 | P2 | 补 Edit Controls/Low Power Mode 细节，调整模块间距、圆角和透明度。 |
| 桌面小组件 | 左侧 4 个小组件：Calendar 横向事件、Weather、Today Reminders、Stocks，宽约 344px 组合。 | 左侧 3 个竖排小组件：Calendar/Weather/Stocks，每个约 172px 宽，无 Today。 | P1 | 增加 Today 小组件，改为参考站 2 列组合布局，补事件/提醒/走势图。 |
| 深色模式 | Settings 内点击 Dark 后整体窗口、Dock、小组件与壁纸上玻璃随主题联动。 | 可切深色，但 Settings 结构仍少，整体材质仍偏统一蓝黑。 | P2 | 在主题 token 之外同步调整壁纸亮度、控件底色、选中态和图标风格。 |

## 桌面 / 壁纸 / 桌面图标

证据：`ref-desktop.png` vs `local-desktop.png`

- 参考站使用真实湖水/岩石航拍照片，水面高光和岸边纹理清晰；本地为 CSS 几何渐变，缺少照片级纹理、局部高光和环境色变化。该差距影响所有玻璃材质判断，P0。
- 参考站右侧有 2 个桌面项目：`Tahoe Trip` 文件夹与 `Welcome.txt`，图标约 48px，文字居中在图标下方；本地无桌面图标层，只有左侧 widgets 和 Dock，P0。
- 参考站左侧小组件为半透明叠加在照片上，底图仍清楚可辨；本地小组件为浅蓝填充，透明感较弱。目测本地 widget 圆角约 14px，参考站约 12-14px，但参考站背景透出更强。

## 菜单栏

证据：`ref-menu-bar.png` vs `local-menu-bar.png`

- 两站菜单栏高度均约 28px，但参考站背景几乎透明，黑色文字直接叠在照片上；本地菜单栏为明显浅蓝条，视觉上更像固定 toolbar。
- 参考站右侧状态区顺序为 Wi-Fi、Battery、Spotlight、Siri、Control Center、Notifications、时间；本地截图可见 Wi-Fi、Battery、Control Center、Spotlight、Siri、时间，缺 Notifications，且 Control Center 与 Spotlight 顺序不同。
- Apple 菜单内容基本同构，参考站条目包括 `About This Mac`、`System Settings…`、`App Store…`、`Recent Items`、`Force Quit…`、`Sleep`、`Restart…`、`Shut Down…`、`Lock Screen`、`Log Out kimi…`；本地为相同结构但文案是 `Log Out LF...`，本地菜单背景更不透明、圆角/阴影更重。

## Dock

证据：`ref-dock-hover.png` vs `local-dock-hover.png`

- 参考站 Dock 约 23 个图标，底部玻璃条约 64px 高，图标约 48px，右侧有分隔线、Downloads 文件夹、Trash；本地 Dock 只有 7 个图标，底部玻璃条约 86px 高，图标 54px，缺分隔区/下载栈/废纸篓。
- 参考站 hover 在 Notes 上出现顶部 tooltip，图标放大但仍保持整条 Dock 密集；本地 hover 放大到约 1.54x，邻近图标也放大，但无文本 tooltip，且整体 Dock 被撑得更高。
- 参考站有多个通知角标（如 Messages/Mail/Reminders/App Store），本地仅用运行中圆点，无通知徽标模型。

## 窗口与标题栏装饰

证据：`ref-finder-app.png` vs `local-finder-app.png`，`ref-notes-app.png` vs `local-notes-app.png`

- 参考站 Finder 窗口约 980x620，本地 Finder 约 780x450；参考站 Notes 约 960x620，本地 Notes 约 520x380。本地默认窗口整体偏小，应用内容密度不足。
- 参考站窗口圆角约 14-16px，窗口底部和右下阴影扩散更宽；本地源码窗口圆角为 `rounded-[18px]`，截图中边缘更“圆”和更厚。
- 参考站 titlebar 与 toolbar 分层：顶部交通灯 + 标题，下方独立工具栏，再到底部状态栏；本地通用窗口 shell 只有 40px titlebar，许多 App 将工具栏简化到内容区域内。
- 两站交通灯按钮直径均约 12px；参考站按钮距左边约 16-18px、距顶部约 16px，本地距左约 18px、距顶部约 18px，差距较小。

## Finder

证据：`ref-finder-app.png` vs `local-finder-app.png`

- 参考站 Finder 标题为 `Documents`，内容区有 3 个真实文件，底部状态栏显示 `3 items, 214.3 GB available`，右侧有 `Icon size` 滑杆；本地 Finder 标题为 `Finder/Macintosh HD`，内容区是 8 个系统位置图标，底部只显示 `8 items, 148.73 GB available / 8 folders, 0 files`。
- 参考站工具栏包含 Back/Forward、4 个视图按钮（Icon/List/Column/Gallery）、Action、Tags、Share、Search；本地只有 Back/Forward、Icon/List 和 Search，缺 Column/Gallery/Action/Tags/Share。
- 参考站侧栏在当前截图中是空白/弱显的玻璃区域，强调窗口内背景；本地侧栏完整列出 Favorites/Locations，但样式偏传统浅蓝，不像参考站的淡灰玻璃。

## Notes

证据：`ref-notes-app.png` vs `local-notes-app.png`

- 参考站 Notes 为三栏布局：文件夹/标签侧栏约 205px、笔记列表约 245px、编辑区约 505px；本地为单个编辑区，没有文件夹、搜索、笔记列表和选中态。
- 参考站顶部有格式工具栏，含 Body、Bold、Italic、Underline、Strikethrough、Checklist、列表、表格、链接、Highlight、Export、Delete、New note 等；本地没有任何编辑工具栏。
- 参考站数据内容包含 4 条笔记、iCloud/On My Mac/Tags/Recently Deleted；本地只有静态 `Meeting notes` 文本，功能与内容完整度差距为 P0。

## Music

证据：`ref-music-app.png` vs `local-music-app.png`

- 参考站 Music 有左侧导航（Listen Now/Browse/Radio/Library/Playlists）、主内容卡片、歌单区和底部播放器控制；本地 Music 截图只有空白窗口 shell，没有可见内容。
- 参考站可访问树显示播放器按钮：Previous、Play/Pause、Next、Shuffle、Repeat、Mute、Lyrics、Up Next、MiniPlayer；本地 snapshot 只暴露 Close/Minimize/Maximize。
- 这是 App 功能完整度最高优先级缺口，P0。

## System Settings / Settings

证据：`ref-settings-app.png` vs `local-settings-app.png`，`ref-dark-mode.png` vs `local-dark-mode.png`

- 参考站 System Settings 左栏有约 24 个类目：Apple Account、Wi-Fi、Bluetooth、Network、VPN、Battery、General、Accessibility、Appearance、Menu Bar、Apple Intelligence & Siri、Desktop & Dock、Displays、Wallpaper、Screen Saver、Notifications、Focus、Sound、Keyboard、Trackpad、Mouse、Privacy & Security、Users & Groups、Time Machine 等；本地只有 Appearance、Wallpaper、About This Mac。
- 参考站 Appearance 右侧包含明暗外观、Accent Color、Highlight Color、Icon & Widget Style、Sidebar Icon Size；本地只有 Light/Dark/Auto 三张卡片。
- 两站都能点击 Dark 并截图；参考站深色模式仍保持 Settings 完整布局，本地只切换现有简化面板的色调。

## Spotlight

证据：`ref-spotlight.png` vs `local-spotlight.png`

- 参考站 Spotlight 面板约 680px 宽、185px 高，顶部搜索输入约 64px，高度紧凑；本地面板约 680px 宽、425px 高，顶部大标题 `Spotlight Search` 约 30px，整体更像应用启动器。
- 参考站右上有 Apps/Files/Actions/Clipboard 分类胶囊，当前选中 Files；本地无分类切换。
- 参考站结果区只有 Recents + Finder，行高约 44px；本地默认展示 7 个 App，每行约 56px，信息量和交互模型不同。

## Control Center

证据：`ref-control-center.png` vs `local-control-center.png`

- 参考站面板约 320px 宽、600px 高，顶部 2x3 tile，模块间距约 8-10px；本地约 316px 宽、525px 高，整体更扁，模块垂直压缩。
- 参考站有 `Edit Controls...` 底部操作，Battery 模块有 Low Power Mode 开关；本地底部没有 Edit Controls，Low Power Mode 未作为独立开关呈现。
- 参考站模块背景是较低透明度的玻璃蓝灰，仍能看到照片纹理；本地玻璃更实，叠在渐变壁纸上缺少真实折射参考。

## 桌面小组件

证据：`ref-desktop.png` vs `local-desktop.png`，`ref-control-center.png` vs `local-control-center.png`

- 参考站小组件共 4 个：Calendar（含 Gym/Design review 事件）、Weather、Today Reminders、Stocks，并以 2 列组合排布；本地为 3 个竖排卡片，缺 Today/Reminders。
- 参考站 Stocks 有迷你走势图，数值为 AAPL 232.40、MSFT 505.80、NVDA 168.25；本地 Stocks 无走势图，数值为 AAPL 229.81、MSFT 514.12、NVDA 171.38。
- 参考站 Weather 显示 59°、Partly Cloudy、H:84° L:54°；本地显示 57、Clear、H:79° L:53°。数据内容不一致会降低复刻感。

## 深浅色切换

证据：`ref-dark-mode.png` vs `local-dark-mode.png`

- 两站均可在 Settings 中触发 Dark；参考站切换后 Dock、Settings 卡片、侧栏、图标风格和壁纸叠加同步变暗，仍保持高对比层级。
- 本地切换后主要是通用 token 生效，Settings 仍是简化布局，Dock/窗口/小组件色调变化较统一，缺少参考站的分层灰度与材质变化。

## 按优先级排序的可实施 ticket 候选清单

### P0

1. **补齐真实壁纸与桌面图标层**  
   验收标准：`local-desktop.png` 对应场景中出现参考站同类真实照片壁纸、右侧文件夹/文本文件图标，且玻璃小组件能透出照片纹理。  
   涉及文件（推测）：`src/styles/index.css`、`src/components/Desktop.tsx`、`src/store/fsStore.ts`、新增 `src/assets/`。

2. **扩展 Dock 到参考站系统级图标集**  
   验收标准：Dock 至少包含参考站截图中的 23 个条目、右侧分隔区、Downloads、Trash、通知角标和 hover tooltip。  
   涉及文件（推测）：`src/components/Dock.tsx`、`src/apps/registry.ts`、`src/apps/AppPlaceholder.tsx`、`src/store/windowStore.ts`。

3. **实现 Music 的完整内部界面**  
   验收标准：打开 Music 时可见左侧导航、主内容卡片、歌单区和底部播放器控制，snapshot 至少暴露播放/上一首/下一首/随机/重复/歌词/Up Next 按钮。  
   涉及文件（推测）：`src/apps/music/index.tsx`、`src/apps/types.ts`。

4. **重建 Notes 三栏与格式工具栏**  
   验收标准：Notes 显示文件夹/标签侧栏、笔记列表、编辑区和格式工具栏，默认至少 4 条参考站同类笔记。  
   涉及文件（推测）：`src/apps/notes/NotesApp.tsx`、`src/apps/notes/index.ts`。

### P1

5. **重做 Finder toolbar/status bar 与文件内容**  
   验收标准：Finder 顶部具备 4 种视图按钮、Action/Tags/Share/Search，底部有 items/available 状态和 Icon size 滑杆，默认 Documents 展示 3 个文件。  
   涉及文件（推测）：`src/apps/finder/index.tsx`、`src/store/fsStore.ts`。

6. **调整通用窗口 shell 为参考站分层结构**  
   验收标准：窗口默认尺寸、圆角、titlebar/toolbar/status bar、阴影与参考站 Finder/Notes 截图目测误差控制在约 10px 内。  
   涉及文件（推测）：`src/components/Window.tsx`、`src/styles/glass.css`。

7. **补齐菜单栏状态项与透明度**  
   验收标准：菜单栏右侧顺序和项目匹配参考站，含 Notifications，背景透明度降到能清晰透出壁纸。  
   涉及文件（推测）：`src/components/MenuBar.tsx`、`src/components/menus/MenuDropdowns.tsx`、`src/styles/glass.css`。

8. **改造 Spotlight 为紧凑分类搜索面板**  
   验收标准：Spotlight 默认高度约 185px，顶部有 Apps/Files/Actions/Clipboard 分类胶囊，结果区域匹配参考站 Recents 样式。  
   涉及文件（推测）：`src/components/Spotlight.tsx`。

9. **重排桌面小组件并补 Today/Reminders**  
   验收标准：桌面左侧为参考站 4 小组件组合布局，Calendar 有事件、Today 有 3 条任务、Stocks 有走势图。  
   涉及文件（推测）：`src/components/widgets/DesktopWidgets.tsx`。

10. **扩展 System Settings 类目与 Appearance 细项**  
    验收标准：Settings 左栏至少覆盖参考站 Appearance 截图中的所有类目，Appearance 页包含 Accent/Highlight/Icon & Widget Style/Sidebar Icon Size 控件。  
    涉及文件（推测）：`src/apps/settings/index.tsx`、`src/store/systemStore.ts`。

### P2

11. **细化 Control Center 底部与模块质感**  
    验收标准：Control Center 出现 Edit Controls、Low Power Mode 开关，面板高度/间距/圆角接近参考站。  
    涉及文件（推测）：`src/components/ControlCenter.tsx`、`src/styles/glass.css`。

12. **统一深色模式下的材质层级**  
    验收标准：Dark 模式中菜单栏、Dock、窗口、小组件、弹层分别有可辨的层级灰度，而不是统一蓝黑 tint。  
    涉及文件（推测）：`src/styles/glass.css`、`src/styles/index.css`、`src/store/systemStore.ts`。
