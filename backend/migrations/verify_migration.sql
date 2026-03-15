-- Verify all tables were created successfully
SELECT 
    TABLE_NAME, 
    TABLE_ROWS,
    CREATE_TIME,
    ENGINE
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'royalsee_garrizon'
AND TABLE_NAME IN ('orders', 'order_items', 'transactions', 'banners')
ORDER BY TABLE_NAME;

-- Check structure of each table
SELECT 'ORDERS TABLE STRUCTURE' AS info;
DESCRIBE orders;

SELECT 'ORDER_ITEMS TABLE STRUCTURE' AS info;
DESCRIBE order_items;

SELECT 'TRANSACTIONS TABLE STRUCTURE' AS info;
DESCRIBE transactions;

SELECT 'BANNERS TABLE STRUCTURE' AS info;
DESCRIBE banners;
