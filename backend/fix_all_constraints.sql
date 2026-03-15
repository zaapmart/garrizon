-- Fix All Potential Product Creation Constraints

-- 1. Ensure 'image_url' is nullable (since image is uploaded later)
ALTER TABLE products MODIFY COLUMN image_url VARCHAR(255) NULL;

-- 2. Ensure an Admin User (ID 1) exists for 'approved_by' reference
INSERT INTO users (id, email, password, role, first_name, created_at, updated_at)
SELECT 1, 'admin@garrizon.com', '$2a$10$rCWCg/E0m.b/F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'ADMIN', 'Admin User', NOW(), NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);

-- 3. Ensure a Default Category (ID 1) exists
INSERT INTO categories (id, name, slug, description, is_active, approved_by, created_at, updated_at)
SELECT 1, 'Default Category', 'default-category', 'Fallback category', 1, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 1);

-- 4. Ensure 'cost_price' has a default (if not already set)
ALTER TABLE products MODIFY COLUMN cost_price DECIMAL(10,2) DEFAULT 0.00;

-- 5. Ensure 'approved_by' column exists and defaults (if needed)
-- Note: If column exists, this just reinforces the default.
ALTER TABLE products MODIFY COLUMN approved_by BIGINT NOT NULL DEFAULT 1;
