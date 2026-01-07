@echo off
echo ============================================
echo Education Columns Migration Script
echo ============================================
echo.

set /p DB_NAME="Enter your database name: "
set /p DB_USER="Enter MySQL username (default: root): "
if "%DB_USER%"=="" set DB_USER=root

echo.
echo Connecting to MySQL and running migration...
echo.

mysql -u %DB_USER% -p %DB_NAME% < add-education-columns.sql

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo Migration completed successfully!
    echo ============================================
    echo.
    echo Please restart your backend server.
    echo.
) else (
    echo.
    echo ============================================
    echo Migration failed! Please check the error above.
    echo ============================================
    echo.
)

pause
