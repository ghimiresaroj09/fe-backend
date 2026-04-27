#!/usr/bin/env pwsh

Clear-Host
Write-Host ""
Write-Host "========================================"
Write-Host "License Verification System - Starting"
Write-Host "========================================"
Write-Host ""

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[ERROR] Node.js is not installed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js detected"
Write-Host "[*] Starting server on http://localhost:5000"
Write-Host ""
Write-Host "Press CTRL+C to stop the server"
Write-Host ""
Write-Host "========================================"
Write-Host ""

node server.js
Read-Host "Press Enter to exit"
