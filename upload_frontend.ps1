$ftpHost = "ftp://ftp.royalseeds.net"
$user = "kufre@garrizon.com"
$pass = "Ilove3lia1986"
$localDir = "frontend/dist"

function Upload-FtpDirectory($localPath, $remotePath) {
    $files = Get-ChildItem -Path $localPath

    foreach ($file in $files) {
        $remoteFilePath = "$remotePath/$($file.Name)"
        $credentials = New-Object System.Net.NetworkCredential($user, $pass)

        if ($file.Attributes -band [System.IO.FileAttributes]::Directory) {
            # Create Directory
            try {
                $makeDirReq = [System.Net.FtpWebRequest]::Create("$ftpHost$remoteFilePath")
                $makeDirReq.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
                $makeDirReq.Credentials = $credentials
                $makeDirReq.GetResponse().Close()
                Write-Host "Created directory: $remoteFilePath"
            }
            catch {
                # Ignore if directory already exists
                $err = $_.Exception.InnerException.Response.StatusDescription
                if ($err -notmatch "550") { Write-Host "Checking directory $remoteFilePath..." }
            }
            # Recurse
            Upload-FtpDirectory $file.FullName $remoteFilePath
        }
        else {
            # Upload File
            Write-Host "Uploading $($file.Name) to $remoteFilePath..."
            $uploadReq = [System.Net.FtpWebRequest]::Create("$ftpHost$remoteFilePath")
            $uploadReq.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
            $uploadReq.Credentials = $credentials
            $uploadReq.UseBinary = $true
            
            $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
            $uploadReq.ContentLength = $fileContent.Length
            $stream = $uploadReq.GetRequestStream()
            $stream.Write($fileContent, 0, $fileContent.Length)
            $stream.Close()
            $uploadReq.GetResponse().Close()
        }
    }
}

try {
    Write-Host "Starting Frontend Upload..."
    Upload-FtpDirectory (Resolve-Path $localDir) ""
    Write-Host "Frontend Upload Complete!"
}
catch {
    Write-Host "Error: $_"
}
