-- CLEANUP script for legacy date columns
-- The table 'categories' still has 'date_added' which is NOT NULL and blocking inserts.
-- Java uses 'created_at' and 'updated_at'.

-- 1. Drop 'date_added' if it exists
ALTER TABLE categories DROP COLUMN date_added;

-- 2. Drop 'last_modified' if it exists (legacy counterpart to updated_at)
ALTER TABLE categories DROP COLUMN last_modified;

-- 3. Verify 'created_at' exists (if not, add it)
-- If this fails because it exists, that's good.
-- If it runs, it adds the column.
-- We use ADD COLUMN IF NOT EXISTS (MySQL 8.0+)
-- But preventing error, we can try robust approach:
-- Just run the drops first.
