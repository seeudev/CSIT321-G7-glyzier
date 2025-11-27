package com.glyzier.service;

import com.glyzier.dto.FavoriteProductResponse;
import com.glyzier.model.Favorites;
import com.glyzier.model.Products;
import com.glyzier.model.Users;
import com.glyzier.repository.FavoritesRepository;
import com.glyzier.repository.ProductsRepository;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * FavoritesService
 * 
 * Business logic for favorites/wishlist functionality.
 * Handles adding/removing favorites, checking status, and retrieving user's favorites.
 * Prevents duplicate favorites with composite unique constraint.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */
@Service
public class FavoritesService {
    
    @Autowired
    private FavoritesRepository favoritesRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductsRepository productsRepository;
    
    /**
     * Get all favorites for a user
     * Returns list of favorited products with full details
     * 
     * @param userEmail Email of the authenticated user
     * @return List of favorited products as DTOs
     * @throws RuntimeException if user not found
     */
    public List<FavoriteProductResponse> getUserFavorites(String userEmail) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Favorites> favorites = favoritesRepository.findByUser(user);
        
        return favorites.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Add a product to user's favorites
     * Prevents duplicates - returns existing favorite if already favorited
     * 
     * @param userEmail Email of the authenticated user
     * @param productId ID of the product to favorite
     * @return The created or existing favorite as DTO
     * @throws RuntimeException if user or product not found
     */
    @Transactional
    public FavoriteProductResponse addFavorite(String userEmail, Long productId) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        
        // Check if already favorited
        if (favoritesRepository.existsByUserAndProduct(user, product)) {
            // Return existing favorite
            Favorites existing = favoritesRepository.findByUserAndProduct(user, product)
                    .orElseThrow(() -> new RuntimeException("Favorite not found"));
            return mapToDTO(existing);
        }
        
        // Create new favorite
        Favorites favorite = new Favorites(user, product);
        Favorites saved = favoritesRepository.save(favorite);
        
        return mapToDTO(saved);
    }
    
    /**
     * Remove a product from user's favorites
     * 
     * @param userEmail Email of the authenticated user
     * @param productId ID of the product to unfavorite
     * @throws RuntimeException if user or product not found
     */
    @Transactional
    public void removeFavorite(String userEmail, Long productId) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        
        favoritesRepository.deleteByUserAndProduct(user, product);
    }
    
    /**
     * Check if a product is favorited by user
     * 
     * @param userEmail Email of the authenticated user
     * @param productId ID of the product to check
     * @return true if favorited, false otherwise
     * @throws RuntimeException if user not found
     */
    public boolean isFavorited(String userEmail, Long productId) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Products product = productsRepository.findById(productId).orElse(null);
        if (product == null) {
            return false;
        }
        
        return favoritesRepository.existsByUserAndProduct(user, product);
    }
    
    /**
     * Get count of user's favorites
     * 
     * @param userEmail Email of the authenticated user
     * @return Count of favorited products
     * @throws RuntimeException if user not found
     */
    public long getFavoritesCount(String userEmail) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return favoritesRepository.countByUser(user);
    }
    
    /**
     * Helper method to map Favorites entity to DTO
     * Extracts product and seller information
     * 
     * @param favorite The favorite entity
     * @return DTO with product details
     */
    private FavoriteProductResponse mapToDTO(Favorites favorite) {
        Products product = favorite.getProduct();
        
        // Get screenshot preview URL (first screenshot or null)
        String previewUrl = null;
        if (product.getProductFiles() != null && !product.getProductFiles().isEmpty()) {
            previewUrl = product.getProductFiles().get(0).getFileKey();
        }
        
        return new FavoriteProductResponse(
                favorite.getFavid(),
                product.getPid(),
                product.getProductname(),
                product.getProductdesc(),
                product.getPrice(),
                product.getType(),
                product.getStatus(),
                previewUrl,
                product.getSeller().getSellername(),
                product.getSeller().getSid(),
                favorite.getFavoritedAt()
        );
    }
}
