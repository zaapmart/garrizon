-- Simplified Fix for Categories Table
-- Run these lines one by one. If a column already exists, the database will return an error like "Duplicate column name", which you can safely ignore.

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

-- 2. Add columns if missing (Run these only if step 1 didn't create the table)
-- If you get "Duplicate column name", just move to the next line.

ALTER TABLE categories ADD COLUMN approved_by BIGINT NOT NULL DEFAULT 1;

ALTER TABLE categories ADD COLUMN image_url VARCHAR(255);

ALTER TABLE categories ADD COLUMN parent_id BIGINT;
ALTER TABLE categories ADD CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES categories(id);

ALTER TABLE categories ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
