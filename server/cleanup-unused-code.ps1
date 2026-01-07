# PowerShell script to clean up unused/old files
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleaning up unused/old files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Delete old controllers
Write-Host "Deleting old controllers..." -ForegroundColor Yellow
Remove-Item -Path "src\main\java\com\startica\privateapp\controller\AuthController.java" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\controller\AdminController.java" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\controller\CandidateController.java" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\controller\HRController.java" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Old controllers deleted" -ForegroundColor Green

# Delete old DTOs
Write-Host "Deleting old DTOs..." -ForegroundColor Yellow
Remove-Item -Path "src\main\java\com\startica\privateapp\dto\LoginRequest.java" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\dto\LoginResponse.java" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\dto\RegisterRequest.java" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\dto\CandidateDTO.java" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Old DTOs deleted" -ForegroundColor Green

# Delete old service
Write-Host "Deleting old service..." -ForegroundColor Yellow
Remove-Item -Path "src\main\java\com\startica\privateapp\service\CandidateService.java" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Old service deleted" -ForegroundColor Green

# Remove empty directories
Write-Host "Cleaning up empty directories..." -ForegroundColor Yellow
Remove-Item -Path "src\main\java\com\startica\privateapp\controller" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\main\java\com\startica\privateapp\dto" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Empty directories removed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleanup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "- Deleted 4 old controllers" -ForegroundColor Gray
Write-Host "- Deleted 4 old DTOs" -ForegroundColor Gray
Write-Host "- Deleted 1 old service" -ForegroundColor Gray
Write-Host "- Removed empty directories" -ForegroundColor Gray
Write-Host ""
Write-Host "Your project now uses the new modular structure:" -ForegroundColor White
Write-Host "- auth/ module for authentication" -ForegroundColor Gray
Write-Host "- account/ module for HR management" -ForegroundColor Gray
Write-Host "- candidate/ module for candidate management" -ForegroundColor Gray
Write-Host "- analytics/ module for analytics" -ForegroundColor Gray
Write-Host "- audit/ module for audit logging" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

