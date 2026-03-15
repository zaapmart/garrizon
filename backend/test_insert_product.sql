-- Test Product Insert
-- Tries to insert a product using ONLY the columns Java expects.
-- This will fail if a required column is missing or named differently.

INSERT INTO products (
    name, 
    slug, 
    description, 
    price, 
    image_url, 
    stock, 
    is_active, 
    category_id, 
    approved_by, 
    created_at, 
    updated_at
) VALUES (
    'SQL Test Product', 
    'sql-test-product', 
    'Testing product creation manually.', 
    100.00, 
    '/media/test.jpg', 
    10, 
    1, 
    NULL, 
    1, 
    NOW(), 
    NOW()
);

-- If FAILS: "Field 'xyz' doesn't have a default value" -> Column exists but is NOT NULL and missing from list.
-- If FAILS: "Unknown column 'xyz'" -> Column missing.
