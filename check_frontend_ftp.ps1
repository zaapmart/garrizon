$ftpUrl = "ftp://ftp.royalseeds.net/"
$user = "kufre@garrizon.com"
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
    Write-Host "Successfully connected to Frontend FTP."
    Write-Host "Directory Listing:"
    Write-Host $content
}
catch {
    Write-Host "Error connecting to FTP: $_"
}
