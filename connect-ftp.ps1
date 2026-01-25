# FTP Connection Script for Garrizon Deployment
# This script connects to the FTP server using native PowerShell

param(
    [string]$Action = "connect"
)

$ftpHost = "ftp.royalseeds.net"
$ftpPort = 21
$ftpUsername = "kufre@app.garrizon.com"
$ftpPassword = "Ilove3lia1986"
$ftpUrl = "ftp://${ftpHost}:${ftpPort}/"

function Connect-FTP {
    Write-Host "Connecting to FTP server: $ftpHost" -ForegroundColor Cyan
    
    try {
        # Create FTP request
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        Write-Host "Getting directory listing..." -ForegroundColor Yellow
        
        $response = $ftpRequest.GetResponse()
        $responseStream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        
        Write-Host "`n=== Directory Contents ===" -ForegroundColor Green
        $reader.ReadToEnd()
        
        $reader.Close()
        $response.Close()
        
        Write-Host "`n✓ Connection successful!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "`n✗ Connection failed: $_" -ForegroundColor Red
        return $false
    }
}

function List-FTPDirectory {
    param([string]$RemotePath = "/")
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create("$ftpUrl$RemotePath")
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        $response = $ftpRequest.GetResponse()
        $responseStream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        
        $files = $reader.ReadToEnd().Split("`n") | Where-Object { $_.Trim() -ne "" }
        
        $reader.Close()
        $response.Close()
        
        return $files
    }
    catch {
        Write-Host "Error listing directory: $_" -ForegroundColor Red
        return @()
    }
}

function Upload-FTPFile {
    param(
        [string]$LocalFile,
        [string]$RemotePath = "/"
    )
    
    if (-not (Test-Path $LocalFile)) {
        Write-Host "Local file not found: $LocalFile" -ForegroundColor Red
        return $false
    }
    
    try {
        $fileName = Split-Path $LocalFile -Leaf
        $ftpRequest = [System.Net.FtpWebRequest]::Create("$ftpUrl$RemotePath$fileName")
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        $ftpRequest.ContentLength = $fileContent.Length
        
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        Write-Host "✓ Uploaded: $fileName" -ForegroundColor Green
        $response.Close()
        
        return $true
    }
    catch {
        Write-Host "✗ Upload failed: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution
switch ($Action.ToLower()) {
    "connect" {
        Connect-FTP
    }
    "list" {
        $files = List-FTPDirectory
        Write-Host "`n=== Files and Directories ===" -ForegroundColor Green
        $files | ForEach-Object { Write-Host $_ }
    }
    default {
        Write-Host "Usage: .\connect-ftp.ps1 [connect|list]"
        Write-Host ""
        Write-Host "Actions:"
        Write-Host "  connect - Test FTP connection (default)"
        Write-Host "  list    - List directory contents"
        Write-Host ""
        Write-Host "FTP Server: $ftpHost"
        Write-Host "Username: $ftpUsername"
    }
}
