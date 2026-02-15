-- Verify user role for contactkufreakpan@gmail.com
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    user_role,
    CASE 
        WHEN role = 'ADMIN' AND user_role = 'ROLE_ADMIN' THEN '✓ ADMIN ROLE CORRECT'
        ELSE '✗ ROLE NOT SET CORRECTLY'
    END as status
FROM users 
WHERE email = 'contactkufreakpan@gmail.com';

-- If the role is not ADMIN, run this:
-- UPDATE users SET role = 'ADMIN', user_role = 'ROLE_ADMIN' WHERE email = 'contactkufreakpan@gmail.com';
