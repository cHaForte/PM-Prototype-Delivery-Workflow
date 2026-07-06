# 启动多智能体原型交付工作流
# 用法: .\scripts\start-workflow.ps1

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "=== 多智能体原型交付工作流 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "请选择工作方式：" -ForegroundColor White
Write-Host "  1) 完整工作流（需求分析 → 原型生成 → 质量检查 → 文档管理）"
Write-Host "  2) 独立变更单撰写（仅撰写需求变更单）"
Write-Host "  q) 退出"
Write-Host ""

$choice = Read-Host "输入选项 (1/2/q)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "=== 启动完整工作流 ===" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "请在 Codex 中启用 product-flow-orchestrator skill" -ForegroundColor White
        Write-Host "然后输入你的需求描述，例如：" -ForegroundColor White
        Write-Host '  "我要做一个用户登录注册功能"' -ForegroundColor Gray
        Write-Host ""
        Write-Host "项目路径：$rootDir" -ForegroundColor Gray
        Write-Host "知识库：$rootDir\vault" -ForegroundColor Gray
        Write-Host "原型输出：$rootDir\prototypes\" -ForegroundColor Gray
    }
    "2" {
        Write-Host ""
        Write-Host "=== 启动独立变更单撰写 ===" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "请在 Codex 中启用 product-flow-orchestrator skill" -ForegroundColor White
        Write-Host "然后输入：" -ForegroundColor White
        Write-Host '  "我要写一个需求变更单"' -ForegroundColor Gray
        Write-Host ""
        Write-Host "变更单将保存到：$rootDir\vault\01-需求管理\需求变更单\" -ForegroundColor Gray
    }
    "q" {
        Write-Host "已退出" -ForegroundColor Gray
        return
    }
    default {
        Write-Host "无效选项，请重新运行" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "工作流配置文件：" -ForegroundColor Gray
Write-Host "  $rootDir\config\workflow.json" -ForegroundColor Gray
