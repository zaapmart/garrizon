-- Ensure image_url is Nullable to allow creating categories without banners
ALTER TABLE categories MODIFY image_url VARCHAR(255) NULL;

-- Also verify parent_id is Nullable (for root categories)
ALTER TABLE categories MODIFY parent_id BIGINT NULL;
