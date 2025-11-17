package com.glyzier.service;

import com.glyzier.dto.InventoryRequest;
import com.glyzier.dto.ProductRequest;
import com.glyzier.dto.ProductResponse;
import com.glyzier.model.Inventory;
import com.glyzier.model.ProductFiles;
import com.glyzier.model.Products;
import com.glyzier.model.Seller;
import com.glyzier.repository.InventoryRepository;
import com.glyzier.repository.ProductFilesRepository;
import com.glyzier.repository.ProductsRepository;
import com.glyzier.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductService - Business logic for product-related operations
 * 
 * This service handles all product management functionality in the Glyzier platform.
 * It manages product CRUD operations, inventory updates, and file associations.
 * 
 * Key responsibilities:
 * - Create, read, update, delete products
 * - Manage product inventory (simulated)
 * - Handle product file associations (simulated)
 * - Validate product ownership by sellers
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class ProductService {

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    /**
     * Create a new product for a specific seller ID
     * 
     * This method creates a new product for a seller. It also handles:
     * - Creating ProductFiles entities for each file key (simulated)
     * - Creating an Inventory record with initial stock of 0
     * 
     * @param sellerId The seller ID
     * @param request The product details
     * @return ProductResponse DTO containing the created product information
     * @throws IllegalArgumentException if seller not found
     */
    @Transactional
    public ProductResponse createProductForSeller(Long sellerId, ProductRequest request) {
        // Find the seller
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + sellerId));

        // Create the product entity
        Products product = new Products(
                request.getProductname(),
                request.getType(),
                request.getPrice(),
                request.getStatus() != null ? request.getStatus() : "Available",
                request.getScreenshotPreviewUrl(),
                seller
        );

        // Save the product first to get its ID
        product = productsRepository.save(product);

        // Create ProductFiles entities for each file key (simulated file upload)
        if (request.getFileKeys() != null && !request.getFileKeys().isEmpty()) {
            for (String fileKey : request.getFileKeys()) {
                // Extract file format from the key (simple simulation)
                String fileFormat = extractFileFormat(fileKey);
                
                ProductFiles productFile = new ProductFiles(
                        fileKey,
                        "product_image", // Default type
                        fileFormat,
                        product
                );
                
                product.addProductFile(productFile);
            }
            
            // Save again to persist product files
            product = productsRepository.save(product);
        }

        // Create inventory record with initial stock of 0
        Inventory inventory = new Inventory(0, 0, product);
        inventoryRepository.save(inventory);
        product.setInventory(inventory);

        // Return as ProductResponse DTO
        return new ProductResponse(product);
    }

    /**
     * Update an existing product
     * 
     * This method updates product details. It validates that the seller owns the product.
     * 
     * @param sellerId The seller ID (for ownership validation)
     * @param productId The product ID to update
     * @param request The updated product details
     * @return ProductResponse DTO containing the updated product information
     * @throws IllegalArgumentException if product not found or seller doesn't own it
     */
    @Transactional
    public ProductResponse updateProduct(Long sellerId, Long productId, ProductRequest request) {
        // Find the product
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Verify ownership
        if (!product.getSeller().getSid().equals(sellerId)) {
            throw new IllegalArgumentException("You do not have permission to update this product");
        }

        // Update product fields
        product.setProductname(request.getProductname());
        product.setType(request.getType());
        product.setPrice(request.getPrice());
        product.setScreenshotPreviewUrl(request.getScreenshotPreviewUrl());
        
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        // Handle product files update (simulated)
        // For simplicity, we'll remove old files and add new ones
        if (request.getFileKeys() != null && !request.getFileKeys().isEmpty()) {
            // Clear existing files
            product.getProductFiles().clear();
            
            // Add new files
            for (String fileKey : request.getFileKeys()) {
                String fileFormat = extractFileFormat(fileKey);
                
                ProductFiles productFile = new ProductFiles(
                        fileKey,
                        "product_image",
                        fileFormat,
                        product
                );
                
                product.addProductFile(productFile);
            }
        }

        // Save and return
        product = productsRepository.save(product);
        return new ProductResponse(product);
    }

    /**
     * Delete a product
     * 
     * This method deletes a product. It validates that the seller owns the product.
     * Due to cascade settings, associated ProductFiles and Inventory records are also deleted.
     * 
     * @param sellerId The seller ID (for ownership validation)
     * @param productId The product ID to delete
     * @throws IllegalArgumentException if product not found or seller doesn't own it
     */
    @Transactional
    public void deleteProduct(Long sellerId, Long productId) {
        // Find the product
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Verify ownership
        if (!product.getSeller().getSid().equals(sellerId)) {
            throw new IllegalArgumentException("You do not have permission to delete this product");
        }

        // Delete the product (cascade will handle ProductFiles and Inventory)
        productsRepository.delete(product);
    }

    /**
     * Set or update inventory for a product (simulated)
     * 
     * This method updates the quantity on hand for a product.
     * In a real system, this would involve more complex logic like warehouse management.
     * For this university project, we keep it simple.
     * 
     * @param sellerId The seller ID (for ownership validation)
     * @param productId The product ID
     * @param request The inventory details
     * @return ProductResponse DTO with updated inventory information
     * @throws IllegalArgumentException if product not found or seller doesn't own it
     */
    @Transactional
    public ProductResponse setProductInventory(Long sellerId, Long productId, InventoryRequest request) {
        // Find the product
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Verify ownership
        if (!product.getSeller().getSid().equals(sellerId)) {
            throw new IllegalArgumentException("You do not have permission to update this product's inventory");
        }

        // Find or create inventory record
        Inventory inventory = inventoryRepository.findByProductPid(productId)
                .orElse(new Inventory(0, 0, product));

        // Update quantity on hand
        inventory.setQtyonhand(request.getQtyonhand());

        // Save inventory
        inventory = inventoryRepository.save(inventory);
        product.setInventory(inventory);

        // Return updated product
        return new ProductResponse(product);
    }

    /**
     * Get all products (paginated)
     * 
     * This is a public endpoint - anyone can view all products.
     * 
     * @param pageable Pagination parameters
     * @return Page of ProductResponse DTOs
     */
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Products> productsPage = productsRepository.findAll(pageable);
        return productsPage.map(ProductResponse::new);
    }

    /**
     * Get a single product by ID
     * 
     * This is a public endpoint - anyone can view product details.
     * Includes ProductFiles and Inventory information.
     * 
     * @param productId The product ID
     * @return ProductResponse DTO
     * @throws IllegalArgumentException if product not found
     */
    public ProductResponse getProductById(Long productId) {
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        return new ProductResponse(product);
    }

    /**
     * Get all products for a specific seller
     * 
     * This is a public endpoint - anyone can view a seller's products.
     * 
     * @param sellerId The seller ID
     * @return List of ProductResponse DTOs
     */
    public List<ProductResponse> getProductsBySeller(Long sellerId) {
        // Verify seller exists
        sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + sellerId));

        List<Products> products = productsRepository.findBySellerSid(sellerId);
        
        return products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to extract file format from file key
     * 
     * This is a simple simulation - in a real system, you would use proper
     * file type detection or get this from the actual uploaded file.
     * 
     * @param fileKey The file key (e.g., "image1.jpg")
     * @return The file format (e.g., "jpg")
     */
    private String extractFileFormat(String fileKey) {
        if (fileKey == null || !fileKey.contains(".")) {
            return "unknown";
        }
        
        int lastDotIndex = fileKey.lastIndexOf('.');
        return fileKey.substring(lastDotIndex + 1).toLowerCase();
    }
}
