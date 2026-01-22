#!/usr/bin/env pwsh
# OMA Auto-Update Script

$OMA_HOME = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ReleaseBranch = "main"

Write-Host "[OMA] Checking for updates..." -ForegroundColor Cyan

# Check if it's a git repo
if (-not (Test-Path (Join-Path $OMA_HOME ".git"))) {
    Write-Host "[ERROR] OMA is not installed via Git. Cannot auto-update." -ForegroundColor Red
    Write-Host "Please reinstall using: git clone https://github.com/TurnaboutHero/oh-my-antigravity.git" -ForegroundColor Yellow
    exit 1
}

# Fetch latest
Set-Location $OMA_HOME
try {
    git fetch origin $ReleaseBranch
    
    $localHash = git rev-parse HEAD
    $remoteHash = git rev-parse origin/$ReleaseBranch
    
    if ($localHash -eq $remoteHash) {
        Write-Host "[OMA] Already up to date!" -ForegroundColor Green
        exit 0
    }
    
    Write-Host "[OMA] Update available!" -ForegroundColor Yellow
    Write-Host "Updating to latest version..."
    
    git pull origin $ReleaseBranch
    
    # Reload profile if needed (optional)
    Write-Host "[OMA] Update complete!" -ForegroundColor Green
    Write-Host "Please restart your shell to ensure changes take effect." -ForegroundColor Gray
}
catch {
    Write-Host "[ERROR] Update failed: $_" -ForegroundColor Red
    exit 1
}
