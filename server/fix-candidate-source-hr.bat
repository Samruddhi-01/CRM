@echo off
REM Fix HR Candidate Source Assignment
REM This script updates candidates with NULL source_hr_id

echo ============================================
echo HR Candidate Source Fix
echo ============================================
echo.

REM Check if MySQL is accessible
echo Checking MySQL connection...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL or add it to your PATH
    pause
    exit /b 1
)

echo.
echo This script will:
echo 1. Find the first HR user in the system
echo 2. Update all candidates with NULL source_hr_id
echo 3. Assign them to the first HR user
echo.

set /p DB_NAME="Enter database name (default: startica_db): "
if "%DB_NAME%"=="" set DB_NAME=startica_db

set /p DB_USER="Enter MySQL username (default: root): "
if "%DB_USER%"=="" set DB_USER=root

echo.
echo Connecting to database: %DB_NAME%
echo Username: %DB_USER%
echo.

REM Execute the SQL script
mysql -u %DB_USER% -p %DB_NAME% < fix-candidate-source-hr.sql

if errorlevel 1 (
    echo.
    echo ERROR: Failed to execute SQL script
    echo Please check your database credentials and try again
    pause
    exit /b 1
)

echo.
echo ============================================
echo Fix completed successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Login as an HR user
echo 2. Navigate to "My Candidate Remarks"
echo 3. You should now see the candidates
echo.

pause
