$ftpUrl = "ftp://ftp.royalseeds.net/logs/"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

try {
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    Write-Host "Logs directory contents:"
    Write-Host "------------------------"
    Write-Host $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
}
catch {
    Write-Host "Logs directory not found or accessible: $_"
}
