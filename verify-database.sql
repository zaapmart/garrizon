-- Database Verification and Setup Script for Garrizon
-- Run these commands to verify and fix database permissions

-- 1. Verify the database exists
SHOW DATABASES LIKE 'royalsee_garrizon';

-- 2. Verify the user exists and check permissions
SELECT User, Host FROM mysql.user WHERE User = 'royalsee_gzon_user';

-- 3. Show current grants for the user
SHOW GRANTS FOR 'royalsee_gzon_user'@'%';
SHOW GRANTS FOR 'royalsee_gzon_user'@'gldz3.dailyrazor.com';
SHOW GRANTS FOR 'royalsee_gzon_user'@'localhost';

-- 4. If the user doesn't have proper permissions, run these (as root/admin):
-- Note: Replace 'password_here' with the actual password

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON royalsee_garrizon.* TO 'royalsee_gzon_user'@'%' IDENTIFIED BY 'G@rr1z0n+DB+P@55w0rd';
GRANT ALL PRIVILEGES ON royalsee_garrizon.* TO 'royalsee_gzon_user'@'gldz3.dailyrazor.com' IDENTIFIED BY 'G@rr1z0n+DB+P@55w0rd';
GRANT ALL PRIVILEGES ON royalsee_garrizon.* TO 'royalsee_gzon_user'@'localhost' IDENTIFIED BY 'G@rr1z0n+DB+P@55w0rd';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- 5. Verify the database has tables
USE royalsee_garrizon;
SHOW TABLES;

-- 6. Test a simple query
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'royalsee_garrizon';

-- 7. Check if the database is accessible
SELECT 
    SCHEMA_NAME as database_name,
    DEFAULT_CHARACTER_SET_NAME as charset,
    DEFAULT_COLLATION_NAME as collation
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'royalsee_garrizon';
