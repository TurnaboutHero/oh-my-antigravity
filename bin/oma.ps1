#!/usr/bin/env pwsh
# Oh My Antigravity (OMA) CLI Tool
# Antigravity IDE skill manager

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$SkillName,
    
    [switch]$Global,
    [switch]$Project,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$RemainingArgs
)

# Base paths
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$OMA_HOME = Split-Path -Parent $SCRIPT_DIR
$ANTIGRAVITY_HOME = Join-Path (Join-Path $HOME ".gemini") "antigravity"
$ANTIGRAVITY_SKILLS = Join-Path $ANTIGRAVITY_HOME "skills"
$ANTIGRAVITY_PROJECT = ".agent"

function Get-TargetPath {
    param([switch]$ForProject)
    
    if ($ForProject -or $Project) {
        $projectPath = Join-Path (Join-Path (Get-Location) $ANTIGRAVITY_PROJECT) "skills"
        if (-not (Test-Path $projectPath)) {
            New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
        }
        return $projectPath
    }
    
    # Global installation
    if (-not (Test-Path $ANTIGRAVITY_SKILLS)) {
        New-Item -ItemType Directory -Path $ANTIGRAVITY_SKILLS -Force | Out-Null
    }
    return $ANTIGRAVITY_SKILLS
}

function Get-AvailableSkills {
    $skillsPath = Join-Path $OMA_HOME "skills"
    
    if (-not (Test-Path $skillsPath)) {
        return @()
    }
    
    return Get-ChildItem -Path $skillsPath -Directory | Select-Object -ExpandProperty Name
}

function Install-Skill {
    param([string]$Name, [switch]$ForProject)
    
    $sourcePath = Join-Path (Join-Path $OMA_HOME "skills") $Name
    
    if (-not (Test-Path $sourcePath)) {
        Write-Host "[ERROR] Skill '$Name' not found" -ForegroundColor Red
        Write-Host "`nAvailable skills:" -ForegroundColor Yellow
        Get-AvailableSkills | ForEach-Object { Write-Host "  - $_" }
        return
    }
    
    $targetPath = Get-TargetPath -ForProject:$ForProject
    $destination = Join-Path $targetPath $Name
    
    if (Test-Path $destination) {
        Write-Host "[WARN] Skill '$Name' already exists" -ForegroundColor Yellow
        $response = Read-Host "Overwrite? (y/n)"
        if ($response -ne 'y') {
            return
        }
        Remove-Item -Path $destination -Recurse -Force
    }
    
    Copy-Item -Path $sourcePath -Destination $destination -Recurse -Force
    
    $scope = if ($ForProject -or $Project) { "project (.agent/skills)" } else { "global (~/.gemini/antigravity/skills)" }
    Write-Host "[OK] Installed '$Name' to $scope" -ForegroundColor Green
    
    # Show skill description
    $skillMd = Join-Path $destination "SKILL.md"
    if (Test-Path $skillMd) {
        $content = Get-Content $skillMd -Raw
        if ($content -match 'description:\s*(.+)') {
            Write-Host "  → $($matches[1])" -ForegroundColor Cyan
        }
    }
}

function Remove-Skill {
    param([string]$Name, [switch]$ForProject)
    
    $targetPath = Get-TargetPath -ForProject:$ForProject
    $skillPath = Join-Path $targetPath $Name
    
    if (-not (Test-Path $skillPath)) {
        Write-Host "[ERROR] Skill '$Name' not installed" -ForegroundColor Red
        return
    }
    
    Remove-Item -Path $skillPath -Recurse -Force
    $scope = if ($ForProject -or $Project) { "project" } else { "global" }
    Write-Host "[OK] Removed '$Name' from $scope" -ForegroundColor Green
}

function Show-AvailableSkills {
    Write-Host "`nAvailable Skills:" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    
    $skills = Get-AvailableSkills
    
    if ($skills.Count -eq 0) {
        Write-Host "No skills found in $OMA_HOME/skills" -ForegroundColor Yellow
        return
    }
    
    foreach ($skill in $skills) {
        $skillPath = Join-Path (Join-Path $OMA_HOME "skills") $skill
        $skillMd = Join-Path $skillPath "SKILL.md"
        
        Write-Host "`n  $skill" -ForegroundColor White
        
        if (Test-Path $skillMd) {
            $content = Get-Content $skillMd -Raw
            if ($content -match 'description:\s*(.+)') {
                Write-Host "    $($matches[1])" -ForegroundColor Gray
            }
        }
    }
    Write-Host ""
}

