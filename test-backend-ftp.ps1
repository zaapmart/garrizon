# Backend FTP Connection Test Script
# Testing connection to backend server with same credentials

$ftpHost = "ftp.royalseeds.net"
$ftpPort = 21
$ftpUsername = "kufre@app.garrizon.com"
$ftpPassword = "Ilove3lia1986"

function Test-BackendConnection {
    param([string]$RemotePath = "/")
    
    Write-Host "`n=== Testing Backend Server Connection ===" -ForegroundColor Cyan
    Write-Host "Host: $ftpHost" -ForegroundColor Yellow
    Write-Host "Port: $ftpPort" -ForegroundColor Yellow
    Write-Host "Username: $ftpUsername" -ForegroundColor Yellow
    Write-Host "Remote Path: $RemotePath" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $ftpUrl = "ftp://${ftpHost}:${ftpPort}$RemotePath"
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        Write-Host "Connecting..." -ForegroundColor Gray
        
        $response = $ftpRequest.GetResponse()
        $responseStream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        
        $contents = $reader.ReadToEnd()
        
        Write-Host "✓ Connection successful!" -ForegroundColor Green
        Write-Host "`n=== Directory Contents ===" -ForegroundColor Green
        
        $contents.Split("`r`n") | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
            Write-Host $_ -ForegroundColor White
        }
        
        $reader.Close()
        $response.Close()
        
        return $true
    }
    catch {
        Write-Host "✗ Connection failed: $_" -ForegroundColor Red
        Write-Host "Error Details: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Explore-Directories {
    # Common backend directories to check
    $directoriesToCheck = @(
        "/",
        "/backend",
        "/backends",
        "/app",
        "/apps",
        "/ROOT",
        "/ROOT/backend",
        "/webapps",
        "/webapps/ROOT",
        "/tomcat",
        "/tomcat/webapps",
        "/www",
        "/www/backend",
        "/public_html/backend"
    )
    
    Write-Host "`n=== Exploring Backend Directories ===" -ForegroundColor Cyan
    
    foreach ($dir in $directoriesToCheck) {
        Write-Host "`nChecking: $dir" -ForegroundColor Yellow
        Test-BackendConnection -RemotePath $dir
        Start-Sleep -Milliseconds 500  # Small delay between requests
    }
}

# Test root connection first
Write-Host "Testing root directory..." -ForegroundColor Cyan
Test-BackendConnection -RemotePath "/"

# Ask if user wants to explore more directories
Write-Host "`nWould you like to explore other directories? (y/n)" -ForegroundColor Yellow
$explore = Read-Host

if ($explore -eq "y" -or $explore -eq "Y") {
    Explore-Directories
} else {
    Write-Host "`nConnection test complete. Root directory is accessible." -ForegroundColor Green
}
