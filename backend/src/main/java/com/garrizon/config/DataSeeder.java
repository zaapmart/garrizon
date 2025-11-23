package com.garrizon.config;

import com.garrizon.model.Category;
import com.garrizon.model.Product;
import com.garrizon.model.User;
import com.garrizon.model.Role;
import com.garrizon.repository.CategoryRepository;
import com.garrizon.repository.ProductRepository;
import com.garrizon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

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

        @Override
        public void run(String... args) throws Exception {
                seedCategories();
                seedProducts();
                seedUsers();
        }

        private void seedCategories() {
                List<Category> categories = Arrays.asList(
                                Category.builder()
                                                .name("Grains")
                                                .slug("grains")
                                                .description("Premium grains for baking and cooking.")
                                                .imageUrl("https://picsum.photos/seed/grains/400/300")
                                                .build(),
                                Category.builder()
                                                .name("Tubers")
                                                .slug("tubers")
                                                .description("Root vegetables rich in starch.")
                                                .imageUrl("https://picsum.photos/seed/tubers/400/300")
                                                .build(),
                                Category.builder()
                                                .name("Vegetables")
                                                .slug("vegetables")
                                                .description("Fresh vegetables for healthy meals.")
                                                .imageUrl("https://picsum.photos/seed/vegetables/400/300")
                                                .build(),
                                Category.builder()
                                                .name("Flour")
                                                .slug("flour")
                                                .description("Gluten‑free and wheat flours.")
                                                .imageUrl("https://picsum.photos/seed/flour/400/300")
                                                .build(),
                                Category.builder()
                                                .name("Fruits")
                                                .slug("fruits")
                                                .description("Sweet and juicy fruits.")
                                                .imageUrl("https://picsum.photos/seed/fruits/400/300")
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
                if (!userRepository.existsByEmail("admin@garrizon.com")) {
                        User admin = User.builder()
                                        .firstName("Admin")
                                        .lastName("User")
                                        .email("admin@garrizon.com")
                                        .password(new BCryptPasswordEncoder().encode("admin123"))
                                        .role(Role.ADMIN)
                                        .build();
                        userRepository.save(admin);
                }
        }
}
