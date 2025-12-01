package com.glyzier.repository;

import com.glyzier.model.ProductFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ProductFilesRepository - Spring Data JPA repository for ProductFiles entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the ProductFiles entity. Spring Data JPA automatically implements
 * this interface at runtime.
 * 
 * Enhanced in Module 20 with Supabase Storage integration methods.
 * 
 * @author Glyzier Team
 * @version 2.0 (Module 20 - Supabase Storage)
 */
@Repository
public interface ProductFilesRepository extends JpaRepository<ProductFiles, Long> {

    /**
     * Find all files associated with a specific product
     * This is useful for retrieving all images, previews, or downloadable files
     * for a product
     * 
     * Spring Data JPA automatically navigates the relationship:
     * SELECT * FROM product_files WHERE pid = ?
     * 
     * @param pid The product ID
     * @return List of files belonging to this product
     */
    List<ProductFiles> findByProductPid(Long pid);

    /**
     * Find files by product ID and file type
     * Useful for retrieving specific types of files
     * (e.g., only "product_image" files for display)
     * 
     * @param pid The product ID
     * @param fileType The file type to filter by
     * @return List of files matching both criteria
     */
    List<ProductFiles> findByProductPidAndFileType(Long pid, String fileType);

    /**
     * Delete all files associated with a specific product
     * Useful when removing a product and its associated files
     * 
     * @param pid The product ID
     */
    void deleteByProductPid(Long pid);
    
    /**
     * Find File by Storage Key
     * 
     * Retrieves file record by its unique Supabase Storage key.
     * Used when deleting files or generating signed URLs.
     * 
     * Storage Key Format: <bucket>/<productId>/<uuid>.<extension>
     * Example: digital-products/42/a1b2c3d4-e5f6.zip
     * 
     * @param fileKey Unique storage key in Supabase bucket
     * @return Optional ProductFiles record if found
     */
    Optional<ProductFiles> findByFileKey(String fileKey);
    
    /**
     * Count Files by Product and Type
     * 
     * Returns the number of files of a specific type for a product.
     * Used to enforce upload limits:
     * - product_image: Max 5 images per product
     * - preview: Max 1 preview per product
     * - digital_download: Max 1 download file per product
     * 
     * @param pid Product ID to count files for
     * @param fileType File type to count
     * @return Number of files matching the criteria
     */
    long countByProductPidAndFileType(Long pid, String fileType);
}
