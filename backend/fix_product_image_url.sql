-- Fix Product Image URL Constraint
-- The API creates the product first, then uploads the image. 
-- This means 'image_url' will be NULL during the initial insert.
-- We must ensuring the column allows NULL values.

ALTER TABLE products MODIFY COLUMN image_url VARCHAR(255) NULL;
