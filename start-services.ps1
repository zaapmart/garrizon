# Start Garrizon Services
# This script starts MySQL and Backend services

Write-Host ""
Write-Host "=== Starting Garrizon Services ===" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue
    Write-Host "Waiting for Docker to start (30 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Check again
    try {
        docker info | Out-Null
        Write-Host "[OK] Docker is now running" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Docker failed to start. Please start Docker Desktop manually." -ForegroundColor Red
        exit 1
    }
}

# Start MySQL service first
Write-Host ""
Write-Host "Starting MySQL database..." -ForegroundColor Yellow
docker-compose up -d mysql

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] MySQL container started" -ForegroundColor Green
    Write-Host "Waiting for MySQL to be ready (30 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
} else {
    Write-Host "[ERROR] Failed to start MySQL container" -ForegroundColor Red
    exit 1
}

# Check if MySQL is ready
Write-Host ""
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
$maxRetries = 10
$retryCount = 0
$mysqlReady = $false

while ($retryCount -lt $maxRetries -and -not $mysqlReady) {
    try {
        docker exec garrizon-db mysqladmin ping -h localhost -u root -proot123 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $mysqlReady = $true
            Write-Host "[OK] MySQL is ready!" -ForegroundColor Green
        }
    } catch {
        $retryCount++
        Write-Host "Waiting for MySQL... ($retryCount/$maxRetries)" -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
}

if (-not $mysqlReady) {
    Write-Host "[WARNING] MySQL may not be fully ready, but continuing..." -ForegroundColor Yellow
}

# Check Java before starting backend
Write-Host ""
Write-Host "Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "[OK] Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java not found! Please install Java 21 or higher." -ForegroundColor Red
    Write-Host "Backend will not start without Java." -ForegroundColor Red
    exit 1
}

# Start Backend
Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "The backend will create database tables automatically on first start." -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the backend server." -ForegroundColor Gray
Write-Host ""

Set-Location backend
.\mvnw.cmd spring-boot:run
