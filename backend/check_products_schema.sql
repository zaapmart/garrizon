-- Check Products Table Schema
-- We select all expected columns to see if any are missing or named 
    image_urlincorrectly.
-- If this fails, the error will tell us which column is the problem.

SELECT 
    id, 
    name, 
    slug, 
    description, 
    price, , 
    stock, 
    is_active, 
    approved_by, 
    category_id, 
    created_at, 
    updated_at
FROM products
LIMIT 1;
