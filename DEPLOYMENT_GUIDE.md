# Production Deployment Guide

## Issue Fixed

The CORS error was caused by:
1. **Backend CORS**: Didn't allow requests from `https://garrizon.com`
2. **Frontend API URL**: Still configured to use `localhost:8080` in production

## Solution

### 1. Backend CORS (✅ Fixed)
- Added `https://garrizon.com` and `https://www.garrizon.com` to allowed origins in `SecurityConfig.java`
- Backend now accepts requests from your production domain

### 2. Frontend API URL (⚠️ Needs Rebuild)
- Frontend needs to be rebuilt with production environment variable
- Production API URL: `https://garrizon.com/api`

## Deployment Steps

### Step 1: Rebuild Frontend with Production API URL

```powershell
cd frontend

# Create or update .env.production
echo "VITE_API_URL=https://garrizon.com/api" > .env.production

# Install dependencies (if needed)
npm ci

# Build for production
npm run build
```

This will create a `dist` folder with the production build that uses `https://garrizon.com/api` for API calls.

### Step 2: Rebuild Backend

```powershell
cd backend

# Build WAR file
.\mvnw.cmd clean package -DskipTests
```

This creates `target/garrizon-backend-0.0.1-SNAPSHOT.war` with updated CORS configuration.

### Step 3: Deploy to Server

Use the deployment script or manually upload via FTP:

```powershell
# Using the deployment script
.\deploy-production.ps1

# Or manually upload:
# - Frontend: Upload contents of frontend/dist to /public_html
# - Backend: Upload backend/target/garrizon-backend-0.0.1-SNAPSHOT.war to /ROOT as ROOT.war
```

## Important Notes

1. **API URL**: Make sure your production backend is accessible at `https://garrizon.com/api`
   - If your backend is on a different URL (e.g., `api.garrizon.com`), update `.env.production` accordingly

2. **Backend Deployment**: The WAR file will be automatically deployed by your Tomcat/server
   - Upload to `/ROOT/ROOT.war` on the FTP server
   - The server will unpack and deploy it

3. **Database**: Ensure your production database is configured correctly
   - Update `application.yml` or use environment variables for production database credentials

## Quick Deployment Command

```powershell
# Build and deploy everything
.\deploy-production.ps1
```

This will:
1. Build frontend with production settings
2. Build backend WAR file
3. Upload frontend to `/public_html`
4. Upload backend WAR to `/ROOT`

## Verification

After deployment, verify:
1. Frontend loads at: `https://garrizon.com`
2. Backend API works at: `https://garrizon.com/api`
3. Registration works without CORS errors
4. Login works correctly
