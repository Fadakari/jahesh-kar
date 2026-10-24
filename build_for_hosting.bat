@echo off
chcp 65001 > nul
echo ========================================================
echo   سامانه جهش کار - ساخت پکیج نهایی جهت آپلود روی هاست
echo ========================================================
echo.

echo 1. ساخت فایل‌های فرانت‌اند React...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [خطا] در فرآیند ساخت فرانت‌اند خطایی رخ داد.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo 2. اعمال تغییرات دیتابیس جنگو...
cd backend
call ..\venv\Scripts\python manage.py migrate
if %errorlevel% neq 0 (
    echo [خطا] در اجرای مایگریشن خطایی رخ داد.
)

echo.
echo 3. جمع‌آوری فایل‌های استاتیک...
call ..\venv\Scripts\python manage.py collectstatic --noinput

cd ..
echo.
echo ========================================================
echo   عملیات با موفقیت انجام شد!
echo   پروژه آماده آپلود روی هاست اشتراکی است.
echo   فایل راهنما در پوشه deploy\cpanel_guide.md قرار دارد.
echo ========================================================
pause
