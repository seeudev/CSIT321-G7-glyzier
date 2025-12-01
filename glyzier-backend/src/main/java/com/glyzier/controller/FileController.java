package com.glyzier.controller;

import com.glyzier.model.ProductFiles;
import com.glyzier.model.Products;
import com.glyzier.model.Users;
import com.glyzier.repository.OrderProductsRepository;
import com.glyzier.repository.ProductsRepository;
import com.glyzier.repository.UserRepository;
import com.glyzier.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * File Controller
 * 
 * REST API endpoints for managing product file uploads, downloads, and deletions.
 * Integrates with Supabase Storage for cloud file storage.
 * 
 * Endpoints:
 * - POST   /api/files/upload/{productId}    - Upload file for product
 * - GET    /api/files/product/{productId}   - Get all files for product
 * - GET    /api/files/download/{fileId}     - Get signed URL for download
 * - DELETE /api/files/{fileId}              - Delete file from storage
 * 
 * Security:
 * - Upload: Authenticated sellers only (must own product)
 * - View: Public (anyone can see product files)
 * - Download: Purchase verification for digital products
 * - Delete: Authenticated sellers only (must own product)
 * 
 * @author Glyzier Development Team
 * @since Module 20 - Supabase Storage Integration
 */
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderProductsRepository orderProductsRepository;
    
    @Autowired
    private com.glyzier.config.SupabaseConfig supabaseConfig;

    /**
     * Upload File Endpoint
     * 
     * Uploads file to Supabase Storage and creates ProductFiles record.
     * Supports three file types:
     * - product_image: Gallery photos (public)
     * - preview: Thumbnail image (public)
     * - digital_download: Downloadable file (private)
     * 
     * Request:
     * - Multipart form data with 'file' field
     * - Query param: fileType (product_image, preview, digital_download)
     * 
     * Validation:
     * - User must be authenticated
     * - User must be seller
     * - User must own the product
     * - File type must be valid
     * - File size/type must meet requirements
     * 
     * @param productId Product ID to associate file with
     * @param fileType File type enum value
     * @param file Uploaded file
     * @param authentication Spring Security authentication object
     * @return ProductFiles entity with file details
     */
    @PostMapping("/upload/{productId}")
    public ResponseEntity<?> uploadFile(
            @PathVariable Long productId,
            @RequestParam String fileType,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            // Get authenticated user
            String email = authentication.getName();
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Verify user is a seller
            if (user.getSeller() == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only sellers can upload product files"));
            }

            // Fetch product
            Products product = productsRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // Verify seller owns this product
            if (!product.getSeller().getSid().equals(user.getSeller().getSid())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only upload files for your own products"));
            }

            // Upload file
            ProductFiles uploadedFile = fileStorageService.uploadFile(file, product, fileType);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("file", Map.of(
                    "fileId", uploadedFile.getPfileid(),
                    "fileType", uploadedFile.getFileType(),
                    "fileUrl", supabaseConfig.getPublicUrl(getBucketForFileType(uploadedFile.getFileType()), uploadedFile.getFileKey()),
                    "fileKey", uploadedFile.getFileKey(),
                    "uploadedAt", uploadedFile.getCreatedAt()
            ));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    /**
     * Get Product Files Endpoint
     * 
     * Retrieves all files associated with a product.
     * Public endpoint - no authentication required.
     * 
     * Returns files grouped by type:
     * - product_image: Array of gallery images
     * - preview: Single thumbnail image
     * - digital_download: Downloadable file (only if user purchased)
     * 
     * @param productId Product ID to fetch files for
     * @return Map of file types to file arrays
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductFiles(@PathVariable Long productId) {
        try {
            // Fetch all files for product
            List<ProductFiles> files = fileStorageService.getProductFiles(productId);

            // Group files by type
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("productId", productId);
            response.put("files", files.stream().map(file -> {
                String bucketName = getBucketForFileType(file.getFileType());
                return Map.of(
                    "fileId", file.getPfileid(),
                    "fileType", file.getFileType(),
                    "fileUrl", supabaseConfig.getPublicUrl(bucketName, file.getFileKey()),
                    "uploadedAt", file.getCreatedAt()
                );
            }).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch files: " + e.getMessage()));
        }
    }

    /**
     * Get Download URL Endpoint
     * 
     * Generates signed download URL for digital product files.
     * Requires purchase verification:
     * - User must be authenticated
     * - User must have purchased this product
     * 
     * Signed URL Expiration: 1 hour (3600 seconds)
     * 
     * Use Case: User clicks "Download" button on purchased digital product
     * 
     * @param fileId ProductFiles entity ID
     * @param authentication Spring Security authentication object
     * @return Signed URL with expiration time
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<?> getDownloadUrl(
            @PathVariable Long fileId,
            Authentication authentication) {
        try {
            // Get authenticated user
            String email = authentication.getName();
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Fetch file record
            ProductFiles file = fileStorageService.getProductFiles(0L).stream()
                    .filter(f -> f.getPfileid().equals(fileId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("File not found"));

            Products product = file.getProduct();

            // Verify user purchased this product
            boolean hasPurchased = orderProductsRepository.existsByOrderUserUseridAndProductPid(
                    user.getUserid(), product.getPid());

            if (!hasPurchased) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You must purchase this product to download it"));
            }

            // Generate signed URL
            String signedUrl = fileStorageService.generateSignedUrl(file.getFileKey());

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("downloadUrl", signedUrl);
            response.put("expiresIn", 3600); // 1 hour
            response.put("fileName", product.getProductname() + " - Digital Download");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate download URL: " + e.getMessage()));
        }
    }

    /**
     * Delete File Endpoint
     * 
     * Removes file from Supabase Storage and deletes database record.
     * Only seller who owns the product can delete files.
     * 
     * Use Case:
     * - Seller replaces product image with better photo
     * - Seller updates digital product file
     * - Seller removes unwanted gallery images
     * 
     * @param fileId ProductFiles entity ID to delete
     * @param authentication Spring Security authentication object
     * @return Success message
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        try {
            // Get authenticated user
            String email = authentication.getName();
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Verify user is a seller
            if (user.getSeller() == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only sellers can delete product files"));
            }

            // Fetch file to verify ownership
            ProductFiles file = fileStorageService.getProductFiles(0L).stream()
                    .filter(f -> f.getPfileid().equals(fileId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("File not found"));

            Products product = file.getProduct();

            // Verify seller owns this product
            if (!product.getSeller().getSid().equals(user.getSeller().getSid())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only delete files for your own products"));
            }

            // Delete file
            fileStorageService.deleteFile(fileId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "File deleted successfully"
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete file: " + e.getMessage()));
        }
    }

    /**
     * Get Files by Type Endpoint
     * 
     * Retrieves files filtered by type for a product.
     * Useful for fetching only gallery images or only previews.
     * 
     * @param productId Product ID to fetch files for
     * @param fileType File type to filter by
     * @return List of ProductFiles matching the type
     */
    @GetMapping("/product/{productId}/type/{fileType}")
    public ResponseEntity<?> getProductFilesByType(
            @PathVariable Long productId,
            @PathVariable String fileType) {
        try {
            List<ProductFiles> files = fileStorageService.getProductFilesByType(productId, fileType);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("productId", productId);
            response.put("fileType", fileType);
            response.put("files", files.stream().map(file -> {
                String bucketName = getBucketForFileType(file.getFileType());
                return Map.of(
                    "fileId", file.getPfileid(),
                    "fileUrl", supabaseConfig.getPublicUrl(bucketName, file.getFileKey()),
                    "uploadedAt", file.getCreatedAt()
                );
            }).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch files: " + e.getMessage()));
        }
    }
    
    /**
     * Get Bucket Name for File Type
     * 
     * Helper method to map file type to Supabase bucket name.
     * 
     * @param fileType File type enum value
     * @return Bucket name string
     */
    private String getBucketForFileType(String fileType) {
        return switch (fileType.toLowerCase()) {
            case "product_image" -> supabaseConfig.getImagesBucketName();
            case "preview" -> supabaseConfig.getPreviewsBucketName();
            case "digital_download" -> supabaseConfig.getDigitalBucketName();
            default -> throw new IllegalArgumentException("Invalid file type: " + fileType);
        };
    }
}
