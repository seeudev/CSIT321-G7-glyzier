import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllFavorites, removeFromFavorites } from '../services/favoritesService';
import Navigation from '../components/Navigation';
import styles from '../styles/pages/FavoritesPage.module.css';

/**
 * FavoritesPage Component
 * 
 * Displays user's favorited/wishlisted products in a grid layout.
 * Features:
 * - Grid display of favorited products
 * - Remove from favorites functionality
 * - Product cards link to detail pages
 * - Empty state when no favorites
 * - Loading and error states
 * 
 * Module 10: Favorites/Wishlist System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  
  /**
   * Fetch favorites on component mount
   * Redirects to login if not authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchFavorites();
  }, [isAuthenticated, navigate]);
  
  /**
   * Fetch all user favorites from backend
   */
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllFavorites();
      console.log('Favorites data received:', data);
      console.log('Total favorites:', data?.length || 0);
      if (data && data.length > 0) {
        data.forEach((fav, index) => {
          console.log(`Favorite ${index + 1}:`, {
            pid: fav.pid,
            name: fav.productname,
            imageUrl: fav.screenshotPreviewUrl,
            hasImage: !!fav.screenshotPreviewUrl
          });
        });
      }
      setFavorites(data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Remove product from favorites
   * @param {number} productId - ID of product to remove
   * @param {Event} e - Click event (prevent card link navigation)
   */
  const handleRemoveFavorite = async (productId, e) => {
    e.preventDefault(); // Prevent navigation to product detail
    
    try {
      setRemovingId(productId);
      await removeFromFavorites(productId);
      
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.pid !== productId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove from favorites. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };
  
  /**
   * Format price for display (USD only)
   */
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '$0.00';
    return `$${Number(price).toFixed(2)}`;
  };
  
  /**
   * Truncate description text
   */
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className={styles.pageContainer}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your favorites...</p>
          </div>
        </div>
      </>
    );
  }
  
  // Error state
  if (error) {
    return (
      <>
        <Navigation />
        <div className={styles.pageContainer}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <span className={styles.backArrow}>←</span>
            <span>Back</span>
          </button>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={fetchFavorites} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <div className={styles.pageContainer}>
        {/* Back Button */}
        <button 
          className={styles.backButton} 
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <span className={styles.backArrow}>←</span>
          <span>Back</span>
        </button>
        
        {/* Page Header */}
        <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Favorites</h1>
        <p className={styles.pageSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>
      
      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>♥</div>
          <h2 className={styles.emptyTitle}>No favorites yet</h2>
          <p className={styles.emptyMessage}>
            Start exploring and add products to your wishlist!
          </p>
          <Link to="/" className={styles.browseButton}>
            Browse Products
          </Link>
        </div>
      ) : (
        // Products Grid
        <div className={styles.productsGrid}>
          {favorites.map((favorite) => (
            <div
              key={favorite.favid}
              className={styles.productCard}
            >
              {/* Remove Button - Top Right */}
              <button
                className={styles.removeButton}
                onClick={(e) => handleRemoveFavorite(favorite.pid, e)}
                disabled={removingId === favorite.pid}
                aria-label="Remove from favorites"
                title="Remove from favorites"
              >
                {removingId === favorite.pid ? (
                  <span className={styles.removingSpinner}>⏳</span>
                ) : (
                  <svg className={styles.trashIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                )}
              </button>
              
              {/* Product Image - Clickable */}
              <Link to={`/products/${favorite.pid}`} className={styles.imageContainer}>
                {favorite.screenshotPreviewUrl ? (
                  <img
                    src={favorite.screenshotPreviewUrl}
                    alt={favorite.productname}
                    className={styles.productImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>Product Photo</span>
                  </div>
                )}
              </Link>
              
              {/* Product Info - Clickable */}
              <Link to={`/products/${favorite.pid}`} className={styles.productInfo}>
                <h3 className={styles.productName}>{favorite.productname}</h3>
                
                <p className={styles.productDesc}>
                  {truncateText(favorite.productdesc, 80)}
                </p>
                
                <div className={styles.priceSection}>
                  <span className={styles.price}>{formatPrice(favorite.price)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
        </div>
      </>
    );
  };

export default FavoritesPage;
