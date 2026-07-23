# 研发历程 · 索引

> 本目录记录 macos27 项目从 0 到 1 的**思考、判断依据、决策与证据**，供复盘与追溯。
> 结构 = **本索引 + 逐阶段记录**。每个关键节点（启动/派发/裁决/复核/合并/scope 变更）新增或追加一个阶段文件。
> 记录格式统一为 **目标 → 判断依据 → 决策 → 证据/结果**。
> 角色约定见 ceo-team 契约：CEO（Claude 主会话）只做规划/派发/裁决/复核，不写业务代码；codex 实施；fresh-context codex 对抗式 review。

## 当前状态
- 流程：**Matt**（CLAUDE.md 未声明 `ceo-team.flow`，按契约默认并已汇报）
- 技术栈：Vite · React · TypeScript · Tailwind · Zustand
- **✅ 全部完成并交付**：T1/T2/T3/T4 均已合并 main（`b796f1f`），整站集成验证通过。

## 阶段索引

| 阶段 | 标题 | 状态 | 记录 |
|------|------|------|------|
| 00 | 启动与流程判定 | ✅ 完成 | [phase-00-startup.md](./phase-00-startup.md) |
| 01 | T1 地基派发与实施 | ✅ 完成（合并 4e8e022） | [phase-01-t1-foundation.md](./phase-01-t1-foundation.md) |
| 02 | T2/T3/T4 并行开发 | ✅ 完成（合并至 b796f1f） | [phase-02-parallel-apps.md](./phase-02-parallel-apps.md) |
| 03 | 交付与最终集成验证 | ✅ 完成 | [phase-03-delivery.md](./phase-03-delivery.md) |

## 过程改进（自评落地）
- 洞 #1 哨兵假完成 → 终态以可验证交付物（新 commit/build 绿/目标截图）为准，非会话静默。
- 洞 #3 契约只验结构 → 合并前加"探针 app 端到端"硬门槛（已在 T1 落地）。
- 洞 #4 等待空转 → codex 跑时并行推进 CEO 侧产出（细化 tickets）。
- 洞 #6 journal 滞后 → 每次合并前追到实时。

## 关联文档
- 设计与验收：[`../spec.md`](../spec.md)
- Tickets：[`../../.scratch/macos-sim/issues/`](../../.scratch/macos-sim/issues/)
