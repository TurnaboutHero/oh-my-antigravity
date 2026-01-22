# Oh My Antigravity Installer - Windows (PowerShell)
# This script sets up OMA for your system

$ErrorActionPreference = "Stop"

$OMA_HOME = Split-Path -Parent $PSScriptRoot
$BIN_PATH = Join-Path $OMA_HOME "bin"
$PROFILE_LINE = @"

# Oh My Antigravity
`$env:PATH = "$BIN_PATH;`$env:PATH"
"@

Write-Host @"
   ____  __  __    _      
  / __ \|  \/  |  / \     Oh My Antigravity Installer
 | |  | | \  / | / _ \    
 | |  | | |\/| |/ ___ \   
 |_|  |_|_|  |_/_/   \_\  
"@ -ForegroundColor Magenta

Write-Host ""
Write-Host "Installing Oh My Antigravity..." -ForegroundColor Cyan
Write-Host ""

# Create necessary directories in Antigravity global path
$antigravityPath = Join-Path $env:USERPROFILE ".gemini\antigravity"
$skillsPath = Join-Path $antigravityPath "skills"
$workflowsPath = Join-Path $antigravityPath "workflows"

if (-not (Test-Path $skillsPath)) {
    New-Item -ItemType Directory -Path $skillsPath -Force | Out-Null
    Write-Host "[OK] Created skills directory" -ForegroundColor Green
}

if (-not (Test-Path $workflowsPath)) {
    New-Item -ItemType Directory -Path $workflowsPath -Force | Out-Null
    Write-Host "[OK] Created workflows directory" -ForegroundColor Green
}

# Add bin to PATH for current session
$env:PATH = "$BIN_PATH;$env:PATH"
Write-Host "[OK] Added OMA to current session PATH" -ForegroundColor Green

# Optionally add to PowerShell profile
$profilePath = $PROFILE.CurrentUserAllHosts
$addToProfile = Read-Host "Add OMA to PowerShell profile for permanent access? (y/n)"

if ($addToProfile -eq 'y' -or $addToProfile -eq 'Y') {
    if (-not (Test-Path $profilePath)) {
        New-Item -ItemType File -Path $profilePath -Force | Out-Null
    }
    
    $profileContent = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue
    if ($profileContent -notmatch "Oh My Antigravity") {
        Add-Content -Path $profilePath -Value $PROFILE_LINE
        Write-Host "[OK] Added OMA to PowerShell profile" -ForegroundColor Green
    }
    else {
        Write-Host "[OK] OMA already in PowerShell profile" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor DarkGray
Write-Host "[OK] Oh My Antigravity installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Try these commands:" -ForegroundColor Cyan
Write-Host "  oma help              # Show help"
Write-Host "  oma list              # List available plugins"
Write-Host "  oma install <name>    # Install a plugin"
Write-Host ""
Write-Host "OMA Home: $OMA_HOME" -ForegroundColor DarkGray
Write-Host "=======================================================" -ForegroundColor DarkGray

