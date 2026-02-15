-- Migration: Add ENUM constraint to role column
-- This script will modify the users table to use ENUM for the role column

-- Step 1: Check current role values
SELECT DISTINCT role FROM users;

-- Step 2: Alter the role column to use ENUM
ALTER TABLE users 
MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- Step 3: Verify the change
DESCRIBE users;

-- Step 4: Now update the specific user to ADMIN
UPDATE users 
SET role = 'ADMIN', 
    user_role = 'ROLE_ADMIN'
WHERE email = 'contactkufreakpan@gmail.com';

-- Step 5: Verify the update
SELECT id, email, first_name, last_name, role, user_role 
FROM users 
WHERE email = 'contactkufreakpan@gmail.com';
