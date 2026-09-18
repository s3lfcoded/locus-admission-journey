#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "==================================================="
echo "  UniPath AI - Personal Admission Journey"
echo "  LOCUS Startup Hackathon 2026 (Case 02)"
echo "==================================================="
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[!] Node.js не найден на этой машине!"
    echo "Установи Node.js: https://nodejs.org/"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[*] Установка зависимостей (npm install)..."
    npm install
fi

echo ""
echo "[*] Сервер запускается..."
echo "  - Локально: http://localhost:5173"
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo "127.0.0.1")
echo "  - По сети Wi-Fi: http://${IP}:5173"
echo ""

if command -v open >/dev/null 2>&1; then
    open "http://localhost:5173" &
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:5173" &
fi

npx vite --host 0.0.0.0 --port 5173
