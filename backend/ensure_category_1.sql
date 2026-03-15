-- Ensure Category ID 1 exists
-- This script creates a 'Default Category' with ID 1 if it doesn't default exist.
-- This ensures our test scripts and default logic work correctly.

INSERT INTO categories (id, name, slug, description, is_active, approved_by, created_at, updated_at)
SELECT 1, 'Default Category', 'default-category', 'Fallback category', 1, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 1);
