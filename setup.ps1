#!/usr/bin/env pwsh

Clear-Host
Write-Host ""
Write-Host "========================================"
Write-Host "License Verification System - Setup"
Write-Host "========================================"
Write-Host ""

# Check Node.js
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH"
    Write-Host "Please download from https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js found:"
node --version
npm --version
Write-Host ""

Write-Host "[1/3] Installing backend dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install backend dependencies"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Backend dependencies installed"
Write-Host ""

Write-Host "[2/3] Installing frontend dependencies..."
Push-Location client
npm install
Pop-Location
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install frontend dependencies"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Frontend dependencies installed"
Write-Host ""

Write-Host "[3/3] Building frontend..."
Push-Location client
npm run build
Pop-Location
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to build frontend"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Frontend built successfully"
Write-Host ""

Write-Host "========================================"
Write-Host "Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "To start the server, run: npm start"
Write-Host "Or double-click start.bat"
Write-Host ""
Read-Host "Press Enter to exit"
