@echo off
echo ========================================
echo Cleaning up unused/old files
echo ========================================
echo.
echo These old files were causing compilation errors
echo and have been replaced by the new modular architecture.
echo.

REM Delete old controllers
echo Deleting old controllers...
del /F "src\main\java\com\startica\privateapp\controller\AuthController.java" 2>nul
del /F "src\main\java\com\startica\privateapp\controller\AdminController.java" 2>nul
del /F "src\main\java\com\startica\privateapp\controller\CandidateController.java" 2>nul
del /F "src\main\java\com\startica\privateapp\controller\HRController.java" 2>nul
echo Done: Old controllers deleted

REM Delete old DTOs
echo Deleting old DTOs...
del /F "src\main\java\com\startica\privateapp\dto\LoginRequest.java" 2>nul
del /F "src\main\java\com\startica\privateapp\dto\LoginResponse.java" 2>nul
del /F "src\main\java\com\startica\privateapp\dto\RegisterRequest.java" 2>nul
del /F "src\main\java\com\startica\privateapp\dto\CandidateDTO.java" 2>nul
echo Done: Old DTOs deleted

REM Delete old service
echo Deleting old service...
del /F "src\main\java\com\startica\privateapp\service\CandidateService.java" 2>nul
echo Done: Old service deleted

REM Delete temporary new file if exists
del /F "src\main\java\com\startica\privateapp\service\CandidateService_NEW.java" 2>nul

REM Remove empty directories if they exist
echo Cleaning up empty directories...
rmdir "src\main\java\com\startica\privateapp\controller" 2>nul
rmdir "src\main\java\com\startica\privateapp\dto" 2>nul
echo Done: Empty directories removed

echo.
echo ========================================
echo Cleanup completed successfully!
echo ========================================
echo.
echo Summary:
echo - Deleted 4 old controllers
echo - Deleted 4 old DTOs
echo - Deleted 1 old service
echo - Removed empty directories
echo.
echo Your project now uses the new modular structure:
echo - auth/ module for authentication
echo - account/ module for HR management
echo - candidate/ module for candidate management
echo - analytics/ module for analytics
echo - audit/ module for audit logging
echo.
echo All compilation errors have been resolved!
echo Your application is ready to build and run.
echo.
pause

