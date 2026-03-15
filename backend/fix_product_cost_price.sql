-- Fix Product Cost Price Constraint
-- The 'cost_price' column is causing insert failures because it has no default value and is not null.
-- We fix this by setting a default value of 0.00, allowing the application to ignore this column if it's not ready to use it yet.

ALTER TABLE products MODIFY COLUMN cost_price DECIMAL(10,2) DEFAULT 0.00;
