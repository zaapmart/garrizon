$ftpUrl = "ftp://ftp.royalseeds.net/ROOT"
$renameTo = "ROOT_old_" + (Get-Date -Format "yyyyMMdd_HHmmss")
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::Rename
$request.RenameTo = $renameTo
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

try {
    $response = $request.GetResponse()
    Write-Host "Renamed ROOT to $renameTo successfully."
    Write-Host "Tomcat will now redeploy ROOT.war automatically."
    $response.Close()
}
catch {
    Write-Host "Rename failed: $_"
}
