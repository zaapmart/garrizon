-- Fix invalid lowercase role values in the 'users' table
-- Java enums are case-sensitive: 'user' != 'USER'

-- 1. Fix lowercase 'user' to uppercase 'USER'
UPDATE users 
SET role = 'USER' 
WHERE role = 'user' OR role = 'User';

-- 2. Fix lowercase 'admin' to uppercase 'ADMIN'
UPDATE users 
SET role = 'ADMIN' 
WHERE role = 'admin' OR role = 'Admin';

-- 3. Explicitly set Admin role for contactkufreakpan@gmail
UPDATE users 
SET role = 'ADMIN', user_role = 'ROLE_ADMIN' 
WHERE email LIKE 'contactkufreakpan@gmail%';
