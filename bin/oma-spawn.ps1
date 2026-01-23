#!/usr/bin/env pwsh
# OMA SubAgent Spawner - PowerShell Version
# Spawns isolated SubAgents using external CLI tools

param(
    [Parameter(Position=0, Mandatory=$true)]
    [string]$SubAgent,
    
    [Parameter(Position=1, Mandatory=$true)]
    [string]$Task,
    
    [string]$Context = "",
    [string]$AiBackend = "auto",
    [int]$Timeout = 600,  # 10 minutes default
    [switch]$Async
)

# Configuration
$OMA_HOME = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SESSIONS_DIR = Join-Path (Join-Path $OMA_HOME ".oma") "sessions"
$SUBAGENTS_DIR = Join-Path $OMA_HOME "subagents"
$MOCKS_DIR = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "mocks"

# Add mocks to PATH
if (Test-Path $MOCKS_DIR) {
    $env:Path = "$MOCKS_DIR;$env:Path"
}

# Ensure directories exist
if (-not (Test-Path $SESSIONS_DIR)) {
    New-Item -ItemType Directory -Path $SESSIONS_DIR -Force | Out-Null
}

# Load SubAgent config
$configPath = Join-Path (Join-Path $SUBAGENTS_DIR $SubAgent) "config.json"
if (-not (Test-Path $configPath)) {
    Write-Host "[ERROR] SubAgent '$SubAgent' not found" -ForegroundColor Red
    exit 1
}

$config = Get-Content $configPath -Raw | ConvertFrom-Json

# Determine AI backend
if ($AiBackend -eq "auto") {
    $AiBackend = $config.ai_backend.primary
}

Write-Host "[OMA] Spawning SubAgent: $SubAgent" -ForegroundColor Cyan
Write-Host "  AI Backend: '$AiBackend' (from config: '$($config.ai_backend.primary)')" -ForegroundColor Gray
Write-Host "  Task: $Task" -ForegroundColor Gray

# Generate session ID
$sessionId = [guid]::NewGuid().ToString()
$sessionDir = Join-Path $SESSIONS_DIR $sessionId
New-Item -ItemType Directory -Path $sessionDir -Force | Out-Null

# Create task file
$taskFile = Join-Path $sessionDir "task.md"
@"
# Task for $SubAgent

## Task
$Task

## Context
$Context

## Expected Output
As defined in SubAgent config

## Isolation
- Clean context (no conversation history)
- Focus only on this task
- Return result in structured format
"@ | Out-File -FilePath $taskFile -Encoding UTF8

# Prepare CLI command based on AI backend
$cliCommand = $null
$cliArgs = @()

switch ($AiBackend) {
    "codex" {
        # OpenAI Codex CLI
        if (-not (Get-Command "codex" -ErrorAction SilentlyContinue)) {
            Write-Host "[ERROR] Codex CLI not installed" -ForegroundColor Red
            Write-Host "Install: npm install -g @openai/codex-cli" -ForegroundColor Yellow
            exit 1
        }
        $cliCommand = "codex"
        if ((Get-Command "codex").Source -like "*mocks*") { $cliCommand = "codex.cmd" }

        $cliArgs = @(
            "run",
            "--model", "gpt-4-code",
            "--max-tokens", "4000",
            "--temperature", "0.2",
            "--input", $taskFile,
            "--output", (Join-Path $sessionDir "result.md")
        )
    }
    
    "claude-code" {
        # Claude Code CLI
        if (-not (Get-Command "claude-code" -ErrorAction SilentlyContinue)) {
            Write-Host "[ERROR] Claude Code CLI not installed" -ForegroundColor Red
            Write-Host "Install: npm install -g @anthropic/claude-code" -ForegroundColor Yellow
            exit 1
        }
        $cliCommand = "claude-code"
        if ((Get-Command "claude-code").Source -like "*mocks*") { $cliCommand = "claude-code.cmd" }

        $cliArgs = @(
            "run",
            "--model", "claude-sonnet-3.5",
            "--max-tokens", "4000",
            "--input", $taskFile,
            "--output", (Join-Path $sessionDir "result.md"),
            "--setting-sources", "none"  # Isolation
        )
    }
    
    "claude-opus-4.5" {
        # Claude Opus via Claude Code CLI
        if (-not (Get-Command "claude-code" -ErrorAction SilentlyContinue)) {
            Write-Host "[ERROR] Claude Code CLI not installed" -ForegroundColor Red
            exit 1
        }
        $cliCommand = "claude-code"
        $cliArgs = @(
            "run",
            "--model", "claude-opus-4.5",
            "--max-tokens", "8000",
            "--input", $taskFile,
            "--output", (Join-Path $sessionDir "result.md"),
            "--setting-sources", ""
        )
    }
    
    "gemini-3.0-pro" {
        # Gemini CLI
        if (-not (Get-Command "gemini" -ErrorAction SilentlyContinue)) {
            Write-Host "[ERROR] Gemini CLI not installed" -ForegroundColor Red
            Write-Host "Install: npm install -g @google/gemini-cli" -ForegroundColor Yellow
            exit 1
        }
        $cliCommand = "gemini"
        if ((Get-Command "gemini").Source -like "*mocks*") { $cliCommand = "gemini.cmd" }
        $cliArgs = @(
            "run",
            "--model", "gemini-3.0-pro",
            "--max-tokens", "4000",
            "--input", $taskFile,
            "--output", (Join-Path $sessionDir "result.md")
        )
    }
    
    "antigravity" {
        # Antigravity CLI
        if (-not (Get-Command "antigravity" -ErrorAction SilentlyContinue)) {
            Write-Host "[ERROR] Antigravity CLI not installed" -ForegroundColor Red
            exit 1
        }
        $cliCommand = "antigravity"
        $cliArgs = @(
            "run",
            "--input", $taskFile,
            "--output", (Join-Path $sessionDir "result.md")
        )
    }
    
    default {
        Write-Host "[ERROR] Unknown AI backend: $AiBackend" -ForegroundColor Red
        exit 1
    }
}

