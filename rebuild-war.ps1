# Quick WAR Rebuild and Verification Script
# This script rebuilds the backend WAR file and verifies its integrity

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Garrizon Backend WAR Rebuild ===" -ForegroundColor Cyan
Write-Host ""

# Step 0: Set JAVA_HOME if missing
if (-not $env:JAVA_HOME) {
    if (Test-Path "C:\Program Files\Java\jdk-11") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
        Write-Host "Setting JAVA_HOME to $env:JAVA_HOME" -ForegroundColor Gray
    }
    else {
        Write-Host "[WARNING] JAVA_HOME not set and default path not found. Build may fail." -ForegroundColor Yellow
    }
}

# Step 1: Clean previous build
Write-Host "Step 1: Cleaning previous build..." -ForegroundColor Yellow
Set-Location backend

try {
    # Ensure Java is in PATH for this session
    if ($env:JAVA_HOME) { $env:PATH = "$env:JAVA_HOME\bin;$env:PATH" }
    
    # Run maven and capture output
    .\mvnw.cmd clean
    if ($LASTEXITCODE -ne 0) {
        throw "Clean failed with exit code $LASTEXITCODE"
    }
    Write-Host "[OK] Clean successful" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Clean failed: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Step 2: Build new WAR
Write-Host ""
Write-Host "Step 2: Building WAR file..." -ForegroundColor Yellow

try {
    # Ensure Java is in PATH for this session
    if ($env:JAVA_HOME) { $env:PATH = "$env:JAVA_HOME\bin;$env:PATH" }
    
    # Run maven and capture output
    .\mvnw.cmd package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
    Write-Host "[OK] Build successful" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Build failed: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# Step 3: Verify WAR file
Write-Host ""
Write-Host "Step 3: Verifying WAR file..." -ForegroundColor Yellow

$warFile = "backend\target\garrizon-backend-0.0.1-SNAPSHOT.war"

if (-not (Test-Path $warFile)) {
    Write-Host "[ERROR] WAR file not found!" -ForegroundColor Red
    exit 1
}

$warInfo = Get-Item $warFile
$warSizeMB = [math]::Round($warInfo.Length / 1MB, 2)

Write-Host "WAR file: $warFile" -ForegroundColor Gray
Write-Host "Size: $warSizeMB MB" -ForegroundColor Gray
Write-Host "Created: $($warInfo.LastWriteTime)" -ForegroundColor Gray

# Verify it's a valid ZIP/WAR file
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $warFile))
    $entryCount = $zip.Entries.Count
    
    # Check for key files
    $hasWebInf = $zip.Entries | Where-Object { $_.FullName -like "WEB-INF/*" }
    $hasClasses = $zip.Entries | Where-Object { $_.FullName -like "WEB-INF/classes/*" }
    $hasApplicationYml = $zip.Entries | Where-Object { $_.FullName -eq "WEB-INF/classes/application.yml" }
    
    $zip.Dispose()
    
    Write-Host ""
    Write-Host "[OK] WAR file is valid!" -ForegroundColor Green
    Write-Host "  - Total entries: $entryCount" -ForegroundColor Gray
    Write-Host "  - Has WEB-INF: $($hasWebInf.Count -gt 0)" -ForegroundColor Gray
    Write-Host "  - Has classes: $($hasClasses.Count -gt 0)" -ForegroundColor Gray
    Write-Host "  - Has application.yml: $($hasApplicationYml -ne $null)" -ForegroundColor Gray
    
    if ($warSizeMB -lt 10) {
        Write-Host ""
        Write-Host "[WARNING] WAR file seems small ($warSizeMB MB). Expected at least 30-50 MB." -ForegroundColor Yellow
        Write-Host "This might indicate missing dependencies." -ForegroundColor Yellow
    }
    
    if ($hasApplicationYml) {
        Write-Host ""
        Write-Host "Extracting application.yml for verification..." -ForegroundColor Gray
        
        # Extract application.yml to temp location
        $tempDir = Join-Path $env:TEMP "garrizon-war-check"
        if (Test-Path $tempDir) {
            Remove-Item $tempDir -Recurse -Force
        }
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        
        [System.IO.Compression.ZipFile]::ExtractToDirectory((Resolve-Path $warFile), $tempDir)
        
        $appYmlPath = Join-Path $tempDir "WEB-INF\classes\application.yml"
        if (Test-Path $appYmlPath) {
            Write-Host ""
            Write-Host "=== Database Configuration in WAR ===" -ForegroundColor Cyan
            Get-Content $appYmlPath | Select-String -Pattern "datasource|url|username|password" | ForEach-Object {
                # Mask password
                $line = $_.Line
                if ($line -match "password") {
                    $line = $line -replace '(password:\s*)[^\s]+', '$1***MASKED***'
                }
                Write-Host $line -ForegroundColor Gray
            }
        }
        
        # Cleanup
        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
    
}
catch {
    Write-Host "[ERROR] WAR file appears to be corrupted!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Calculate checksum
Write-Host ""
Write-Host "Calculating checksum..." -ForegroundColor Gray
$hash = Get-FileHash -Path $warFile -Algorithm SHA256
Write-Host "SHA256: $($hash.Hash)" -ForegroundColor Gray

# Step 5: Ready to deploy
Write-Host ""
Write-Host "=== WAR File Ready for Deployment ===" -ForegroundColor Green
Write-Host ""
Write-Host "File: $warFile" -ForegroundColor Cyan
Write-Host "Size: $warSizeMB MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy using: .\deploy-production.ps1 -SkipFrontend" -ForegroundColor Gray
Write-Host "2. Or manually upload to: /ROOT/ROOT.war" -ForegroundColor Gray
Write-Host "3. Monitor logs: tail -f /home/royalsee/tomcat/logs/catalina.out" -ForegroundColor Gray
Write-Host ""
