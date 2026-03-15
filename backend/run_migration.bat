@echo off
echo ========================================
echo  Database Migration Runner
echo ========================================
echo.

REM Set database credentials
set DB_HOST=gldz3.dailyrazor.com
set DB_PORT=3306
set DB_NAME=royalsee_garrizon
set DB_USER=royalsee_gzon_user
set DB_PASS=G@rr1z0n+DB+P@55w0rd

echo Connecting to: %DB_HOST%:%DB_PORT%/%DB_NAME%
echo.

REM Check if mysql client is available
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL client not found in PATH
    echo.
    echo Please install MySQL client or use DBeaver/phpMyAdmin to run:
    echo   backend\migrations\SIMPLE_MIGRATION.sql
    echo.
    pause
    exit /b 1
)

echo Running migration...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% < migrations\SIMPLE_MIGRATION.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Migration completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo  Migration failed!
    echo ========================================
    echo.
    echo Please run manually using DBeaver or phpMyAdmin:
    echo   backend\migrations\SIMPLE_MIGRATION.sql
)

echo.
pause
