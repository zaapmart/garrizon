# Garrizon Deployment Fix - Action Plan

## Problem Summary

Your Spring Boot application is failing to deploy on Tomcat with two main
issues:

1. **Database Connection Failure**: Access denied for user 'royalsee_gzon_user'
2. **Corrupted WAR File** (first attempt): ZIP file corruption

## Immediate Actions Required

### Action 1: Fix Database Connection (CRITICAL) ⚠️

The error shows:

```
java.sql.SQLException: Access denied for user 'royalsee_gzon_user'@'gldz3.dailyrazor.com' (using password: YES)
```

**You mentioned DBeaver works**, which means the credentials are correct but
there might be a host permission issue.

#### Steps to Fix:

1. **Connect to your MySQL database using DBeaver** (since you confirmed it
   works)

2. **Run these SQL commands** to check and fix permissions:

```sql
-- Check current user permissions
SHOW GRANTS FOR 'royalsee_gzon_user'@'%';
SHOW GRANTS FOR 'royalsee_gzon_user'@'gldz3.dailyrazor.com';

-- If permissions are missing, grant them (you may need admin access):
GRANT ALL PRIVILEGES ON royalsee_garrizon.* TO 'royalsee_gzon_user'@'%';
GRANT ALL PRIVILEGES ON royalsee_garrizon.* TO 'royalsee_gzon_user'@'gldz3.dailyrazor.com';
FLUSH PRIVILEGES;
```

3. **Contact your hosting provider** (royalseeds.net) and ask them to:
   - Verify that user `royalsee_gzon_user` can connect from the Tomcat server's
     IP address
   - Ensure the user has ALL PRIVILEGES on database `royalsee_garrizon`
   - Check if there are any firewall rules blocking the connection

### Action 2: Rebuild and Redeploy WAR File

The first deployment showed a corrupted WAR file. Let's rebuild it properly:

#### Steps:

1. **Clean and rebuild the backend:**

```powershell
cd backend
.\mvnw.cmd clean
.\mvnw.cmd package -DskipTests
cd ..
```

2. **Verify the WAR file is valid:**

```powershell
# Check file size (should be several MB)
Get-Item backend\target\garrizon-backend-0.0.1-SNAPSHOT.war | Select-Object Name, Length

# The file should be at least 30-50 MB
```

3. **Deploy using binary mode:**

```powershell
# Use the deployment script with only backend
.\deploy-production.ps1 -SkipFrontend
```

### Action 3: Verify Application Configuration

Check if your application.yml is being packaged correctly:

```powershell
# Extract and verify the WAR contents
cd backend\target
jar -xf garrizon-backend-0.0.1-SNAPSHOT.war WEB-INF/classes/application.yml
type WEB-INF\classes\application.yml
```

Make sure the database credentials are correct in the extracted file.

## Alternative: Use Environment Variables (Recommended)

Instead of hardcoding credentials, use environment variables on the server:

### 1. Create a setenv.sh file on your Tomcat server:

```bash
# Location: /home/royalsee/tomcat/bin/setenv.sh

export SPRING_DATASOURCE_URL="jdbc:mysql://gldz3.dailyrazor.com:3306/royalsee_garrizon?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="royalsee_gzon_user"
export SPRING_DATASOURCE_PASSWORD="G@rr1z0n+DB+P@55w0rd"
export SPRING_PROFILES_ACTIVE="prod"
```

### 2. Make it executable:

```bash
chmod +x /home/royalsee/tomcat/bin/setenv.sh
```

### 3. Restart Tomcat:

```bash
/home/royalsee/tomcat/bin/shutdown.sh
/home/royalsee/tomcat/bin/startup.sh
```

## Troubleshooting Checklist

- [ ] Database user has proper permissions
- [ ] Database user can connect from Tomcat server IP
- [ ] WAR file is not corrupted (check file size)
- [ ] WAR file uploaded in binary mode
- [ ] application.yml has correct credentials
- [ ] Tomcat has enough memory (check catalina.out)
- [ ] No firewall blocking MySQL port 3306
- [ ] MySQL server allows remote connections

## Quick Test Commands

### Test database connection from command line:

```bash
# On the server
mysql -h gldz3.dailyrazor.com -P 3306 -u royalsee_gzon_user -p royalsee_garrizon
# Enter password when prompted: G@rr1z0n+DB+P@55w0rd
```

### Check Tomcat logs:

```bash
tail -f /home/royalsee/tomcat/logs/catalina.out
```

### Verify WAR deployment:

```bash
ls -lh /home/royalsee/tomcat/webapps/app.garrizon.com/
```

## Most Likely Solution

Based on the error "Access denied for user
'royalsee_gzon_user'@'gldz3.dailyrazor.com'", the issue is that:

1. **The MySQL user is configured to only allow connections from specific
   hosts**
2. **Your Tomcat server's hostname/IP is not in the allowed list**

**Contact your hosting provider and ask them to:**

- Add the Tomcat server's IP address to the allowed hosts for
  `royalsee_gzon_user`
- OR change the user to allow connections from any host
  (`'royalsee_gzon_user'@'%'`)

## Need Help?

If you're still stuck after trying these steps:

1. Share the output of: `SHOW GRANTS FOR 'royalsee_gzon_user'@'%';` from DBeaver
2. Share the Tomcat server's IP address
3. Share the latest catalina.out logs after redeployment
4. Confirm the WAR file size after rebuild

---

**Next Steps:**

1. Fix database permissions (contact hosting provider)
2. Rebuild WAR file
3. Redeploy
4. Monitor logs
