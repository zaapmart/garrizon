$ftpUrl = "ftp://ftp.royalseeds.net/"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

try {
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    $content = $reader.ReadToEnd()
    
    Write-Host "Successfully connected to FTP."
    Write-Host "Directory Listing:"
    Write-Host "------------------"
    Write-Host $content
    Write-Host "------------------"
    
    $reader.Close()
    $response.Close()
}
catch {
    Write-Host "Error connecting to FTP: $_"
}
