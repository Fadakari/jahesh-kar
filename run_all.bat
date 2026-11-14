@echo off
chcp 65001 > nul
echo ========================================================
echo   راه‌اندازی کامل سامانه فروش دوره یاسین دهقان
echo   در حال اجرای بک‌اند و فرانت‌اند...
echo ========================================================
start "Yasin Dehqan Backend (Django)" run_backend.bat
timeout /t 2 > nul
start "Yasin Dehqan Frontend (React)" run_frontend.bat
echo هر دو سرور اجرا شدند!
