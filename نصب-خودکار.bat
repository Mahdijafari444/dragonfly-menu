@echo off
title Dragonfly - Quick Setup
echo.
echo  ===================================
echo   🪰 Dragonfly Coffee Shop Setup
echo  ===================================
echo.

cd /d "%~dp0"

echo  [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo  ERROR: npm install failed. Make sure Node.js is installed.
    echo  Download from: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo  [2/3] Building the app...
call npm run build
if %errorlevel% neq 0 (
    echo  ERROR: Build failed.
    pause
    exit /b 1
)

echo.
echo  [3/3] Creating desktop shortcut...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([System.IO.Path]::GetFolderPath('Desktop'), 'Dragonfly Menu.lnk')); $s.TargetPath = '%~dp0start-dragonfly.bat'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Dragonfly Coffee Shop Menu'; $s.Save()"
echo  Shortcut created on Desktop!

echo.
echo  ===================================
echo   SETUP COMPLETE!
echo  ===================================
echo.
echo  To start the server, double-click:
echo  - "start-dragonfly.bat" in this folder
echo  - Or "Dragonfly Menu" shortcut on your Desktop
echo.
echo  Customer menu:  http://localhost:3000/menu
echo  Admin panel:    http://localhost:3000/admin
echo  Admin password: dragonfly2024
echo.
pause
