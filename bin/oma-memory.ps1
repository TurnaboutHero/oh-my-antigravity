#!/usr/bin/env pwsh
# OMA Project Cortex - Long Term Memory System

param(
    [Parameter(Position=0)]
    [string]$Command = "list",
    
    [Parameter(Position=1)]
    [string]$Content,
    
    [Parameter(Position=2)]
    [string]$Tag = "general"
)

$OMA_HOME = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PWD_HASH = [System.BitConverter]::ToString(([System.Security.Cryptography.SHA256]::Create()).ComputeHash([System.Text.Encoding]::UTF8.GetBytes((Get-Location).Path))).Replace("-", "").Substring(0, 12)
$MEMORY_DIR = Join-Path (Join-Path $OMA_HOME ".oma") "memory"
$PROJECT_MEMORY_DIR = Join-Path $MEMORY_DIR $PWD_HASH
$MEMORY_FILE = Join-Path $PROJECT_MEMORY_DIR "cortex.json"

# Ensure directories exist
if (-not (Test-Path $PROJECT_MEMORY_DIR)) {
    New-Item -ItemType Directory -Path $PROJECT_MEMORY_DIR -Force | Out-Null
}

# Load memory
$Memory = @()
if (Test-Path $MEMORY_FILE) {
    try {
        $Memory = Get-Content $MEMORY_FILE -Raw | ConvertFrom-Json
        if (-not $Memory) { $Memory = @() } 
    } catch {
        $Memory = @()
    }
}

function Save-Memory {
    $Memory | ConvertTo-Json -Depth 5 | Out-File $MEMORY_FILE -Encoding UTF8
}

function Add-Memory {
    param($Text, $Category)
    
    if (-not $Text) {
        Write-Host "[ERROR] Content required" -ForegroundColor Red
        return
    }
    
    $entry = @{
        id = [guid]::NewGuid().ToString()
        timestamp = (Get-Date).ToString("o")
        content = $Text
        tag = $Category
        path = (Get-Location).Path
    }
    
    $script:Memory += $entry
    Save-Memory
    
    Write-Host "[CORTEX] Remembered: '$Text'" -ForegroundColor Green
}

function Find-Memory {
    param($Query)
    
    if (-not $script:Memory) {
        Write-Host "[CORTEX] No memories found for this project." -ForegroundColor Yellow
        return
    }
    
    Write-Host "`n🧠 Cortex Memory Recall:" -ForegroundColor Cyan
    Write-Host "=======================" -ForegroundColor Cyan
    
    if (-not $Query) {
        # Show all recent (last 10)
        $results = $script:Memory | Sort-Object timestamp -Descending | Select-Object -First 10
    } else {
        # Simple text search
        $results = $script:Memory | Where-Object { $_.content -like "*$Query*" -or $_.tag -like "*$Query*" }
    }
    
    if (-not $results) {
        Write-Host "No matches found." -ForegroundColor Gray
        return
    }
    
    foreach ($m in $results) {
        Write-Host "[$($m.timestamp.Substring(0,10))] ($($m.tag)) $($m.content)" -ForegroundColor White
    }
    Write-Host ""
}

function Clear-Memory {
    $script:Memory = @()
    Save-Memory
    Write-Host "[CORTEX] Memory wiped for this project." -ForegroundColor Yellow
}

# Command Router
switch ($Command.ToLower()) {
    "save" {
        Add-Memory -Text $Content -Category $Tag
    }
    "remember" {
        Add-Memory -Text $Content -Category $Tag
    }
    "recall" {
        Find-Memory -Query $Content
    }
    "search" {
        Find-Memory -Query $Content
    }
    "list" {
        Find-Memory -Query $null
    }
    "clear" {
        Clear-Memory
    }
    "wipe" {
        Clear-Memory
    }
    "path" {
        Write-Host $MEMORY_FILE
    }
    default {
        Write-Host "Usage: oma memory <save|recall|list|clear> [content] [tag]"
    }
}
