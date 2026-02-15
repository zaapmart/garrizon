package com.garrizon;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestDbConnection {
    public static void main(String[] args) {
        String url = "jdbc:mysql://gldz3.dailyrazor.com:3306/royalsee_garrizon?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "royalsee_gzon_user";
        String password = "G@rr1z0n+DB+P@55w0rd";

        System.out.println("Attempting to connect to the database...");
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connection successful!");
            System.out.println("Running sanity check: SHOW TABLES;");

            try (Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SHOW TABLES")) {

                int count = 0;
                while (rs.next()) {
                    System.out.println("Table: " + rs.getString(1));
                    count++;
                }
                System.out.println("Total tables found: " + count);
            }
        } catch (Exception e) {
            System.err.println("Database connection failed!");
            e.printStackTrace();
        }
    }
}
