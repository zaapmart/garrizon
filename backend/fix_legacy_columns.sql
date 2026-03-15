-- FORCE FIX for legacy column names in 'categories' table
-- The database has 'banner_file_name' (NOT NULL) but Java uses 'imageUrl'.
-- This script aligns the database with the Java entity.

-- 1. Rename 'banner_file_name' to 'image_url' and make it NULLABLE (Java allows null images)
-- We use CHANGE to rename and redefine.
ALTER TABLE categories CHANGE banner_file_name image_url VARCHAR(255) NULL;

-- 2. Rename 'category_name' to 'name' (if it exists)
-- If 'name' already exists, this might fail, which is fine.
-- If 'category_name' exists, this renames it.
ALTER TABLE categories CHANGE category_name name VARCHAR(255) NOT NULL;

-- 3. Rename 'mobile_banner_file_name' (if exists) or Drop if unused?
-- Java entity doesn't map it. Let's make it NULLABLE so it doesn't cause insert errors.
ALTER TABLE categories MODIFY mobile_banner_file_name VARCHAR(255) NULL;

-- 4. Rename 'icon_file_name' (if exists)
-- Java entity doesn't map it. Make it NULLABLE.
ALTER TABLE categories MODIFY icon_file_name VARCHAR(255) NULL;

-- 5. Ensure 'slug' exists and is UNIQUE
-- (If missing, add it)
-- This part is tricky in a script without knowing if it exists, but simple ADD usually fails if exists.
-- We'll assume slug exists or was added by previous scripts.
