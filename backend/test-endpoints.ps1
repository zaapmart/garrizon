$baseUrl = "http://localhost:8080/api"

# 1. Register
Write-Host "Testing Register..."
try {
    $registerBody = @{
        email = "test@example.com"
        password = "password123"
        firstName = "Test"
        lastName = "User"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body $registerBody
    Write-Host "Register Success: $($registerResponse)"
} catch {
    Write-Host "Register Failed: $_"
    # If it failed because user exists, try to login anyway
    if ($_.Exception.Response.StatusCode -eq "Conflict" -or $_.ToString() -match "exists") {
        Write-Host "User likely exists, proceeding to login..."
    }
}

# 2. Login
Write-Host "`nTesting Login..."
try {
    $loginBody = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/login" -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.accessToken
    Write-Host "Login Success. Token received."
} catch {
    Write-Host "Login Failed: $_"
    exit
}

# 3. Protected Route
if ($token) {
    Write-Host "`nTesting Protected Route (Get Current User)..."
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        $userResponse = Invoke-RestMethod -Method Get -Uri "$baseUrl/users/me" -Headers $headers
        Write-Host "Protected Route Success: $($userResponse.email)"
    } catch {
        Write-Host "Protected Route Failed: $_"
    }
}
