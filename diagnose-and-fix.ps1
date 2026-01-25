# Garrizon Deployment Diagnostic and Fix Script
# This script will help diagnose and fix deployment issues

param(
    [switch]$TestDatabaseOnly,
    [switch]$RebuildAndDeploy
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Garrizon Deployment Diagnostics ===" -ForegroundColor Cyan
Write-Host ""

# Database Configuration
$dbHost = "gldz3.dailyrazor.com"
$dbPort = "3306"
$dbName = "royalsee_garrizon"
$dbUser = "royalsee_gzon_user"
$dbPassword = "G@rr1z0n+DB+P@55w0rd"

# Step 1: Test Database Connection
Write-Host "=== Step 1: Testing Database Connection ===" -ForegroundColor Yellow
Write-Host "Host: $dbHost" -ForegroundColor Gray
Write-Host "Port: $dbPort" -ForegroundColor Gray
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host "User: $dbUser" -ForegroundColor Gray
Write-Host ""

# Check if MySQL client is available
$mysqlPath = $null
$possiblePaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 5.7\bin\mysql.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $mysqlPath = $path
        break
    }
}

if ($mysqlPath) {
    Write-Host "Testing connection with MySQL client..." -ForegroundColor Gray
    
    # Create a temporary SQL file to test connection
    $testSql = @"
SELECT 'Connection successful!' as status;
SHOW DATABASES;
"@
    
    $tempSqlFile = Join-Path $env:TEMP "test_connection.sql"
    $testSql | Out-File -FilePath $tempSqlFile -Encoding ASCII
    
    try {
        $output = & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p"$dbPassword" -e "SELECT 'Connection successful!' as status;" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Database connection successful!" -ForegroundColor Green
            Write-Host $output -ForegroundColor Gray
        }
        else {
            Write-Host "[ERROR] Database connection failed!" -ForegroundColor Red
            Write-Host $output -ForegroundColor Red
            Write-Host ""
            Write-Host "Possible solutions:" -ForegroundColor Yellow
            Write-Host "1. Verify the password is correct" -ForegroundColor Yellow
            Write-Host "2. Check if the user has proper permissions" -ForegroundColor Yellow
            Write-Host "3. Verify the database exists" -ForegroundColor Yellow
            Write-Host "4. Check if the MySQL server allows remote connections" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "[ERROR] Failed to execute MySQL command: $_" -ForegroundColor Red
    }
    
    Remove-Item $tempSqlFile -ErrorAction SilentlyContinue
}
else {
    Write-Host "[WARNING] MySQL client not found. Using Java-based test..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To manually test the database connection, you can:" -ForegroundColor Cyan
    Write-Host "1. Use DBeaver or MySQL Workbench" -ForegroundColor Gray
    Write-Host "2. Use online MySQL connection tester" -ForegroundColor Gray
    Write-Host "3. Install MySQL client: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Gray
}

if ($TestDatabaseOnly) {
    Write-Host ""
    Write-Host "Database test complete. Exiting..." -ForegroundColor Cyan
    exit 0
}

# Step 2: Check WAR file integrity
Write-Host ""
Write-Host "=== Step 2: Checking WAR File Integrity ===" -ForegroundColor Yellow

$warFile = "backend\target\garrizon-backend-0.0.1-SNAPSHOT.war"

if (Test-Path $warFile) {
    $warSize = (Get-Item $warFile).Length
    Write-Host "WAR file found: $warFile" -ForegroundColor Gray
    Write-Host "Size: $([math]::Round($warSize / 1MB, 2)) MB" -ForegroundColor Gray
    
    # Try to verify it's a valid ZIP file
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $warFile))
        $entryCount = $zip.Entries.Count
        $zip.Dispose()
        
        Write-Host "[OK] WAR file is valid (contains $entryCount entries)" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] WAR file appears to be corrupted!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Solution: Rebuild the WAR file" -ForegroundColor Yellow
        $RebuildAndDeploy = $true
    }
}
else {
    Write-Host "[WARNING] WAR file not found. Need to build." -ForegroundColor Yellow
    $RebuildAndDeploy = $true
}

# Step 3: Rebuild if needed
if ($RebuildAndDeploy) {
    Write-Host ""
    Write-Host "=== Step 3: Rebuilding Backend ===" -ForegroundColor Yellow
    
    Set-Location backend
    
    Write-Host "Cleaning previous build..." -ForegroundColor Gray
    .\mvnw.cmd clean
    
    Write-Host "Building WAR file..." -ForegroundColor Gray
    .\mvnw.cmd package -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Build failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Write-Host "[OK] Build successful!" -ForegroundColor Green
    Set-Location ..
    
    # Verify the new WAR file
    if (Test-Path $warFile) {
        $warSize = (Get-Item $warFile).Length
        Write-Host "New WAR file size: $([math]::Round($warSize / 1MB, 2)) MB" -ForegroundColor Gray
        
        try {
            Add-Type -AssemblyName System.IO.Compression.FileSystem
            $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $warFile))
            $entryCount = $zip.Entries.Count
            $zip.Dispose()
            
            Write-Host "[OK] New WAR file is valid (contains $entryCount entries)" -ForegroundColor Green
        }
        catch {
            Write-Host "[ERROR] New WAR file is still corrupted!" -ForegroundColor Red
            exit 1
        }
    }
}

# Step 4: Recommendations
Write-Host ""
Write-Host "=== Recommendations ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Database Connection:" -ForegroundColor Yellow
Write-Host "   - Verify credentials with your hosting provider" -ForegroundColor Gray
Write-Host "   - Ensure the database user has proper permissions" -ForegroundColor Gray
Write-Host "   - Check if remote connections are allowed" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Deployment:" -ForegroundColor Yellow
Write-Host "   - Use binary mode for FTP transfer" -ForegroundColor Gray
Write-Host "   - Verify WAR file integrity after upload" -ForegroundColor Gray
Write-Host "   - Check server logs after deployment" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Next Steps:" -ForegroundColor Yellow
Write-Host "   - If database test failed, contact your hosting provider" -ForegroundColor Gray
Write-Host "   - If WAR is valid, redeploy using: .\deploy-production.ps1 -SkipFrontend" -ForegroundColor Gray
Write-Host "   - Monitor Tomcat logs after deployment" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Diagnostics Complete ===" -ForegroundColor Green
Write-Host ""
