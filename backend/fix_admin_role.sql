-- Fix admin role for contactkufreakpan@gmail
-- The application uses the 'role' column (Enum) for permissions, not just 'user_role' (String).
-- Your manual update only changed 'user_role', leaving 'role' as 'USER'.
-- This script updates BOTH to ensure Admin access.

UPDATE users 
SET role = 'ADMIN', user_role = 'ROLE_ADMIN' 
WHERE email LIKE 'contactkufreakpan@gmail%';
