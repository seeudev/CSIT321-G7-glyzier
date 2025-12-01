package com.glyzier.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Supabase Configuration
 * 
 * Configures Supabase Storage API client for file upload/download operations.
 * Loads credentials from application-supabase.properties and provides
 * centralized access to Storage API endpoints.
 * 
 * Supabase Storage Architecture:
 * - REST API-based (no official Java SDK yet)
 * - Uses Spring RestTemplate for HTTP requests
 * - Authentication via API Key (apikey header)
 * - Supports public and private buckets
 * 
 * Buckets:
 * - product-images (public): Product gallery photos
 * - product-previews (public): Thumbnail images for cards
 * - digital-products (private): Downloadable files (authenticated access only)
 * 
 * @author Glyzier Development Team
 * @since Module 20 - Supabase Storage Integration
 */
@Configuration
public class SupabaseConfig {

    /**
     * Supabase Project URL
     * Format: https://<project-id>.supabase.co
     * Used for constructing Storage API endpoints
     */
    @Value("${supabase.url}")
    private String supabaseUrl;

    /**
     * Supabase API Key (Anon Public Key)
     * Used for authentication in Storage API requests
     * Safe to use in client-side code for public operations
     */
    @Value("${supabase.key}")
    private String supabaseKey;

    /**
     * Storage API Base URL
     * Format: https://<project-id>.supabase.co/storage/v1
     * All file operations use this as base path
     */
    @Value("${supabase.storage.url}")
    private String storageUrl;

    /**
     * Product Images Bucket Name
     * Public bucket for product gallery photos (JPEG, PNG, WebP)
     * Max file size: 10MB per image
     */
    @Value("${supabase.bucket.images}")
    private String imagesBucketName;

    /**
     * Product Previews Bucket Name
     * Public bucket for thumbnail/preview images
     * Max file size: 5MB per preview
     */
    @Value("${supabase.bucket.previews}")
    private String previewsBucketName;

    /**
     * Digital Products Bucket Name
     * Private bucket for downloadable files (ZIP, PDF, PSD, AI, etc.)
     * Max file size: 100MB per file
     * Access controlled via signed URLs
     */
    @Value("${supabase.bucket.digital}")
    private String digitalBucketName;

    /**
     * Maximum File Upload Size
     * Enforced at application level before Supabase upload
     * Format: 50MB, 100MB, etc.
     */
    @Value("${file.upload.max-size:100MB}")
    private String maxFileSize;

    /**
     * Allowed File MIME Types
     * Comma-separated list of acceptable content types
     * Enforced during file upload validation
     */
    @Value("${file.upload.allowed-types}")
    private String allowedFileTypes;

    /**
     * RestTemplate Bean for HTTP Requests
     * 
     * Provides HTTP client for making REST API calls to Supabase Storage.
     * Used by FileStorageService for upload, download, and delete operations.
     * 
     * @return Configured RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    // ======================================
    // Getters for Supabase Configuration
    // ======================================

    public String getSupabaseUrl() {
        return supabaseUrl;
    }

    public String getSupabaseKey() {
        return supabaseKey;
    }

    public String getStorageUrl() {
        return storageUrl;
    }

    public String getImagesBucketName() {
        return imagesBucketName;
    }

    public String getPreviewsBucketName() {
        return previewsBucketName;
    }

    public String getDigitalBucketName() {
        return digitalBucketName;
    }

    public String getMaxFileSize() {
        return maxFileSize;
    }

    public String getAllowedFileTypes() {
        return allowedFileTypes;
    }

    /**
     * Get Storage Endpoint for Bucket
     * 
     * Constructs full API endpoint for file operations in a specific bucket.
     * Format: https://<project-id>.supabase.co/storage/v1/object/<bucket-name>
     * 
     * @param bucketName Name of the bucket (images, previews, digital)
     * @return Full Storage API endpoint URL
     */
    public String getStorageEndpoint(String bucketName) {
        return storageUrl + "/object/" + bucketName;
    }

    /**
     * Get Public URL for File
     * 
     * Constructs public URL for accessing files in public buckets.
     * Only works for product-images and product-previews buckets.
     * 
     * Format: https://<project-id>.supabase.co/storage/v1/object/public/<bucket>/<path>
     * 
     * @param bucketName Bucket name (must be public)
     * @param filePath File path within bucket
     * @return Public URL for file access
     */
    public String getPublicUrl(String bucketName, String filePath) {
        return storageUrl + "/object/public/" + bucketName + "/" + filePath;
    }

    /**
     * Validate File Type
     * 
     * Checks if uploaded file MIME type is in allowed list.
     * Used in FileController before processing uploads.
     * 
     * @param contentType MIME type from uploaded file
     * @return true if allowed, false otherwise
     */
    public boolean isAllowedFileType(String contentType) {
        if (contentType == null || allowedFileTypes == null) {
            return false;
        }
        String[] allowed = allowedFileTypes.split(",");
        for (String type : allowed) {
            if (contentType.trim().equalsIgnoreCase(type.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Parse Max File Size to Bytes
     * 
     * Converts max-size string (e.g., "50MB") to bytes for validation.
     * Supports: KB, MB, GB suffixes
     * 
     * @return Maximum file size in bytes
     */
    public long getMaxFileSizeBytes() {
        if (maxFileSize == null) {
            return 100 * 1024 * 1024; // Default 100MB
        }
        
        String size = maxFileSize.toUpperCase().trim();
        long multiplier = 1;
        
        if (size.endsWith("GB")) {
            multiplier = 1024 * 1024 * 1024;
            size = size.substring(0, size.length() - 2);
        } else if (size.endsWith("MB")) {
            multiplier = 1024 * 1024;
            size = size.substring(0, size.length() - 2);
        } else if (size.endsWith("KB")) {
            multiplier = 1024;
            size = size.substring(0, size.length() - 2);
        }
        
        try {
            return Long.parseLong(size.trim()) * multiplier;
        } catch (NumberFormatException e) {
            return 100 * 1024 * 1024; // Default 100MB on error
        }
    }
}
