package com.garrizon;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class DbSanityTest {
    @Test
    public void testConnection() throws Exception {
        String url = "jdbc:mysql://gldz3.dailyrazor.com:3306/royalsee_garrizon?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "royalsee_gzon_user";
        String password = "G@rr1z0n+DB+P@55w0rd";

        List<String> output = new ArrayList<>();
        output.add("Attempting to connect to the database...");

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            output.add("Connection successful!");
            output.add("Running sanity check: SHOW TABLES;");

            try (Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SHOW TABLES")) {

                while (rs.next()) {
                    output.add("Table: " + rs.getString(1));
                }
            }
        } catch (Exception e) {
            output.add("Database connection failed!");
            output.add(e.toString());
            Files.write(Paths.get("db_check_result.txt"), output);
            throw e;
        }
        Files.write(Paths.get("db_check_result.txt"), output);
    }
}
