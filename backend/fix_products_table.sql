-- Fix Products Table
-- Ensures image_url exists for storing product images.

-- 1. Add image_url if missing (Run this, ignore "Duplicate column" error)
ALTER TABLE products ADD COLUMN image_url VARCHAR(500);

-- 2. Modify specific columns if needed (e.g. description length)
ALTER TABLE products MODIFY description TEXT;
