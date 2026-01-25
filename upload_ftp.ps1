$ftpUrl = "ftp://ftp.royalseeds.net/ROOT.war"
$user = "kufre@app.garrizon.com"
$pass = "Ilove3lia1986"
$filePath = "backend/target/garrizon-backend-0.0.1-SNAPSHOT.war"

$request = [System.Net.FtpWebRequest]::Create($ftpUrl)
$request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
$request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
$request.UseBinary = $true

try {
    Write-Host "Starting upload of $filePath to $ftpUrl..."
    $fileContent = [System.IO.File]::ReadAllBytes($filePath)
    $request.ContentLength = $fileContent.Length
    $requestStream = $request.GetRequestStream()
    $requestStream.Write($fileContent, 0, $fileContent.Length)
    $requestStream.Close()
    
    $response = $request.GetResponse()
    Write-Host "Upload Complete. Server Response: " $response.StatusDescription
    $response.Close()
}
catch {
    Write-Host "Error uploading file: $_"
}
