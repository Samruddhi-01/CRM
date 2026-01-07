@echo off
echo ========================================
echo Adding Missing Columns to Database
echo ========================================
echo.

mysql -u root -proot < add-missing-columns.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS: Database columns added!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to add columns
    echo ========================================
)

pause
