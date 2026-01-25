# WinSCP Command-Line Script
# This script uses WinSCP's command-line interface (winscp.com)
# Make sure WinSCP is installed and winscp.com is in your PATH

param(
    [string]$Action = "open",
    [string]$LocalPath = ".",
    [string]$RemotePath = "/"
)

$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"
if (-not (Test-Path $winscpPath)) {
    $winscpPath = "C:\Program Files\WinSCP\WinSCP.com"
}

if (-not (Test-Path $winscpPath)) {
    Write-Host "WinSCP not found. Please install WinSCP or update the path in this script." -ForegroundColor Red
    Write-Host "Download from: https://winscp.net/eng/download.php" -ForegroundColor Yellow
    exit 1
}

$ftpHost = "ftp.royalseeds.net"
$ftpPort = 21
$ftpUsername = "kufre@app.garrizon.com"
$ftpPassword = "Ilove3lia1986"

$scriptFile = Join-Path $env:TEMP "winscp_script_$(Get-Date -Format 'yyyyMMddHHmmss').txt"

switch ($Action.ToLower()) {
    "open" {
        # Create a script to open session
        @"
option batch abort
option confirm off
open ftp://$ftpUsername`:$ftpPassword@$ftpHost`:$ftpPort
cd $RemotePath
ls
exit
"@ | Out-File -FilePath $scriptFile -Encoding ASCII
        
        Write-Host "Opening FTP connection and listing directory..." -ForegroundColor Cyan
        & $winscpPath /script=$scriptFile /log=(Join-Path $env:TEMP "winscp_log.txt")
    }
    
    "upload" {
        if (-not (Test-Path $LocalPath)) {
            Write-Host "Local path not found: $LocalPath" -ForegroundColor Red
            exit 1
        }
        
        # Create upload script
        $fileName = Split-Path $LocalPath -Leaf
        @"
option batch abort
option confirm off
open ftp://$ftpUsername`:$ftpPassword@$ftpHost`:$ftpPort
cd $RemotePath
put "$LocalPath" "$fileName"
exit
"@ | Out-File -FilePath $scriptFile -Encoding ASCII
        
        Write-Host "Uploading $LocalPath to $RemotePath..." -ForegroundColor Cyan
        & $winscpPath /script=$scriptFile /log=(Join-Path $env:TEMP "winscp_log.txt")
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Upload successful!" -ForegroundColor Green
        } else {
            Write-Host "✗ Upload failed. Check log: $env:TEMP\winscp_log.txt" -ForegroundColor Red
        }
    }
    
    "download" {
        # Create download script
        $fileName = Split-Path $RemotePath -Leaf
        @"
option batch abort
option confirm off
open ftp://$ftpUsername`:$ftpPassword@$ftpHost`:$ftpPort
get "$RemotePath" "$LocalPath"
exit
"@ | Out-File -FilePath $scriptFile -Encoding ASCII
        
        Write-Host "Downloading $RemotePath to $LocalPath..." -ForegroundColor Cyan
        & $winscpPath /script=$scriptFile /log=(Join-Path $env:TEMP "winscp_log.txt")
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Download successful!" -ForegroundColor Green
        } else {
            Write-Host "✗ Download failed. Check log: $env:TEMP\winscp_log.txt" -ForegroundColor Red
        }
    }
    
    "sync" {
        # Sync local directory to remote
        @"
option batch abort
option confirm off
open ftp://$ftpUsername`:$ftpPassword@$ftpHost`:$ftpPort
synchronize remote "$LocalPath" "$RemotePath"
exit
"@ | Out-File -FilePath $scriptFile -Encoding ASCII
        
        Write-Host "Synchronizing $LocalPath to $RemotePath..." -ForegroundColor Cyan
        & $winscpPath /script=$scriptFile /log=(Join-Path $env:TEMP "winscp_log.txt")
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Synchronization successful!" -ForegroundColor Green
        } else {
            Write-Host "✗ Synchronization failed. Check log: $env:TEMP\winscp_log.txt" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "Usage: .\winscp-commandline.ps1 [open|upload|download|sync]"
        Write-Host ""
        Write-Host "Actions:"
        Write-Host "  open     - Connect and list remote directory"
        Write-Host "  upload   - Upload a file (requires -LocalPath and -RemotePath)"
        Write-Host "  download - Download a file (requires -LocalPath and -RemotePath)"
        Write-Host "  sync     - Sync directory (requires -LocalPath and -RemotePath)"
        Write-Host ""
        Write-Host "Examples:"
        Write-Host "  .\winscp-commandline.ps1 open"
        Write-Host "  .\winscp-commandline.ps1 upload -LocalPath '.\dist' -RemotePath '/public_html'"
        Write-Host "  .\winscp-commandline.ps1 sync -LocalPath '.\frontend\dist' -RemotePath '/public_html'"
    }
}

# Cleanup
if (Test-Path $scriptFile) {
    Start-Sleep -Seconds 2
    Remove-Item $scriptFile -ErrorAction SilentlyContinue
}
