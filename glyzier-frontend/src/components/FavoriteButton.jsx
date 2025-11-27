import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkFavoriteStatus, toggleFavorite } from '../services/favoritesService';
import styles from '../styles/components/FavoriteButton.module.css';

/**
 * FavoriteButton Component
 * 
 * Reusable heart icon button for adding/removing products from favorites.
 * Features:
 * - Animated heart icon that fills when favorited
 * - Automatically checks favorite status on mount
 * - Toggle functionality (add/remove)
 * - Login redirect for unauthenticated users
 * - Loading state during API calls
 * - Tooltip feedback
 * 
 * Usage:
 * <FavoriteButton productId={product.pid} />
 * 
 * Module 10: Favorites/Wishlist System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
const FavoriteButton = ({ productId, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  /**
   * Check favorite status on mount (only if authenticated)
   */
  useEffect(() => {
    if (isAuthenticated && productId) {
      checkStatus();
    }
  }, [isAuthenticated, productId]);
  
  /**
   * Check if product is currently favorited
   */
  const checkStatus = async () => {
    try {
      const status = await checkFavoriteStatus(productId);
      setIsFavorited(status);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };
  
  /**
   * Handle favorite button click
   * Redirects to login if not authenticated
   * Toggles favorite status if authenticated
   */
  const handleClick = async (e) => {
    e.preventDefault(); // Prevent parent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Toggle favorite status
      await toggleFavorite(productId, isFavorited);
      
      // Update local state
      setIsFavorited(!isFavorited);
      
      // Show tooltip feedback
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`${styles.favoriteButtonContainer} ${className}`}>
      <button
        className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''} ${isLoading ? styles.loading : ''}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={styles.heartIcon}
          viewBox="0 0 24 24"
          fill={isFavorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>
      
      {/* Tooltip Feedback */}
      {showTooltip && (
        <div className={styles.tooltip}>
          {isFavorited ? 'Added to favorites!' : 'Removed from favorites'}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;
