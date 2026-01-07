@echo off
echo ========================================
echo Starting Private App Backend Server
echo (Using MySQL Database)
echo ========================================
echo.

cd /d E:\Startica\private-app\private-app\server

echo Checking Maven installation...
call mvn -version
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo.
    echo Please install Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo.
echo Checking MySQL connection...
mysql -u root -proot -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Cannot connect to MySQL!
    echo.
    echo Please make sure:
    echo   1. MySQL server is running
    echo   2. Username is 'root' with password 'root'
    echo   3. MySQL is listening on port 3306
    echo.
    echo The application will try to connect anyway...
    timeout /t 5
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
echo Database: MySQL (localhost:3306)
echo Database Name: privateappdb (will be created automatically)
echo Username: root
echo Password: root
echo.
echo Initial users will be created:
echo   Admin: admin@startica.com / admin123
echo   HR: hr@startica.com / hr123
echo.
echo Access the application at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run

pause
