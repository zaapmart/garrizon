@echo off
echo Updating user role to ADMIN...
echo.

REM Database connection details
set DB_HOST=gldz3.dailyrazor.com
set DB_PORT=3306
set DB_NAME=royalsee_garrizon
set DB_USER=royalsee_gzon_user
set DB_PASS=G@rr1z0n+DB+P@55w0rd
set TARGET_EMAIL=contactkufreakpan@gmail.com

REM SQL command
set SQL_COMMAND=UPDATE users SET role = 'ADMIN', user_role = 'ROLE_ADMIN' WHERE email = '%TARGET_EMAIL%'; SELECT id, email, first_name, last_name, role, user_role FROM users WHERE email = '%TARGET_EMAIL%';

echo Connecting to database: %DB_NAME%@%DB_HOST%
echo Target user: %TARGET_EMAIL%
echo.

REM Execute SQL using mysql command line (if available)
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "%SQL_COMMAND%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ User role updated successfully!
) else (
    echo.
    echo ❌ Failed to update user role. Please run the SQL manually.
    echo.
    echo SQL to run:
    echo UPDATE users SET role = 'ADMIN', user_role = 'ROLE_ADMIN' WHERE email = '%TARGET_EMAIL%';
)

pause
