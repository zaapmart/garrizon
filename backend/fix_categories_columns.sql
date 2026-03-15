-- Fix mismatched column names in categories table
-- The database has 'category_name' but Java entity expects 'name'.
-- This script renames 'category_name' to 'name' and ensures 'slug' exists.

-- 1. Rename category_name to name
-- NOTE: If 'name' already exists, this might fail or be redundant.
-- We try to CHANGE it. If 'category_name' doesn't exist, this fails (ignore if already fixed).
ALTER TABLE categories CHANGE category_name name VARCHAR(255) NOT NULL;

-- 2. Ensure slug column exists (Required by Java entity)
-- Using simple ADD COLUMN. If it exists, ignore "Duplicate column" error.
ALTER TABLE categories ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE;

-- 3. Ensure description matches type
ALTER TABLE categories MODIFY description VARCHAR(1000);
