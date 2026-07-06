# PM-Prototype-Delivery-Workflow
# 多智能体原型交付工作流

基于 Codex Skills + Obsidian 的 HTML 原型自动化交付系统。

## 系统架构

`
用户 → 输入需求 → Orchestrator → 需求分析智能体 → 原型生成智能体 → 质量检查智能体 → 文档管理智能体 → 交付包
                          ↓           ↓           ↓           ↓           ↓
                    每个阶段等待确认      Obsidian 知识库自动同步
`

## 快速开始

### 前提条件

- Codex Desktop 或 Codex CLI
- Obsidian（知识库管理，可选但推荐）

### 安装

`ash
# 1. 进入项目目录
cd .

# 2. 在 Codex 中安装技能包
codex skill install .\.codex-skills\product-flow-orchestrator
codex skill install .\.codex-skills\agent-requirement
codex skill install .\.codex-skills\agent-prototype
codex skill install .\.codex-skills\agent-qa
codex skill install .\.codex-skills\agent-doc

# 3. 在 Obsidian 中打开 vault
#    Obsidian → 打开本地仓库 → 选择 .\vault

# 4. 启动工作流
#    在 Codex 中启用 product-flow-orchestrator skill，
#    然后输入你的需求
`

### 使用示例

`
你：我需要做一个用户登录功能
Orchestrator：我理解的需求是「用户登录功能」，请确认 (输入"确认"继续)
你：确认
[系统自动进入需求分析阶段，与用户讨论模糊点]
...
[系统自动生成原型]
...
[系统自动检查质量]
...
[系统生成交付包]
`

## 项目结构

`
.\
├── .codex-skills\           # Codex 技能包
│   ├── product-flow-orchestrator\   # 主控制器
│   ├── agent-requirement\           # 需求分析智能体
│   ├── agent-prototype\             # 原型生成智能体
│   ├── agent-qa\                    # 质量检查智能体
│   └── agent-doc\                   # 文档管理智能体
├── vault\ # Obsidian 知识库
│ ├── 00-系统配置\ # 智能体配置、工作流程、模板
│   ├── 01-需求管理\          # 需求变更单、变更日志
│   ├── 02-原型管理\          # 原型说明、版本记录
│   ├── 03-质量管理\          # 检查报告、问题追踪
│   ├── 04-文档管理\          # 交付文档
│   ├── 06-知识积累\          # 最佳实践、技术规范
│   ├── _index.md             # 知识库入口
│   └── _status.json          # 运行状态
├── prototypes\              # 原型 HTML 文件
├── config\                  # 工作流配置
│   ├── workflow.json
│   └── system.yaml
├── scripts\                 # 辅助脚本
└── README.md
`

## 工作流程

| 阶段 | 智能体 | 产出物 | 确认点 |
|------|-------|-------|-------|
| 需求分析 | agent-requirement | 需求变更单 | 是 |
| 原型生成 | agent-prototype | HTML/CSS/JS 原型 | 是 |
| 质量检查 | agent-qa | 质量检查报告 | 是 |
| 文档管理 | agent-doc | 交付清单 | 是 |

## 交互指令

| 指令 | 作用 |
|------|------|
| 确认 | 确认当前阶段产出，进入下一阶段 |
| 查看 | 重新展示当前阶段输出 |
| 重做 | 重新执行当前阶段 |
| 修改 | 返回修改需求 |
| 退出 | 取消本次项目 |

## 编码说明

本项目的所有文件统一使用 **UTF-8** 编码。

### Windows PowerShell 用户注意
PowerShell 5.1 默认编码为 ANSI（中文系统下为 GB2312），
写入文件时**必须**使用 -Encoding UTF8 参数。
例如：Out-File -FilePath file.html -Encoding UTF8

如果打开 HTML 文件看到乱码，原因通常是：
文件实际编码 ≠ HTML 头部的 charset 声明。
用 VS Code 或 Notepad++ 打开后「另存为 UTF-8」即可修复。
