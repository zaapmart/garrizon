-- =====================================================
-- Migration: Create Banners Table
-- Description: Creates the banners table for homepage promotional banners
-- =====================================================

CREATE TABLE IF NOT EXISTS banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Banner content
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    
    -- Call to action
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    
    -- Image
    image_url VARCHAR(500) NOT NULL,
    mobile_image_url VARCHAR(500),
    
    -- Display settings
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Scheduling
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    
    -- Target audience
    target_audience ENUM('ALL', 'NEW_USERS', 'RETURNING_USERS') NOT NULL DEFAULT 'ALL',
    
    -- Metadata
    created_by BIGINT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
