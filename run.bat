@echo off
title UniPath AI - LOCUS Hackathon 2026
echo ===================================================
echo   UniPath AI - Personal Admission Journey
echo   LOCUS Startup Hackathon 2026 (Case 02)
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js не найден!
    echo Установи Node.js LTS с официального сайта: https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [*] Установка зависимостей (npm install)...
    call npm install
    if %errorlevel% neq 0 (
        echo [!] Ошибка при установке зависимостей!
        pause
        exit /b 1
    )
)

echo.
echo [*] Запуск сервера на http://localhost:5173 ...
start "" "http://localhost:5173"
call npx vite --host 0.0.0.0 --port 5173
pause
