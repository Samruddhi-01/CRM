@echo off
echo Restarting Backend Server...
echo.

echo Stopping any existing Java processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting backend server...
cd /d "%~dp0"
mvn spring-boot:run

pause
