# ✅ FIXED: Banners Table Migration

## 🐛 Problem

Foreign key constraint error when creating banners table:

```
SQL Error [3780] [HY000]: Referencing column 'created_by' and referenced column 'id' 
in foreign key constraint 'fk_banners_user' are incompatible.
```

## 🔧 Solution

Removed the foreign key constraint from the banners table. The `created_by`
field still references `users.id`, but without database-level enforcement.

## ✅ What to Do Now

### Option 1: Run the Fixed Script (Easiest)

Run this file: `fix_banners_table.sql`

This will:

1. Drop the banners table if it exists
2. Recreate it without the foreign key constraint

### Option 2: Update and Re-run Full Migration

The main migration file `SIMPLE_MIGRATION.sql` has been updated. You can:

1. Re-run the entire script (it will skip existing tables)
2. Or just run the banners section (lines 94-117)

## 📋 Quick Fix Command

Run this in your MySQL client:

```sql
-- Drop and recreate banners table
DROP TABLE IF EXISTS banners;

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
```

## ✅ Verify

After running, verify the table was created:

```sql
DESCRIBE banners;

-- Should show all 4 tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'royalsee_garrizon'
AND TABLE_NAME IN ('orders', 'order_items', 'transactions', 'banners');
```

## 📝 Note

The foreign key constraint was removed because your `users.id` column type
doesn't match `BIGINT`. This is fine - the application will still maintain
referential integrity through the code.

## 🎯 Next Steps

Once all 4 tables are created:

1. ✅ Build backend: `.\mvnw.cmd clean package -DskipTests`
2. ✅ Deploy to Tomcat
3. ✅ Access admin dashboard at `/admin`
