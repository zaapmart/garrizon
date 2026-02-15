-- First, let's check the current structure
DESCRIBE users;

-- If role is not ENUM, run this to fix it:
-- ALTER TABLE users MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- Update user role to ADMIN for contactkufreakpan@gmail.com
UPDATE users 
SET role = 'ADMIN', 
    user_role = 'ROLE_ADMIN'
WHERE email = 'contactkufreakpan@gmail.com';

-- Verify the update
SELECT id, email, first_name, last_name, role, user_role 
FROM users 
WHERE email = 'contactkufreakpan@gmail.com';
