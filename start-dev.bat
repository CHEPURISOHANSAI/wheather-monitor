@echo off
cd /d "%~dp0"
echo Starting Atmos Weather App development server...
pnpm dev --host 0.0.0.0 --port 5173
pause
