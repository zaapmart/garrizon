$ftpUrl = "ftp://ftp.royalseeds.net/"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"

function Remove-FtpDirectory {
    param($path)
    
    try {
        # List directory contents
        $listRequest = [System.Net.FtpWebRequest]::Create("ftp://ftp.royalseeds.net/$path")
        $listRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $listRequest.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        
        $response = $listRequest.GetResponse()
        $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
        $items = $reader.ReadToEnd().Split("`n") | Where-Object { $_ -and $_ -ne "." -and $_ -ne ".." }
        $reader.Close()
        $response.Close()
        
        # Delete each item
        foreach ($item in $items) {
            $item = $item.Trim()
            if ($item) {
                Write-Host "Deleting: $path/$item"
                $deleteRequest = [System.Net.FtpWebRequest]::Create("ftp://ftp.royalseeds.net/$path/$item")
                $deleteRequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
                $deleteRequest.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
                try {
                    $deleteResponse = $deleteRequest.GetResponse()
                    $deleteResponse.Close()
                }
                catch {
                    # Might be a directory, try recursive delete
                    Remove-FtpDirectory "$path/$item"
                }
            }
        }
        
        # Delete the directory itself
        $removeDirRequest = [System.Net.FtpWebRequest]::Create("ftp://ftp.royalseeds.net/$path")
        $removeDirRequest.Method = [System.Net.WebRequestMethods+Ftp]::RemoveDirectory
        $removeDirRequest.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $removeDirResponse = $removeDirRequest.GetResponse()
        $removeDirResponse.Close()
        Write-Host "Removed directory: $path"
    }
    catch {
        Write-Host "Error removing $path : $_"
    }
}

Write-Host "Removing ROOT directory..."
Remove-FtpDirectory "ROOT"
Write-Host "Done! Tomcat should now redeploy ROOT.war"
