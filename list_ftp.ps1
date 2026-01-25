$ftpUrl = "ftp://ftp.royalseeds.net/"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

try {
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    $content = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    $content | Out-File -FilePath "ftp_listing.txt" -Encoding UTF8
    Write-Host "Listing saved."
}
catch {
    Write-Host "Error: $_"
}
