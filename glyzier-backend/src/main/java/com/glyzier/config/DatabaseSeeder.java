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

            // Create sample products with detailed descriptions
            // Digital products get unlimited inventory (-1), physical products get finite quantities
            
            createProduct(demoSeller, 
                "Abstract Sunset Canvas Print", 
                "Print", 
                new BigDecimal("49.99"),
                "Available",
                "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
                "A stunning abstract interpretation of a sunset over the ocean. This premium canvas print features vibrant oranges, deep purples, and warm yellows that blend seamlessly. Perfect for modern living rooms or contemporary office spaces. Printed on high-quality canvas with fade-resistant inks. Size: 24x36 inches.",
                10
            );

            createProduct(demoSeller,
                "Minimalist Mountain Landscape - Digital Download",
                "Digital",
                new BigDecimal("19.99"),
                "Available",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
                "Serene minimalist landscape featuring majestic snow-capped mountains reflected in crystal-clear waters. High-resolution digital file (4000x3000px, 300 DPI) suitable for printing up to 16x12 inches. Instant download after purchase. Perfect for desktop wallpapers, prints, or digital art projects.",
                -1 // Unlimited for digital
            );

            createProduct(demoSeller,
                "Watercolor Floral Art Print Set",
                "Print",
                new BigDecimal("39.99"),
                "Available",
                "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
                "Beautiful set of three watercolor floral prints featuring delicate roses, peonies, and wildflowers. Hand-painted original designs printed on premium archival paper. Each print measures 8x10 inches. Perfect for creating a gallery wall in bedrooms, nurseries, or dining areas. Unframed.",
                8
            );

            createProduct(demoSeller,
                "Urban Street Photography - Digital Collection",
                "Digital",
                new BigDecimal("34.99"),
                "Available",
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
                "Curated collection of 15 high-resolution urban street photography images. Captures the essence of city life with dramatic lighting, authentic moments, and architectural beauty. All images are 6000x4000px at 300 DPI. Commercial license included. Instant digital download with lifetime access.",
                -1 // Unlimited for digital
            );

            createProduct(demoSeller,
                "Contemporary Portrait - Original Acrylic on Canvas",
                "Original",
                new BigDecimal("899.99"),
                "Available",
                "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
                "One-of-a-kind original contemporary portrait painted with premium acrylic on stretched canvas. Features bold brushstrokes, vibrant color palette, and expressive composition. Size: 30x40 inches. Signed and dated by the artist. Includes certificate of authenticity. Ready to hang with gallery-wrapped edges.",
                1 // Only one original available
            );

            createProduct(demoSeller,
                "Cosmic Nebula Digital Art Pack",
                "Digital",
                new BigDecimal("24.99"),
                "Available",
                "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop",
                "Stunning space-themed digital art pack featuring 10 cosmic nebula designs. Perfect for graphic design projects, social media content, or website backgrounds. High-resolution files (5000x5000px) in both PNG and JPG formats. Includes color variations. Commercial use allowed.",
                -1 // Unlimited for digital
            );

            createProduct(demoSeller,
                "Botanical Line Art Print Collection",
                "Print",
                new BigDecimal("44.99"),
                "Available",
                "https://images.unsplash.com/photo-1432163230927-a32e4fd5a326?w=800&h=600&fit=crop",
                "Elegant set of four botanical line art prints featuring minimalist leaf and plant illustrations. Printed on premium matte paper with archival inks. Each print is 11x14 inches. Perfect for Scandinavian or modern interior design. Shipped flat in protective packaging.",
                12
            );

            createProduct(demoSeller,
                "Abstract Geometric Digital Wallpaper Bundle",
                "Digital",
                new BigDecimal("14.99"),
                "Available",
                "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop",
                "Modern abstract geometric wallpaper bundle with 20 unique designs. Perfect for desktop backgrounds, phone wallpapers, or digital displays. Multiple resolutions included (4K, Full HD, Mobile). Vibrant colors and clean compositions. Instant download, lifetime updates.",
                -1 // Unlimited for digital
            );

            logger.info("Successfully seeded database with 1 user, 1 seller, and 8 products");

        } catch (Exception e) {
            logger.error("Error seeding database: {}", e.getMessage(), e);
        }
    }

    /**
     * Helper method to create a product with inventory and description
     * 
     * @param seller The seller offering the product
     * @param name Product name
     * @param type Product type (Print, Digital, Original, etc.)
     * @param price Product price
     * @param status Product status (Available, Sold Out, etc.)
     * @param screenshotUrl Screenshot preview URL for thumbnails
     * @param description Detailed product description
     * @param quantity Initial stock quantity (use -1 for unlimited digital products)
     */
    private void createProduct(Seller seller, String name, String type, BigDecimal price, 
                               String status, String screenshotUrl, String description, int quantity) {
        // Create product
        Products product = new Products(
                name,
                type,
                price,
                status,
                screenshotUrl,
                seller
        );
        product.setProductdesc(description);
        product = productsRepository.save(product);

        // Create inventory
        // Use -1 for unlimited stock (digital products), finite number for physical products
        Inventory inventory = new Inventory(quantity, 0, product);
        inventoryRepository.save(inventory);
        product.setInventory(inventory);

        String stockInfo = quantity == -1 ? "unlimited stock" : quantity + " units";
        logger.info("Created product: {} ({}) - {}", name, type, stockInfo);
    }
}
