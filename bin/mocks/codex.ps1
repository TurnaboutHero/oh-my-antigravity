param(
    [Parameter(ValueFromRemainingArguments=$true)]
    $Args
)

Write-Host "[codex-SIM] Sisyphus Native Simulation: Codex is coding..." -ForegroundColor Magenta
Start-Sleep -Seconds 2

# Find --output argument
$outputFile = $null
for ($i = 0; $i -lt $Args.Count; $i++) {
    if ($Args[$i] -eq "--output" -and ($i + 1) -lt $Args.Count) {
        $outputFile = $Args[$i + 1]
        break
    }
}

if ($outputFile) {
    Write-Host "[codex-SIM] Generating result at: $outputFile" -ForegroundColor Cyan
    "## Simulated Codex Result`n`nDone." | Out-File -FilePath $outputFile -Encoding UTF8 -Force
}

Write-Host "[codex-SIM] Task completed."
