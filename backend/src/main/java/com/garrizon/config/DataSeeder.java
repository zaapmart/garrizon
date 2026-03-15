import com.garrizon.model.Category;
import com.garrizon.model.Product;
import com.garrizon.model.User;
import com.garrizon.model.Role;
import com.garrizon.repository.CategoryRepository;
import com.garrizon.repository.ProductRepository;
import com.garrizon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with a handful of categories and AI‑generated sample
 * products.
 * This runs once when the Spring Boot application starts.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final CategoryRepository categoryRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;
        private final JdbcTemplate jdbcTemplate;

        @Override
        public void run(String... args) {
                try {
                        fixSchema();
                        seedUsers();
                        seedDefaultCategory();
                        seedCategories();
                        seedProducts();
                } catch (Exception e) {
                        // Log warning but do NOT crash the application
                        System.err.println("⚠️ DataSeeder warning: " + e.getMessage());
                        e.printStackTrace();
                }
        }

        private void fixSchema() {
                try {
                        System.out.println("Running schema fixes...");
                        // 1. Ensure 'image_url' is nullable
                        jdbcTemplate.execute("ALTER TABLE products MODIFY COLUMN image_url VARCHAR(255) NULL");

                        // 4. Ensure 'cost_price' has a default
                        jdbcTemplate.execute(
                                        "ALTER TABLE products MODIFY COLUMN cost_price DECIMAL(10,2) DEFAULT 0.00");

                        // 5. Ensure 'approved_by' column exists and defaults
                        // This might fail if column doesn't exist, but 'MODIFY' assumes it exists.
                        // If it doesn't exist, we might need 'ADD COLUMN'.
                        // For now, assume it exists as per user's SQL script.
                        jdbcTemplate.execute(
                                        "ALTER TABLE products MODIFY COLUMN approved_by BIGINT NOT NULL DEFAULT 1");

                        System.out.println("Schema fixes completed.");
                } catch (Exception e) {
                        System.err.println("Schema fix partial failure (might be already applied): " + e.getMessage());
                }
        }

        private void seedDefaultCategory() {
                // Ensure ID 1 exists as Default Category.
                // We use JDBC to force ID 1 if needed, or check via repository.
                // Since IDENTITY column generation is used, inserting with ID 1 might be tricky
                // via JPA if it thinks it's new.
                // We will use raw SQL to be safe as per the user's script.
                try {
                        String sql = "INSERT INTO categories (id, name, slug, description, is_active, approved_by, created_at, updated_at) "
                                        +
                                        "SELECT 1, 'Default Category', 'default-category', 'Fallback category', 1, 1, NOW(), NOW() "
                                        +
                                        "WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 1)";
                        jdbcTemplate.execute(sql);
                } catch (Exception e) {
                        System.err.println("Failed to seed default category: " + e.getMessage());
                }
        }

        private void seedCategories() {
                List<Category> categories = Arrays.asList(
                                Category.builder()
                                                .name("Grains")
                                                .slug("grains")
                                                .description("Premium grains for baking and cooking.")
                                                .imageUrl("https://picsum.photos/seed/grains/400/300")
                                                .isActive(true)
                                                .build(),
                                Category.builder()
                                                .name("Tubers")
                                                .slug("tubers")
                                                .description("Root vegetables rich in starch.")
                                                .imageUrl("https://picsum.photos/seed/tubers/400/300")
                                                .isActive(true)
                                                .build(),
                                Category.builder()
                                                .name("Vegetables")
                                                .slug("vegetables")
                                                .description("Fresh vegetables for healthy meals.")
                                                .imageUrl("https://picsum.photos/seed/vegetables/400/300")
                                                .isActive(true)
                                                .build(),
                                Category.builder()
                                                .name("Flour")
                                                .slug("flour")
                                                .description("Gluten‑free and wheat flours.")
                                                .imageUrl("https://picsum.photos/seed/flour/400/300")
                                                .isActive(true)
                                                .build(),
                                Category.builder()
                                                .name("Fruits")
                                                .slug("fruits")
                                                .description("Sweet and juicy fruits.")
                                                .imageUrl("https://picsum.photos/seed/fruits/400/300")
                                                .isActive(true)
                                                .build());
                categories.forEach(cat -> {
                        if (categoryRepository.findBySlug(cat.getSlug()).isEmpty()) {
                                categoryRepository.save(cat);
                        }
                });
        }

        private void seedProducts() {
                // Helper to fetch category by slug
                java.util.function.Function<String, Category> getCat = slug -> categoryRepository.findBySlug(slug)
                                .orElseThrow(() -> new IllegalStateException("Category not found: " + slug));

                List<Product> products = Arrays.asList(
                                Product.builder()
                                                .name("Golden Harvest Wheat")
                                                .slug("golden-harvest-wheat")
                                                .description("Premium hard wheat perfect for breads and pastries.")
                                                .price(new BigDecimal("4.99"))
                                                .imageUrl("https://picsum.photos/seed/wheat/400/300")
                                                .category(getCat.apply("grains"))
                                                .stock(100)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Sunburst Millet")
                                                .slug("sunburst-millet")
                                                .description("Light, gluten‑free millet ideal for salads.")
                                                .price(new BigDecimal("3.49"))
                                                .imageUrl("https://picsum.photos/seed/millet/400/300")
                                                .category(getCat.apply("grains"))
                                                .stock(80)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Sweet Terra Yam")
                                                .slug("sweet-terra-yam")
                                                .description("Naturally sweet yam, great roasted or mashed.")
                                                .price(new BigDecimal("5.79"))
                                                .imageUrl("https://picsum.photos/seed/yam/400/300")
                                                .category(getCat.apply("tubers"))
                                                .stock(60)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Golden Potato")
                                                .slug("golden-potato")
                                                .description("Versatile potatoes for fries, mash, or bake.")
                                                .price(new BigDecimal("2.99"))
                                                .imageUrl("https://picsum.photos/seed/potato/400/300")
                                                .category(getCat.apply("tubers"))
                                                .stock(120)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Emerald Spinach")
                                                .slug("emerald-spinach")
                                                .description("Fresh organic spinach leaves, nutrient‑dense.")
                                                .price(new BigDecimal("2.49"))
                                                .imageUrl("https://picsum.photos/seed/spinach/400/300")
                                                .category(getCat.apply("vegetables"))
                                                .stock(150)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Crimson Tomato")
                                                .slug("crimson-tomato")
                                                .description("Juicy red tomatoes, perfect for sauces.")
                                                .price(new BigDecimal("3.19"))
                                                .imageUrl("https://picsum.photos/seed/tomato/400/300")
                                                .category(getCat.apply("vegetables"))
                                                .stock(130)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Alpine Wheat Flour")
                                                .slug("alpine-wheat-flour")
                                                .description("High‑protein flour for artisan breads.")
                                                .price(new BigDecimal("6.99"))
                                                .imageUrl("https://picsum.photos/seed/flour/400/300")
                                                .category(getCat.apply("flour"))
                                                .stock(70)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Pure Rice Flour")
                                                .slug("pure-rice-flour")
                                                .description("Gluten‑free rice flour for baking.")
                                                .price(new BigDecimal("5.49"))
                                                .imageUrl("https://picsum.photos/seed/riceflour/400/300")
                                                .category(getCat.apply("flour"))
                                                .stock(90)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Sun‑kissed Mango")
                                                .slug("sun-kissed-mango")
                                                .description("Sweet tropical mangoes, ready to eat.")
                                                .price(new BigDecimal("4.29"))
                                                .imageUrl("https://picsum.photos/seed/mango/400/300")
                                                .category(getCat.apply("fruits"))
                                                .stock(50)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Zesty Orange")
                                                .slug("zesty-orange")
                                                .description("Fresh oranges, perfect for juice.")
                                                .price(new BigDecimal("3.79"))
                                                .imageUrl("https://picsum.photos/seed/orange/400/300")
                                                .category(getCat.apply("fruits"))
                                                .stock(80)
                                                .isActive(true)
                                                .build());

                products.forEach(p -> {
                        if (productRepository.findBySlug(p.getSlug()).isEmpty()) {
                                productRepository.save(p);
                        }
                });
        }

        private void seedUsers() {
                // Ensure Admin exists with ID 1 if possible, or just by email
                // Logic from SQL: INSERT ID 1 if not exists.
                // We will try raw SQL for ID 1 safety.
                try {
                        String sql = "INSERT INTO users (id, email, password, role, first_name, created_at, updated_at) "
                                        +
                                        "SELECT 1, 'admin@garrizon.com', '$2a$10$rCWCg/E0m.b/F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'ADMIN', 'Admin User', NOW(), NOW() "
                                        +
                                        "WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1)";
                        jdbcTemplate.execute(sql);
                } catch (Exception e) {
                        System.err.println("Failed to seed admin user via SQL (checking repository next): "
                                        + e.getMessage());
                }

                if (!userRepository.existsByEmail("admin@garrizon.com")) {
                        User admin = User.builder()
                                        .firstName("Admin")
                                        .lastName("User")
                                        .email("admin@garrizon.com")
                                        .password(new BCryptPasswordEncoder().encode("admin123"))
                                        .role(Role.ADMIN)
                                        .userRole("ROLE_ADMIN")
                                        .city("Lagos")
                                        .country("Nigeria")
                                        .state("Lagos")
                                        .phone("0000000000")
                                        .altPhone("0000000000")
                                        .build();
                        userRepository.save(admin);
                }
        }
}