function Show-InstalledSkills {
    Write-Host "`nInstalled Skills:" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    
    # Global skills
    if (Test-Path $ANTIGRAVITY_SKILLS) {
        $globalSkills = Get-ChildItem -Path $ANTIGRAVITY_SKILLS -Directory
        if ($globalSkills.Count -gt 0) {
            Write-Host "`n  Global (~/.gemini/antigravity/skills):" -ForegroundColor Yellow
            foreach ($skill in $globalSkills) {
                Write-Host "    - $($skill.Name)" -ForegroundColor White
            }
        }
    }
    
    # Project skills
    $projectPath = Join-Path (Join-Path (Get-Location) $ANTIGRAVITY_PROJECT) "skills"
    if (Test-Path $projectPath) {
        $projectSkills = Get-ChildItem -Path $projectPath -Directory
        if ($projectSkills.Count -gt 0) {
            Write-Host "`n  Project (.agent/skills):" -ForegroundColor Yellow
            foreach ($skill in $projectSkills) {
                Write-Host "    - $($skill.Name)" -ForegroundColor White
            }
        }
    }
    
    Write-Host ""
}

function Show-Help {
    Write-Host @"

Oh My Antigravity (OMA) - Skill Manager for Antigravity IDE

USAGE:
  oma <command> [skill-name] [options]

COMMANDS:
  list               List all available skills
  install <name>     Install a skill
  remove <name>      Remove a skill
  installed          Show installed skills
  update             Update OMA repository
  help               Show this help

OPTIONS:
  --global           Install to global scope (default)
  --project          Install to project scope (.agent)

EXAMPLES:
  oma list                      # List available skills
  oma install sisyphus          # Install sisyphus globally
  oma install pixel --project   # Install pixel to project
  oma remove oracle             # Remove oracle from global
  oma installed                 # Show all installed skills

ANTIGRAVITY PATHS:
  Global:  ~/.gemini/antigravity/skills/
  Project: .agent/skills/

"@ -ForegroundColor Cyan
}

# Main command router
switch ($Command.ToLower()) {
    "install" {
        if ([string]::IsNullOrEmpty($SkillName)) {
            Write-Host "[ERROR] Skill name required" -ForegroundColor Red
            Write-Host "Usage: oma install <skill-name>" -ForegroundColor Yellow
            exit 1
        }
        Install-Skill -Name $SkillName -ForProject:$Project
    }
    "remove" {
        if ([string]::IsNullOrEmpty($SkillName)) {
            Write-Host "[ERROR] Skill name required" -ForegroundColor Red
            Write-Host "Usage: oma remove <skill-name>" -ForegroundColor Yellow
            exit 1
        }
        Remove-Skill -Name $SkillName -ForProject:$Project
    }
    "list" {
        Get-AvailableSkills
    }
    "spawn" {
        # Delegate to oma-spawn.ps1
        $spawnScript = Join-Path $SCRIPT_DIR "oma-spawn.ps1"
        
        # Combine arguments: SkillName is the first arg for spawn, RemainingArgs are the rest
        $spawnArgs = @()
        if ($SkillName) { $spawnArgs += $SkillName }
        if ($RemainingArgs) { $spawnArgs += $RemainingArgs }
        
        & $spawnScript @spawnArgs
    }
    "session" {
        # Delegate to oma-session.ps1
        $sessionScript = Join-Path $SCRIPT_DIR "oma-session.ps1"
        
        # Combine arguments
        $sessionArgs = @()
        if ($SkillName) { $sessionArgs += $SkillName }
        if ($RemainingArgs) { $sessionArgs += $RemainingArgs }
        
        & $sessionScript @sessionArgs
    }
    "update" {
        # Delegate to oma-update.ps1
        $updateScript = Join-Path $SCRIPT_DIR "oma-update.ps1"
        & $updateScript
    }
    "memory" {
        # Delegate to oma-memory.ps1
        $memoryScript = Join-Path $SCRIPT_DIR "oma-memory.ps1"
        
        # Combine arguments
        $memArgs = @()
        if ($SkillName) { $memArgs += $SkillName }
        if ($RemainingArgs) { $memArgs += $RemainingArgs }
        
        & $memoryScript @memArgs
    }
    "installed" {
        Get-InstalledSkills
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "[ERROR] Unknown command: $Command" -ForegroundColor Red
        Show-Help
        exit 1
    }
}
