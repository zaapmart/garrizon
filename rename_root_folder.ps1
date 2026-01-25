$ftpUrl = "ftp://ftp.royalseeds.net/ROOT"
$renameTo = "ROOT_backup"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::Rename
$request.RenameTo = $renameTo
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

try {
    $response = $request.GetResponse()
    Write-Host "Renamed ROOT to ROOT_backup successfully."
    $response.Close()
}
catch {
    Write-Host "Rename failed (might be locked or not exist): $_"
}
