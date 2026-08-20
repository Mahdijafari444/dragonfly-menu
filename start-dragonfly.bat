@echo off
title Dragonfly Coffee Shop Menu
echo.
echo  ===================================
echo   🪰 Dragonfly Coffee Shop
echo  ===================================
echo.
echo  Starting the menu server...
echo.

cd /d "%~dp0"

echo  Building the app...
call npm run build

echo.
echo  Starting server on port 3000...
echo.
echo  ===================================
echo   CUSTOMERS: http://localhost:3000/menu
echo.
echo   ADMIN:     http://localhost:3000/admin
echo   Password:  dragonfly2024
echo  ===================================
echo.
echo  Press Ctrl+C to stop the server.
echo.

call npm start
pause
