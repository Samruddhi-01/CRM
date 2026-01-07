@echo off
echo ========================================
echo Starting Private App Backend Server
echo ========================================
echo.

cd /d E:\Startica\private-app\private-app\server

echo Checking Maven installation...
call mvn -version
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Building the application...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting the application on port 8080...
echo ========================================
echo.
echo Make sure MySQL is running on localhost:3306
echo Database: privateappdb (will be created automatically)
echo Username: root
echo Password: root
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run

pause

