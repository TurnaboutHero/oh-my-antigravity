#!/usr/bin/env pwsh
# OMA Session Manager - Check SubAgent status

param(
    [Parameter(Position=0)]
    [string]$Command = "list",
    
    [Parameter(Position=1)]
    [string]$SessionId = ""
)

$OMA_HOME = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SESSIONS_DIR = Join-Path $OMA_HOME ".oma" "sessions"

if (-not (Test-Path $SESSIONS_DIR)) {
    Write-Host "[INFO] No active sessions" -ForegroundColor Yellow
    exit 0
}

function Show-SessionList {
    $sessions = Get-ChildItem -Path $SESSIONS_DIR -Directory
    
    if ($sessions.Count -eq 0) {
        Write-Host "[INFO] No sessions found" -ForegroundColor Yellow
        return
    }
    
    Write-Host "`nActive Sessions:" -ForegroundColor Cyan
    Write-Host "=" * 80
    
    foreach ($session in $sessions) {
        $metadataPath = Join-Path $session.FullName "metadata.json"
        if (Test-Path $metadataPath) {
            $metadata = Get-Content $metadataPath | ConvertFrom-Json
            
            $statusColor = switch ($metadata.status) {
                "completed" { "Green" }
                "running" { "Yellow" }
                "running_async" { "Cyan" }
                "failed" { "Red" }
                default { "Gray" }
            }
            
            Write-Host "`nSession: $($metadata.session_id)" -ForegroundColor White
            Write-Host "  SubAgent: $($metadata.subagent)" -ForegroundColor Gray
            Write-Host "  AI Backend: $($metadata.ai_backend)" -ForegroundColor Gray
            Write-Host "  Status: $($metadata.status)" -ForegroundColor $statusColor
            Write-Host "  Started: $($metadata.started_at)" -ForegroundColor Gray
            
            if ($metadata.completed_at) {
                Write-Host "  Completed: $($metadata.completed_at)" -ForegroundColor Gray
            }
        }
    }
    Write-Host ""
}

function Show-SessionDetail {
    param([string]$Id)
    
    $sessionDir = Join-Path $SESSIONS_DIR $Id
    
    if (-not (Test-Path $sessionDir)) {
        Write-Host "[ERROR] Session not found: $Id" -ForegroundColor Red
        exit 1
    }
    
    $metadataPath = Join-Path $sessionDir "metadata.json"
    $metadata = Get-Content $metadataPath | ConvertFrom-Json
    
    Write-Host "`nSession Details:" -ForegroundColor Cyan
    Write-Host "=" * 80
    Write-Host "ID: $($metadata.session_id)"
    Write-Host "SubAgent: $($metadata.subagent)"
    Write-Host "AI Backend: $($metadata.ai_backend)"
    Write-Host "Status: $($metadata.status)"
    Write-Host "`nTask:"
    Write-Host $metadata.task
    
    if ($metadata.context) {
        Write-Host "`nContext:"
        Write-Host $metadata.context
    }
    
    # Show result if completed
    $resultPath = Join-Path $sessionDir "result.md"
    if (Test-Path $resultPath) {
        Write-Host "`nResult:" -ForegroundColor Green
        Write-Host "=" * 80
        Get-Content $resultPath
    }
    
    # Show logs if failed
    if ($metadata.status -eq "failed") {
        $stderrPath = Join-Path $sessionDir "stderr.log"
        if (Test-Path $stderrPath) {
            Write-Host "`nError Log:" -ForegroundColor Red
            Write-Host "=" * 80
            Get-Content $stderrPath
        }
    }
}

function Remove-Session {
    param([string]$Id)
    
    $sessionDir = Join-Path $SESSIONS_DIR $Id
    
    if (-not (Test-Path $sessionDir)) {
        Write-Host "[ERROR] Session not found: $Id" -ForegroundColor Red
        exit 1
    }
    
    Remove-Item -Path $sessionDir -Recurse -Force
    Write-Host "[OK] Session removed: $Id" -ForegroundColor Green
}

function Clear-AllSessions {
    $sessions = Get-ChildItem -Path $SESSIONS_DIR -Directory
    
    foreach ($session in $sessions) {
        $metadataPath = Join-Path $session.FullName "metadata.json"
        if (Test-Path $metadataPath) {
            $metadata = Get-Content $metadataPath | ConvertFrom-Json
            
            # Only remove completed/failed sessions
            if ($metadata.status -in @("completed", "failed")) {
                Remove-Item -Path $session.FullName -Recurse -Force
            }
        }
    }
    
    Write-Host "[OK] Cleared completed/failed sessions" -ForegroundColor Green
}

# Command router
switch ($Command.ToLower()) {
    "list" {
        Show-SessionList
    }
    "status" {
        if (-not $SessionId) {
            Write-Host "[ERROR] Session ID required" -ForegroundColor Red
            Write-Host "Usage: oma session status <session-id>" -ForegroundColor Yellow
            exit 1
        }
        Show-SessionDetail -Id $SessionId
    }
    "result" {
        if (-not $SessionId) {
            Write-Host "[ERROR] Session ID required" -ForegroundColor Red
            exit 1
        }
        $resultPath = Join-Path $SESSIONS_DIR $SessionId "result.md"
        if (Test-Path $resultPath) {
            Get-Content $resultPath
        }
        else {
            Write-Host "[ERROR] Result not found for session: $SessionId" -ForegroundColor Red
            exit 1
        }
    }
    "remove" {
        if (-not $SessionId) {
            Write-Host "[ERROR] Session ID required" -ForegroundColor Red
            exit 1
        }
        Remove-Session -Id $SessionId
    }
    "clear" {
        Clear-AllSessions
    }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host "`nUsage:" -ForegroundColor Yellow
        Write-Host "  oma session list              - List all sessions"
        Write-Host "  oma session status <id>       - Show session details"
        Write-Host "  oma session result <id>       - Show session result"
        Write-Host "  oma session remove <id>       - Remove session"
        Write-Host "  oma session clear             - Clear completed sessions"
        exit 1
    }
}
