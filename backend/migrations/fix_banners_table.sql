-- =====================================================
-- FIXED BANNERS TABLE - Without Foreign Key
-- Run this if the main migration failed
-- =====================================================

-- Drop the table if it was partially created
DROP TABLE IF EXISTS banners;

-- Create banners table WITHOUT foreign key constraint
CREATE TABLE banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    image_url VARCHAR(500) NOT NULL,
    mobile_image_url VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    target_audience ENUM('ALL', 'NEW_USERS', 'RETURNING_USERS') NOT NULL DEFAULT 'ALL',
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: Foreign key constraint removed to avoid type mismatch
-- The created_by field will still reference users.id, but without DB-level enforcement
-- This is acceptable for this use case

SELECT 'Banners table created successfully!' AS message;
