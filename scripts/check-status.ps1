# 查看当前工作流状态
# 用法: .\scripts\check-status.ps1

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$statusFile = Join-Path $rootDir "vault\_status.json"

if (Test-Path $statusFile) {
    $status = Get-Content $statusFile -Encoding UTF8 | ConvertFrom-Json
    Write-Host "=== 工作流状态 ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "项目名称：$($status.project_name)" -ForegroundColor White
    Write-Host "当前状态：$($status.status)" -ForegroundColor Yellow
    Write-Host "当前阶段：$($status.current_stage)" -ForegroundColor White
    Write-Host "已完成阶段：$($status.last_completed_stage)" -ForegroundColor Gray
    Write-Host "变更单版本：v$($status.change_order_version)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "开始时间：$($status.created_at)" -ForegroundColor Gray
    Write-Host "更新时间：$($status.last_updated)" -ForegroundColor Gray
} else {
    Write-Host "暂无进行中的工作流" -ForegroundColor Yellow
    Write-Host "运行 .\scripts\start-workflow.ps1 启动新工作流" -ForegroundColor Gray
}
