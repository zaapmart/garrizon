$dbHost = "gldz3.dailyrazor.com"
$dbName = "royalsee_gzon_db"
$dbUser = "royalsee_gzon_user"
$dbPass = "G@rr1z0n+DB+P@55w0rd"
$port = 3306

Write-Host "Testing connection to $dbHost/$dbName as $dbUser..."

try {
    $connStr = "Server=$dbHost;Port=$port;Database=$dbName;Uid=$dbUser;Pwd=$dbPass;AllowPublicKeyRetrieval=True;SslMode=none;"
    # We need a MySQL driver for .NET, but maybe we can just try to open a socket first (already did, worked)
    # Since we have the JAR, we can't easily use it in pure PowerShell without Add-Type
    
    # Let's try to just use the Java test again but capture everything
}
catch {
    Write-Host "Error: $_"
}
