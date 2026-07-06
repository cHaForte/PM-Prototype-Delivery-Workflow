# 安装多智能体原型交付工作流
# 用法: .\scripts\install-skills.ps1

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$skillsDir = Join-Path $rootDir "skills"

Write-Host "=== 安装多智能体原型交付工作流 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Codex CLI 是否可用
$codexCmd = Get-Command "codex" -ErrorAction SilentlyContinue
if (-not $codexCmd) {
    Write-Host "[警告] 未检测到 codex 命令，请确保 Codex CLI 已安装" -ForegroundColor Yellow
    Write-Host "       安装后请手动执行以下命令：" -ForegroundColor Yellow
} else {
    Write-Host "[检测到] Codex CLI 可用" -ForegroundColor Green
}

# 获取所有 skill 目录
$skills = Get-ChildItem -Path $skillsDir -Directory

foreach ($skill in $skills) {
    $pluginFile = Join-Path $skill.FullName "plugin.json"
    if (Test-Path $pluginFile) {
        $name = $skill.Name
        Write-Host "[安装] $name" -ForegroundColor Yellow
        
        if ($codexCmd) {
            & codex skill install $skill.FullName 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  -> 已安装" -ForegroundColor Green
            } else {
                Write-Host "  -> 安装失败，请手动执行: codex skill install $($skill.FullName)" -ForegroundColor Red
            }
        } else {
            Write-Host "  -> 手动执行: codex skill install `"$($skill.FullName)`"" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "=== 安装完成 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步：在 Obsidian 中打开 vault 目录：" -ForegroundColor White
Write-Host "  $rootDir\vault" -ForegroundColor Gray
Write-Host ""
Write-Host "然后在 Codex 中启用 product-flow-orchestrator skill 开始使用" -ForegroundColor White

# 注意：PowerShell 5.1 默认编码为 ANSI 而非 UTF-8
# 运行本工作流时，Codex 生成的 HTML/Markdown 文件使用 UTF-8 编码
# SKILL.md 中已包含编码规则，请遵循

