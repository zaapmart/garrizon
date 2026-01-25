$ftpUrl = "ftp://ftp.royalseeds.net/ROOT.war"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"
$localFile = "c:\Users\DELL\Desktop\garrizon\backend\target\garrizon-backend-0.0.1-SNAPSHOT.war"

if (-not (Test-Path $localFile)) {
    Write-Host "Error: Local file not found: $localFile"
    exit 1
}

Write-Host "Uploading $localFile to $ftpUrl..."
try {
    $webclient = New-Object System.Net.WebClient
    $webclient.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
    $webclient.UploadFile($ftpUrl, "STOR", $localFile)
    Write-Host "Upload complete successfully."
}
catch {
    Write-Host "Upload failed: $_"
    exit 1
}
