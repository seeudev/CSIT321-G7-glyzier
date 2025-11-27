package com.glyzier.dto;

/**
 * FavoriteStatusResponse DTO
 * 
 * Simple response indicating if a product is favorited by the user.
 * Used for checking favorite status.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */
public class FavoriteStatusResponse {
    
    private boolean isFavorited;
    private Long productId;
    
    public FavoriteStatusResponse() {}
    
    public FavoriteStatusResponse(boolean isFavorited, Long productId) {
        this.isFavorited = isFavorited;
        this.productId = productId;
    }
    
    public boolean isFavorited() {
        return isFavorited;
    }
    
    public void setFavorited(boolean favorited) {
        isFavorited = favorited;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
