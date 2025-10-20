package com.glyzier.repository;

import com.glyzier.model.ProductFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ProductFilesRepository - Spring Data JPA repository for ProductFiles entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the ProductFiles entity. Spring Data JPA automatically implements
 * this interface at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0
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
}
