-- Quick check: What's the data type of users.id?
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'royalsee_garrizon' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'id';
