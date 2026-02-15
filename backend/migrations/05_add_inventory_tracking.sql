-- =====================================================
-- Migration: Add Inventory Tracking to Products
-- Description: Adds inventory tracking fields to products table
-- =====================================================

-- Add inventory tracking columns if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS low_stock_threshold INT NOT NULL DEFAULT 10 AFTER stock,
ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE AFTER slug,
ADD COLUMN IF NOT EXISTS barcode VARCHAR(100) AFTER sku,
ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2) COMMENT 'Weight in kg' AFTER barcode,
ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100) COMMENT 'L x W x H in cm' AFTER weight;

-- Add index for low stock alerts
ALTER TABLE products
ADD INDEX IF NOT EXISTS idx_low_stock (stock, low_stock_threshold, is_active);
