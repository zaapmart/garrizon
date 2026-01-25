$ftpUrl = "ftp://ftp.royalseeds.net/webapps/"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

try {
    $response = $request.GetResponse()
    Write-Host "Found webapps directory!"
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    Write-Host $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
}
catch {
    Write-Host "webapps directory not found in root: $_"
}
