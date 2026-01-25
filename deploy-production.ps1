# Production Deployment Script
# This script builds and deploys both frontend and backend to production

param(
    [switch]$BuildOnly,
    [switch]$SkipBackend,
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Garrizon Production Deployment ===" -ForegroundColor Cyan
Write-Host ""

# FTP Configuration
$ftpHost = "ftp.royalseeds.net"
$ftpPort = 21
$ftpUsername = "kufre@app.garrizon.com"
$ftpPassword = "Ilove3lia1986"

# Deployment paths
$frontendRemotePath = "/public_html"
$backendRemotePath = "/ROOT"

# Step 1: Build Frontend
if (-not $SkipFrontend) {
    Write-Host "=== Step 1: Building Frontend ===" -ForegroundColor Yellow
    Set-Location frontend
    
    Write-Host "Installing dependencies..." -ForegroundColor Gray
    npm ci
    
    Write-Host "Building production bundle..." -ForegroundColor Gray
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Frontend build failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Write-Host "[OK] Frontend built successfully" -ForegroundColor Green
    Write-Host "Build output: frontend/dist" -ForegroundColor Gray
    Set-Location ..
    
    if ($BuildOnly) {
        Write-Host "Build-only mode: Skipping deployment" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Skipping frontend build" -ForegroundColor Yellow
}

# Step 2: Build Backend
if (-not $SkipBackend) {
    Write-Host ""
    Write-Host "=== Step 2: Building Backend ===" -ForegroundColor Yellow
    Set-Location backend
    
    Write-Host "Building WAR file..." -ForegroundColor Gray
    .\mvnw.cmd clean package -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Backend build failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    if (-not (Test-Path "target\garrizon-backend-0.0.1-SNAPSHOT.war")) {
        Write-Host "[ERROR] WAR file not found after build!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Write-Host "[OK] Backend built successfully" -ForegroundColor Green
    Write-Host "WAR file: backend/target/garrizon-backend-0.0.1-SNAPSHOT.war" -ForegroundColor Gray
    Set-Location ..
    
    if ($BuildOnly) {
        Write-Host "Build-only mode: Skipping deployment" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Skipping backend build" -ForegroundColor Yellow
}

# Step 3: Deploy to FTP
Write-Host ""
Write-Host "=== Step 3: Deploying to Production Server ===" -ForegroundColor Yellow

# Check if WinSCP is available
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"
if (-not (Test-Path $winscpPath)) {
    $winscpPath = "C:\Program Files\WinSCP\WinSCP.com"
}

if (-not (Test-Path $winscpPath)) {
    Write-Host "[ERROR] WinSCP not found. Please install WinSCP or use manual FTP upload." -ForegroundColor Red
    Write-Host "Frontend build: frontend/dist" -ForegroundColor Yellow
    Write-Host "Backend WAR: backend/target/garrizon-backend-0.0.1-SNAPSHOT.war" -ForegroundColor Yellow
    exit 1
}

# Deploy Frontend
if (-not $SkipFrontend) {
    Write-Host ""
    Write-Host "Deploying frontend to $frontendRemotePath ..." -ForegroundColor Cyan
    
    $scriptContent = @"
option batch abort
option confirm off
open ftp://$ftpUsername`:$ftpPassword@$ftpHost`:$ftpPort
cd $frontendRemotePath
synchronize remote "$(Get-Location)\frontend\dist" "$frontendRemotePath"
exit
"@
    
    $scriptFile = Join-Path $env:TEMP "winscp_deploy_$(Get-Date -Format 'yyyyMMddHHmmss').txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    
    & $winscpPath /script=$scriptFile /log=(Join-Path $env:TEMP "winscp_deploy_log.txt")
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Frontend deployed successfully" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Frontend deployment may have issues. Check log: $env:TEMP\winscp_deploy_log.txt" -ForegroundColor Yellow
    }
    
    Remove-Item $scriptFile -ErrorAction SilentlyContinue
}

# Deploy Backend
if (-not $SkipBackend) {
    Write-Host ""
    Write-Host "Deploying backend WAR to $backendRemotePath ..." -ForegroundColor Cyan
    
    $warFile = "$(Get-Location)\backend\target\garrizon-backend-0.0.1-SNAPSHOT.war"
    $warFileName = "ROOT.war"
    
    $scriptContent = @"
option batch abort
option confirm off
open ftp://$ftpUsername`:$ftpPassword@$ftpHost`:$ftpPort
cd $backendRemotePath
put "$warFile" "$warFileName"
exit
"@
    
    $scriptFile = Join-Path $env:TEMP "winscp_deploy_backend_$(Get-Date -Format 'yyyyMMddHHmmss').txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    
    & $winscpPath /script=$scriptFile /log=(Join-Path $env:TEMP "winscp_deploy_backend_log.txt")
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Backend WAR deployed successfully" -ForegroundColor Green
        Write-Host "[NOTE] The WAR file will be automatically deployed by your application server." -ForegroundColor Yellow
    } else {
        Write-Host "[WARNING] Backend deployment may have issues. Check log: $env:TEMP\winscp_deploy_backend_log.txt" -ForegroundColor Yellow
    }
    
    Remove-Item $scriptFile -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: https://garrizon.com" -ForegroundColor Cyan
Write-Host "Backend API: https://garrizon.com/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "[IMPORTANT] Make sure your production API URL is configured correctly!" -ForegroundColor Yellow
Write-Host "Update frontend/.env.production if needed." -ForegroundColor Yellow

