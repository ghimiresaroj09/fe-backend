@echo off
setlocal enabledelayedexpansion
cls
echo.
echo ========================================
echo License Verification System - Starting
echo ========================================
echo.

REM Add Node.js to PATH
set PATH=C:\Program Files\nodejs;%PATH%

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found
    pause
    exit /b 1
)

echo [OK] Node.js detected
echo [*] Starting server on http://localhost:5000
echo.
echo Press CTRL+C to stop the server
echo.
echo ========================================
echo.

node server.js
pause
