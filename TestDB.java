import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class TestDB {
    public static void main(String[] args) {
        String url = "jdbc:mysql://gldz3.dailyrazor.com:3306/royalsee_gzon_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String user = "royalsee_gzon_user";
        String password = "G@rr1z0n+DB+P@55w0rd";

        System.out.println("Testing connection to: " + url);
        System.out.println("User: " + user);

        try {
            System.out.println("Loading driver...");
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver loaded. Attempting to connect...");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("\nSUCCESS: Connection established!");
            conn.close();
        } catch (Exception e) {
            System.out.println("\nFAILED: Connection error!");
            System.out.println("Exception type: " + e.getClass().getName());
            System.out.println("Exception message: " + e.getMessage());
            e.printStackTrace(System.out);
        }
    }
}
