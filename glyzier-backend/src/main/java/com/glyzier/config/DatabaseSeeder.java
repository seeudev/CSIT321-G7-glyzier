package com.glyzier.config;

import com.glyzier.model.*;
import com.glyzier.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * DatabaseSeeder - Seeds the database with initial demo data
 * 
 * This class is executed on application startup to populate the database
 * with sample users, sellers, and products for demonstration purposes.
 * 
 * The seeder only runs if the database is empty (no users exist).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Executes the database seeding process on application startup
     * 
     * @param args Command line arguments (unused)
     */
    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (userRepository.count() > 0) {
            logger.info("Database already contains data. Skipping seeding.");
            return;
        }

        logger.info("Starting database seeding...");

        try {
            // Create a demo user
            Users demoUser = new Users();
            demoUser.setDisplayname("Demo Artist");
            demoUser.setEmail("demo@glyzier.com");
            demoUser.setPassword(passwordEncoder.encode("demo123"));
            demoUser = userRepository.save(demoUser);
            logger.info("Created demo user: {}", demoUser.getEmail());

            // Create a seller account for the demo user
            Seller demoSeller = new Seller(
                    "Demo Art Studio",
                    "Welcome to Demo Art Studio! We specialize in digital art, prints, and custom commissions. " +
                    "All our artworks are original creations featuring vibrant colors and unique styles. " +
                    "Check out our collection and find the perfect piece for your space!",
                    demoUser
            );
            demoSeller = sellerRepository.save(demoSeller);
            logger.info("Created demo seller: {}", demoSeller.getSellername());

            // Create 5 sample products with art-related images from Unsplash
            createProduct(demoSeller, 
                "Abstract Sunset Canvas", 
                "Print", 
                new BigDecimal("49.99"),
                "Available",
                "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
                10
            );

            createProduct(demoSeller,
                "Minimalist Mountain Landscape",
                "Digital",
                new BigDecimal("29.99"),
                "Available",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
                15
            );

            createProduct(demoSeller,
                "Watercolor Floral Collection",
                "Print",
                new BigDecimal("39.99"),
                "Available",
                "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
                8
            );

            createProduct(demoSeller,
                "Urban Street Photography Series",
                "Digital",
                new BigDecimal("59.99"),
                "Available",
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
                5
            );

            createProduct(demoSeller,
                "Contemporary Portrait Art",
                "Original",
                new BigDecimal("199.99"),
                "Available",
                "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
                2
            );

            logger.info("Successfully seeded database with 1 user, 1 seller, and 5 products");

        } catch (Exception e) {
            logger.error("Error seeding database: {}", e.getMessage(), e);
        }
    }

    /**
     * Helper method to create a product with inventory
     * 
     * @param seller The seller offering the product
     * @param name Product name
     * @param type Product type (Print, Digital, Original, etc.)
     * @param price Product price
     * @param status Product status (Available, Sold Out, etc.)
     * @param screenshotUrl Screenshot preview URL for thumbnails
     * @param quantity Initial stock quantity
     */
    private void createProduct(Seller seller, String name, String type, BigDecimal price, 
                               String status, String screenshotUrl, int quantity) {
        // Create product
        Products product = new Products(
                name,
                type,
                price,
                status,
                screenshotUrl,
                seller
        );
        product = productsRepository.save(product);

        // Create inventory - qtyonhand is available stock, qtyreserved is 0 initially
        Inventory inventory = new Inventory(quantity, 0, product);
        inventoryRepository.save(inventory);
        product.setInventory(inventory);

        logger.info("Created product: {} ({})", name, type);
    }
}
