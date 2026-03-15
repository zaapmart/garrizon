package com.garrizon;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class RunMigration {

    private static final String DB_URL = "jdbc:mysql://gldz3.dailyrazor.com:3306/royalsee_garrizon";
    private static final String DB_USER = "royalsee_gzon_user";
    private static final String DB_PASSWORD = "G@rr1z0n+DB+P@55w0rd";

    public static void main(String[] args) {
        System.out.println("🚀 Starting database migration...");

        try {
            // Load MySQL driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Connect to database
            System.out.println("📡 Connecting to database...");
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            System.out.println("✅ Connected successfully!");

            // Execute migrations
            executeMigration(conn, "1. Creating orders table",
                    "CREATE TABLE IF NOT EXISTS orders (" +
                            "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                            "order_number VARCHAR(50) NOT NULL UNIQUE," +
                            "user_id BIGINT NOT NULL," +
                            "subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00," +
                            "tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00," +
                            "shipping_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00," +
                            "discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00," +
                            "total_amount DECIMAL(10, 2) NOT NULL," +
                            "status ENUM('PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',"
                            +
                            "payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING'," +
                            "shipping_name VARCHAR(255) NOT NULL," +
                            "shipping_email VARCHAR(255) NOT NULL," +
                            "shipping_phone VARCHAR(50)," +
                            "shipping_address_line1 VARCHAR(255) NOT NULL," +
                            "shipping_address_line2 VARCHAR(255)," +
                            "shipping_city VARCHAR(100) NOT NULL," +
                            "shipping_state VARCHAR(100) NOT NULL," +
                            "shipping_postal_code VARCHAR(20) NOT NULL," +
                            "shipping_country VARCHAR(100) NOT NULL DEFAULT 'Nigeria'," +
                            "payment_method VARCHAR(50)," +
                            "payment_reference VARCHAR(255)," +
                            "customer_notes TEXT," +
                            "admin_notes TEXT," +
                            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                            "updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                            "completed_at TIMESTAMP NULL," +
                            "cancelled_at TIMESTAMP NULL," +
                            "CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE," +
                            "INDEX idx_order_number (order_number)," +
                            "INDEX idx_user_id (user_id)," +
                            "INDEX idx_status (status)," +
                            "INDEX idx_payment_status (payment_status)," +
                            "INDEX idx_created_at (created_at)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            executeMigration(conn, "2. Creating order_items table",
                    "CREATE TABLE IF NOT EXISTS order_items (" +
                            "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                            "order_id BIGINT NOT NULL," +
                            "product_id BIGINT NOT NULL," +
                            "product_name VARCHAR(255) NOT NULL," +
                            "product_slug VARCHAR(255) NOT NULL," +
                            "product_image_url VARCHAR(500)," +
                            "unit_price DECIMAL(10, 2) NOT NULL," +
                            "quantity INT NOT NULL DEFAULT 1," +
                            "subtotal DECIMAL(10, 2) NOT NULL," +
                            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                            "updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                            "CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,"
                            +
                            "CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,"
                            +
                            "INDEX idx_order_id (order_id)," +
                            "INDEX idx_product_id (product_id)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            executeMigration(conn, "3. Creating transactions table",
                    "CREATE TABLE IF NOT EXISTS transactions (" +
                            "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                            "reference VARCHAR(255) NOT NULL UNIQUE," +
                            "order_id BIGINT NOT NULL," +
                            "user_id BIGINT NOT NULL," +
                            "amount DECIMAL(10, 2) NOT NULL," +
                            "currency VARCHAR(10) NOT NULL DEFAULT 'NGN'," +
                            "status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',"
                            +
                            "payment_method VARCHAR(50) NOT NULL," +
                            "payment_gateway VARCHAR(50)," +
                            "gateway_reference VARCHAR(255)," +
                            "gateway_response TEXT," +
                            "customer_name VARCHAR(255)," +
                            "customer_email VARCHAR(255)," +
                            "customer_phone VARCHAR(50)," +
                            "metadata TEXT," +
                            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                            "updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                            "paid_at TIMESTAMP NULL," +
                            "failed_at TIMESTAMP NULL," +
                            "CONSTRAINT fk_transactions_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,"
                            +
                            "CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,"
                            +
                            "INDEX idx_reference (reference)," +
                            "INDEX idx_order_id (order_id)," +
                            "INDEX idx_user_id (user_id)," +
                            "INDEX idx_status (status)," +
                            "INDEX idx_payment_method (payment_method)," +
                            "INDEX idx_created_at (created_at)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            executeMigration(conn, "4. Creating banners table",
                    "CREATE TABLE IF NOT EXISTS banners (" +
                            "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                            "title VARCHAR(255) NOT NULL," +
                            "subtitle VARCHAR(500)," +
                            "description TEXT," +
                            "cta_text VARCHAR(100)," +
                            "cta_link VARCHAR(500)," +
                            "image_url VARCHAR(500) NOT NULL," +
                            "mobile_image_url VARCHAR(500)," +
                            "display_order INT NOT NULL DEFAULT 0," +
                            "is_active TINYINT(1) NOT NULL DEFAULT 1," +
                            "start_date TIMESTAMP NULL," +
                            "end_date TIMESTAMP NULL," +
                            "target_audience ENUM('ALL', 'NEW_USERS', 'RETURNING_USERS') NOT NULL DEFAULT 'ALL'," +
                            "created_by BIGINT NOT NULL," +
                            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                            "updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                            "CONSTRAINT fk_banners_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,"
                            +
                            "INDEX idx_is_active (is_active)," +
                            "INDEX idx_display_order (display_order)," +
                            "INDEX idx_start_date (start_date)," +
                            "INDEX idx_end_date (end_date)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // Add inventory columns (may fail if they exist - that's OK)
            System.out.println("\n5. Adding inventory columns to products table...");
            try {
                Statement stmt = conn.createStatement();
                stmt.execute("ALTER TABLE products ADD COLUMN low_stock_threshold INT NOT NULL DEFAULT 10");
                System.out.println("   ✅ Added low_stock_threshold");
            } catch (Exception e) {
                System.out.println("   ⚠️  low_stock_threshold already exists (OK)");
            }

            try {
                Statement stmt = conn.createStatement();
                stmt.execute("ALTER TABLE products ADD COLUMN sku VARCHAR(100) UNIQUE");
                System.out.println("   ✅ Added sku");
            } catch (Exception e) {
                System.out.println("   ⚠️  sku already exists (OK)");
            }

            try {
                Statement stmt = conn.createStatement();
                stmt.execute("ALTER TABLE products ADD COLUMN barcode VARCHAR(100)");
                System.out.println("   ✅ Added barcode");
            } catch (Exception e) {
                System.out.println("   ⚠️  barcode already exists (OK)");
            }

            try {
                Statement stmt = conn.createStatement();
                stmt.execute("ALTER TABLE products ADD COLUMN weight DECIMAL(10, 2)");
                System.out.println("   ✅ Added weight");
            } catch (Exception e) {
                System.out.println("   ⚠️  weight already exists (OK)");
            }

            try {
                Statement stmt = conn.createStatement();
                stmt.execute("ALTER TABLE products ADD COLUMN dimensions VARCHAR(100)");
                System.out.println("   ✅ Added dimensions");
            } catch (Exception e) {
                System.out.println("   ⚠️  dimensions already exists (OK)");
            }

            // Verify
            System.out.println("\n📊 Verifying tables...");
            Statement stmt = conn.createStatement();
            var rs = stmt.executeQuery(
                    "SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES " +
                            "WHERE TABLE_SCHEMA = 'royalsee_garrizon' " +
                            "AND TABLE_NAME IN ('orders', 'order_items', 'transactions', 'banners') " +
                            "ORDER BY TABLE_NAME");

            System.out.println("\n✅ Tables created:");
            while (rs.next()) {
                System.out.println("   - " + rs.getString("TABLE_NAME") + " (" + rs.getLong("TABLE_ROWS") + " rows)");
            }

            conn.close();
            System.out.println("\n🎉 Migration completed successfully!");

        } catch (Exception e) {
            System.err.println("\n❌ Error during migration:");
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void executeMigration(Connection conn, String description, String sql) {
        System.out.println("\n" + description + "...");
        try {
            Statement stmt = conn.createStatement();
            stmt.execute(sql);
            System.out.println("   ✅ Success!");
        } catch (Exception e) {
            if (e.getMessage().contains("already exists")) {
                System.out.println("   ⚠️  Table already exists (skipping)");
            } else {
                System.err.println("   ❌ Error: " + e.getMessage());
                throw new RuntimeException(e);
            }
        }
    }
}
