package com.garrizon;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class MakeUserAdmin {
    public static void main(String[] args) {
        String url = "jdbc:mysql://gldz3.dailyrazor.com:3306/royalsee_garrizon?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "royalsee_gzon_user";
        String password = "G@rr1z0n+DB+P@55w0rd";
        String targetEmail = "contactkufreakpan@gmail.com";

        System.out.println("Connecting to database to update user role...");

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connection successful!");

            // Update the user role
            String updateSql = "UPDATE users SET role = 'ADMIN', user_role = 'ROLE_ADMIN' WHERE email = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(updateSql)) {
                pstmt.setString(1, targetEmail);
                int rowsAffected = pstmt.executeUpdate();

                if (rowsAffected > 0) {
                    System.out.println("✅ Successfully updated user role to ADMIN for: " + targetEmail);
                } else {
                    System.out.println("⚠️ No user found with email: " + targetEmail);
                }
            }

            // Verify the update
            String selectSql = "SELECT id, email, first_name, last_name, role, user_role FROM users WHERE email = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(selectSql)) {
                pstmt.setString(1, targetEmail);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        System.out.println("\n📋 User Details:");
                        System.out.println("ID: " + rs.getLong("id"));
                        System.out.println("Email: " + rs.getString("email"));
                        System.out.println("Name: " + rs.getString("first_name") + " " + rs.getString("last_name"));
                        System.out.println("Role: " + rs.getString("role"));
                        System.out.println("User Role: " + rs.getString("user_role"));
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to update user role!");
            e.printStackTrace();
        }
    }
}
