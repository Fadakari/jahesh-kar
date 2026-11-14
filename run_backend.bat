@echo off
chcp 65001 > nul
echo ========================================================
echo   اجرای بک‌اند جنگو - سامانه آموزشی یاسین دهقان
echo   آدرس پنل ادمین: http://127.0.0.1:8000/admin/
echo   نام کاربری: admin
echo   رمز عبور: admin123456
echo ========================================================
cd backend
..\venv\Scripts\python manage.py runserver 127.0.0.1:8000
pause
