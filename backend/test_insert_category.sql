-- Test inserting a category manually to verify table constraints
-- Run this in DBeaver.

INSERT INTO categories (name, slug, description, image_url, approved_by, parent_id, is_active, created_at, updated_at)
VALUES (
    'SQL Test Category', 
    'sql-test-category', 
    'This is a test category inserted via SQL', 
    NULL, 
    1, 
    NULL, 
    1, 
    NOW(), 
    NOW()
);

-- If this fails, DBeaver will tell you EXACTLY why (e.g. "Field 'xyz' doesn't have a default value")
