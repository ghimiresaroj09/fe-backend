@echo off
setlocal enabledelayedexpansion
cls
echo.
echo ========================================
echo License Verification System - Setup
echo ========================================
echo.

REM Add Node.js to PATH
set PATH=C:\Program Files\nodejs;%PATH%

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found in C:\Program Files\nodejs
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
npm --version
echo.

echo [1/3] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo [2/3] Installing frontend dependencies...
cd client
call npm install
cd ..
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

echo [3/3] Building frontend...
cd client
call npm run build
cd ..
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)
echo [OK] Frontend built successfully
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the server, run: npm start
echo Or double-click start.bat
echo.
pause
