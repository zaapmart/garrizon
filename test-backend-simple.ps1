# Backend FTP Connection Test Script (Simple Version)
$ftpHost = "ftp.royalseeds.net"
$ftpPort = 21
$ftpUsername = "kufre@app.garrizon.com"
$ftpPassword = "Ilove3lia1986"

Write-Host ""
Write-Host "=== Testing Backend Server Connection ===" -ForegroundColor Cyan
Write-Host "Host: $ftpHost" -ForegroundColor Yellow
Write-Host "Port: $ftpPort" -ForegroundColor Yellow
Write-Host "Username: $ftpUsername" -ForegroundColor Yellow
Write-Host ""

try {
    $ftpUrl = "ftp://${ftpHost}:${ftpPort}/"
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
    $ftpRequest.UseBinary = $true
    $ftpRequest.UsePassive = $true
    
    Write-Host "Connecting to backend server..." -ForegroundColor Gray
    
    $response = $ftpRequest.GetResponse()
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    
    $contents = $reader.ReadToEnd()
    
    Write-Host "[SUCCESS] Connection successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Root Directory Contents ===" -ForegroundColor Green
    
    $contents.Split([Environment]::NewLine) | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
        Write-Host $_ -ForegroundColor White
    }
    
    $reader.Close()
    $response.Close()
    
    # Test ROOT directory (common for Java apps)
    Write-Host ""
    Write-Host "=== Testing ROOT Directory ===" -ForegroundColor Cyan
    try {
        $rootUrl = "ftp://${ftpHost}:${ftpPort}/ROOT/"
        $rootRequest = [System.Net.FtpWebRequest]::Create($rootUrl)
        $rootRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $rootRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
        $rootRequest.UseBinary = $true
        $rootRequest.UsePassive = $true
        
        $rootResponse = $rootRequest.GetResponse()
        $rootStream = $rootResponse.GetResponseStream()
        $rootReader = New-Object System.IO.StreamReader($rootStream)
        
        $rootContents = $rootReader.ReadToEnd()
        
        Write-Host "[SUCCESS] ROOT directory accessible!" -ForegroundColor Green
        $rootContents.Split([Environment]::NewLine) | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
            Write-Host $_ -ForegroundColor White
        }
        
        $rootReader.Close()
        $rootResponse.Close()
    }
    catch {
        Write-Host "[WARNING] ROOT directory not accessible or doesn't exist" -ForegroundColor Yellow
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "[SUCCESS] Backend server connection test complete!" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Connection failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}