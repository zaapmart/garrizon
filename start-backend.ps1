# Script to Start Backend Server
# This script checks prerequisites and starts the backend

Write-Host "=== Garrizon Backend Startup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Java is installed
Write-Host "Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "[OK] Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java not found! Please install Java 21 or higher." -ForegroundColor Red
    Write-Host "Download from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check if Maven wrapper exists
Write-Host ""
Write-Host "Checking Maven..." -ForegroundColor Yellow
if (Test-Path "backend\mvnw.cmd") {
    Write-Host "[OK] Maven wrapper found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Maven wrapper not found in backend directory" -ForegroundColor Red
    exit 1
}

# Check if MySQL is running (optional check)
Write-Host ""
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
try {
    $mysqlTest = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
    if ($mysqlTest.TcpTestSucceeded) {
        Write-Host "[OK] MySQL appears to be running on port 3306" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] MySQL not detected on port 3306" -ForegroundColor Yellow
        Write-Host "You may need to start MySQL or use Docker Compose" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To start MySQL with Docker Compose, run:" -ForegroundColor Cyan
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  docker-compose up -d mysqldb" -ForegroundColor White
    }
} catch {
    Write-Host "[WARNING] Could not check MySQL connection" -ForegroundColor Yellow
}

# Navigate to backend directory
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Yellow
Write-Host "API Documentation at: http://localhost:8080/swagger-ui.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

Set-Location backend
.\mvnw.cmd spring-boot:run
