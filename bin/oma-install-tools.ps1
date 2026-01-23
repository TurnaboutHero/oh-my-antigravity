#!/usr/bin/env pwsh
# OMA Tools Installer (v3 - with Stitch Support)
# Installs CLI tools, Extensions, and creates Shims

$ErrorActionPreference = "Stop"

Write-Host "[OMA] Checking prerequisites..." -ForegroundColor Cyan

# Check NPM
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js/NPM is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# 1. Real Packages (Available on NPM)
$realTools = @{
    "antigravity" = "antigravity"
    "gemini" = "@google/gemini-cli"
}

Write-Host "`n[OMA] Installing Real CLI tools..." -ForegroundColor Cyan

foreach ($toolName in $realTools.Keys) {
    if (Get-Command $toolName -ErrorAction SilentlyContinue) {
        Write-Host "  [SKIP] $toolName is already installed." -ForegroundColor Gray
    }
    else {
        Write-Host "  [INSTALL] Installing $realTools[$toolName]..." -ForegroundColor Yellow
        try {
            npm install -g $realTools[$toolName]
            Write-Host "  [OK] $toolName installed successfully." -ForegroundColor Green
        }
        catch {
            Write-Host "  [FAIL] Failed to install $realTools[$toolName]." -ForegroundColor Red
            Write-Host "  $_" -ForegroundColor Red
        }
    }
}

# 1.5 Install Stitch Extension (Gemini)
Write-Host "`n[OMA] Installing Stitch Extension for Gemini..." -ForegroundColor Cyan
if (Get-Command "gemini" -ErrorAction SilentlyContinue) {
    try {
        # Check if already installed (heuristic) or just force update/install
        Write-Host "  [INSTALL] Installing Stitch extension..." -ForegroundColor Yellow
        gemini extensions install https://github.com/gemini-cli-extensions/stitch --auto-update
        Write-Host "  [OK] Stitch extension installed." -ForegroundColor Green
    }
    catch {
        Write-Host "  [FAIL] Failed to install Stitch extension." -ForegroundColor Red
        Write-Host "  Make sure you have authenticated with 'gcloud auth login' if needed." -ForegroundColor Yellow
        Write-Host "  $_" -ForegroundColor Red
    }
}
else {
    Write-Host "  [SKIP] Gemini CLI not found. Skipping Stitch installation." -ForegroundColor Red
}

# 2. Mock/Shim Packages (Not public, simulating for Sisyphus)
$simulatedTools = @("codex", "claude-code")
$binDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "mocks"

if (-not (Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir -Force | Out-Null
}

Write-Host "`n[OMA] Setting up Simulated Tools (for Sisyphus Native Mode)..." -ForegroundColor Cyan

# Add mocks to PATH for current session
$env:Path += ";$binDir"

foreach ($tool in $simulatedTools) {
    $shimPath = Join-Path $binDir "$tool.ps1"
    $shimCmdPath = Join-Path $binDir "$tool.cmd"
    
    # Create PowerShell Shim
    $shimContent = @"
Write-Host "[$tool-SIM] Sisyphus Native Simulation: Agent is thinking..." -ForegroundColor Magenta
Start-Sleep -Seconds 2
Write-Host "[$tool-SIM] Task completed by internal native backend."
"@
    $shimContent | Out-File -FilePath $shimPath -Encoding UTF8 -Force
    
    # Create CMD Shim (executable)
    $cmdContent = @"
@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0$tool.ps1" %*
"@
    $cmdContent | Out-File -FilePath $shimCmdPath -Encoding ASCII -Force
    
    Write-Host "  [OK] Simulator for '$tool' ready." -ForegroundColor Green
}

Write-Host "`n[OMA] Setup completed." -ForegroundColor Green
Write-Host "NOTE: To use Stitch, you MUST configure GCP credentials:" -ForegroundColor Yellow
Write-Host "  1. gcloud auth login" -ForegroundColor Gray
Write-Host "  2. gcloud config set project <PROJECT_ID>" -ForegroundColor Gray
Write-Host "  3. gcloud auth application-default login" -ForegroundColor Gray
