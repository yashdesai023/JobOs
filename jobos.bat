@echo off
echo ===================================================
echo           Starting JobOs System 🚀
echo ===================================================

:: 1. Start Backend Server (FastAPI)
echo Starting Backend (Port 8000)...
start "JobOs Backend" cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: 2. Start Frontend (Vite/React)
echo Starting Frontend (Port 5173)...
start "JobOs Frontend" cmd /k "cd frontend && npm run dev"

:: Reminder for PocketBase
echo.
echo [IMPORTANT] Make sure your PocketBase is running on http://127.0.0.1:8090!
echo If you haven't started it, please run your PocketBase executable separately.
echo.
echo JobOs is launching...
pause
