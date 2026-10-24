@echo off
chcp 65001 > nul
echo ========================================================
echo   راه‌اندازی کامل سامانه فروش دوره جهش کار
echo   در حال اجرای بک‌اند و فرانت‌اند...
echo ========================================================
start "JaheshKar Backend (Django)" run_backend.bat
timeout /t 2 > nul
start "JaheshKar Frontend (React)" run_frontend.bat
echo هر دو سرور اجرا شدند!
