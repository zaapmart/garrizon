-- Test Insert V2: Using ONLY standard columns
-- This verifies if the table is clean and ready for the backend.

INSERT INTO categories (name, slug, description, image_url, is_active, approved_by, created_at, updated_at)
VALUES (
    'V2 Test Category', 
    'v2-test-category', 
    'Testing insert after dropping legacy columns', 
    'https://example.com/test.jpg', 
    1, 
    1, 
    NOW(), 
    NOW()
);

-- If this FAILS, please report the SQL Error Message (e.g. "Unknown column 'image_url'" or "Field 'xyz' doesn't have default").
