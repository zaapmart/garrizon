# Deployment Guide - FTP Server

This guide explains how to deploy the Garrizon project to the FTP server.

## FTP Server Details

- **Host**: ftp.royalseeds.net
- **Port**: 21
- **Protocol**: FTP
- **Username**: kufre@app.garrizon.com
- **Password**: Ilove3lia1986

## Connection Methods

### Method 1: WinSCP GUI (Recommended for Beginners)

1. **Download WinSCP** (if not installed):
   - Download from: https://winscp.net/eng/download.php
   - Install the application

2. **Create New Session**:
   - Open WinSCP
   - Click "New Session"
   - Enter the following details:
     - **File protocol**: FTP
     - **Host name**: ftp.royalseeds.net
     - **Port number**: 21
     - **User name**: kufre@app.garrizon.com
     - **Password**: Ilove3lia1986
   - Click "Save" to save the session
   - Click "Login" to connect

3. **Upload Files**:
   - Navigate to the local directory (left pane)
   - Navigate to the remote directory (right pane)
   - Drag and drop files or use the Upload button

### Method 2: PowerShell Script (Native FTP)

Use the provided PowerShell script to connect and manage files:

```powershell
# Test connection
.\connect-ftp.ps1 connect

# List remote directory
.\connect-ftp.ps1 list

# Upload a file (edit script to add upload function)
.\connect-ftp.ps1 upload -LocalFile "path\to\file" -RemotePath "/"
```

### Method 3: WinSCP Command-Line (Automated)

Use WinSCP's command-line interface for automation:

```powershell
# Connect and list directory
.\winscp-commandline.ps1 open

# Upload a file
.\winscp-commandline.ps1 upload -LocalPath ".\dist\index.html" -RemotePath "/public_html"

# Download a file
.\winscp-commandline.ps1 download -RemotePath "/public_html/index.html" -LocalPath ".\downloads\"

# Sync entire directory (for frontend deployment)
.\winscp-commandline.ps1 sync -LocalPath ".\frontend\dist" -RemotePath "/public_html"
```

## Deployment Steps

### Frontend Deployment

1. **Build the frontend**:
   ```powershell
   cd frontend
   npm install
   npm run build
   ```
   This creates the `dist` folder with production-ready files.

2. **Upload to server**:
   ```powershell
   # Using WinSCP GUI: Upload the entire dist folder contents
   # Or using command-line:
   cd ..
   .\winscp-commandline.ps1 sync -LocalPath ".\frontend\dist" -RemotePath "/public_html"
   ```

### Backend Deployment

The backend typically requires a Java application server. You may need to:

1. **Build the WAR file**:
   ```powershell
   cd backend
   .\mvnw clean package -DskipTests
   ```

2. **Upload the WAR file**:
   - Upload `target/garrizon-backend-0.0.1-SNAPSHOT.war` to the appropriate directory
   - Your hosting provider should have instructions for deploying Java applications

3. **Configuration**:
   - You may need to upload or configure `application.yml` with production settings
   - Set environment variables on your hosting platform

## Important Notes

⚠️ **Security**:
- The password is stored in plain text in these scripts
- For production, consider using environment variables or secure credential storage
- Never commit passwords to version control

⚠️ **FTP vs SFTP**:
- Port 21 is standard FTP (not encrypted)
- If your server supports SFTP (port 22), it's more secure
- Check with your hosting provider about SFTP/FTPS support

⚠️ **File Permissions**:
- Make sure uploaded files have correct permissions
- Typically: 644 for files, 755 for directories

## Troubleshooting

### Connection Issues

1. **Check firewall**: Make sure port 21 is not blocked
2. **Verify credentials**: Double-check username and password
3. **Passive mode**: Try enabling/disabling passive mode in WinSCP

### Upload Issues

1. **File permissions**: Ensure you have write permissions on the server
2. **Path issues**: Verify the remote directory path exists
3. **File size**: Check if there are file size limits

### Script Issues

1. **Execution policy**: If scripts don't run, execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **WinSCP path**: Update the path in `winscp-commandline.ps1` if WinSCP is installed elsewhere

## Support

For server-specific deployment instructions, contact your hosting provider (Royal Seeds).
