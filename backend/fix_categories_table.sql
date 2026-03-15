-- Fix categories table schema
-- Ensure all columns required by Category.java exist

-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    image_url VARCHAR(255),
    approved_by BIGINT NOT NULL DEFAULT 1,
    parent_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Add missing columns to existing table (idempotent)
-- These commands utilize MySQL specific syntax to check for existence
SET @dbname = DATABASE();
SET @tablename = 'categories';

-- Add approved_by if missing
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'approved_by');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE categories ADD COLUMN approved_by BIGINT NOT NULL DEFAULT 1', 'SELECT "Column approved_by exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add image_url if missing
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'image_url');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE categories ADD COLUMN image_url VARCHAR(255)', 'SELECT "Column image_url exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add parent_id if missing
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'parent_id');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE categories ADD COLUMN parent_id BIGINT', 'SELECT "Column parent_id exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add is_active if missing
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'is_active');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE categories ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE', 'SELECT "Column is_active exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