# Save session metadata
$metadata = @{
    session_id = $sessionId
    subagent = $SubAgent
    ai_backend = $AiBackend
    task = $Task
    context = $Context
    started_at = (Get-Date).ToString("o")
    status = "running"
}
$metadata | ConvertTo-Json | Out-File (Join-Path $sessionDir "metadata.json") -Encoding UTF8

Write-Host "[OMA] Session ID: $sessionId" -ForegroundColor Green
Write-Host "[OMA] Executing..." -ForegroundColor Cyan

# Execute CLI
try {
    if ($Async) {
        # Background execution
        $job = Start-Job -ScriptBlock {
            param($cmd, $args)
            & $cmd @args
        } -ArgumentList $cliCommand, $cliArgs
        
        $metadata.status = "running_async"
        $metadata.job_id = $job.Id
        $metadata | ConvertTo-Json | Out-File (Join-Path $sessionDir "metadata.json") -Encoding UTF8
        
        Write-Host "[OMA] Running in background (Job ID: $($job.Id))" -ForegroundColor Yellow
        Write-Host "Check status: oma spawn status $sessionId" -ForegroundColor Gray
    }
    else {
        # Synchronous execution with timeout
        $process = Start-Process -FilePath $cliCommand -ArgumentList $cliArgs `
            -NoNewWindow -Wait -PassThru -RedirectStandardOutput (Join-Path $sessionDir "stdout.log") `
            -RedirectStandardError (Join-Path $sessionDir "stderr.log")
        
        # Check result
        $resultPath = Join-Path $sessionDir "result.md"
        if (Test-Path $resultPath) {
            $result = Get-Content $resultPath -Raw
            
            $metadata.status = "completed"
            $metadata.completed_at = (Get-Date).ToString("o")
            $metadata.exit_code = $process.ExitCode
            $metadata | ConvertTo-Json | Out-File (Join-Path $sessionDir "metadata.json") -Encoding UTF8
            
            Write-Host "`n[OMA] SubAgent completed successfully!" -ForegroundColor Green
            Write-Host "Session: $sessionId" -ForegroundColor Gray
            Write-Host "`nResult:" -ForegroundColor Cyan
            Write-Host $result
            
            return @{
                session_id = $sessionId
                status = "completed"
                result = $result
            }
        }
        else {
            throw "No result generated"
        }
    }
}
catch {
    $metadata.status = "failed"
    $metadata.error = $_.Exception.Message
    $metadata.failed_at = (Get-Date).ToString("o")
    $metadata | ConvertTo-Json | Out-File (Join-Path $sessionDir "metadata.json") -Encoding UTF8
    
    Write-Host "[ERROR] SubAgent execution failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
