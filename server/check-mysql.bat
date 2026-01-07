@echo off
echo Checking MySQL connection...
echo.

mysql -u root -proot -e "SELECT VERSION();" 2>nul
if %errorlevel% equ 0 (
    echo ✓ MySQL is running and accessible
    echo.
    echo Checking/Creating database...
    mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS privateappdb;" 2>nul
    if %errorlevel% equ 0 (
        echo ✓ Database 'privateappdb' is ready
    ) else (
        echo ✗ Could not create database
    )
) else (
    echo ✗ MySQL is not running or credentials are incorrect
    echo.
    echo Please make sure:
    echo 1. MySQL server is running
    echo 2. Username is 'root' and password is 'root'
    echo 3. MySQL is listening on port 3306
)

echo.
pause

