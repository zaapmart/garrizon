-- Cleanup legacy columns that are duplicates or unused
-- These columns have NOT NULL constraints that break correct inserts.
-- Since 'image_url' and 'name' already exist (confirmed by previous errors), we can safely drop or relax these.

-- 1. Drop confirmd legacy columns if they exist
-- If they don't exist, these lines will fail (which is good). 
-- Run them one by one if needed.

ALTER TABLE categories DROP COLUMN banner_file_name;

ALTER TABLE categories DROP COLUMN mobile_banner_file_name;

ALTER TABLE categories DROP COLUMN icon_file_name;

-- 2. Drop 'category_name' (since 'name' exists)
ALTER TABLE categories DROP COLUMN category_name;

-- 3. Drop 'category_id' (since 'id' exists)
ALTER TABLE categories DROP COLUMN category_id;
