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
   * Format price for display
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
            <Link
              key={favorite.favid}
              to={`/products/${favorite.pid}`}
              className={styles.productCard}
            >
              {/* Product Image */}
              <div className={styles.imageContainer}>
                {favorite.screenshotPreviewUrl ? (
                  <img
                    src={favorite.screenshotPreviewUrl}
                    alt={favorite.productname}
                    className={styles.productImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>No Image</span>
                  </div>
                )}
                
                {/* Remove Button */}
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
                    <span className={styles.heartIcon}>♥</span>
                  )}
                </button>
              </div>
              
              {/* Product Info */}
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{favorite.productname}</h3>
                
                <p className={styles.productDesc}>
                  {truncateText(favorite.productdesc)}
                </p>
                
                <div className={styles.productMeta}>
                  <span className={styles.category}>{favorite.category}</span>
                  <span className={styles.type}>{favorite.type}</span>
                </div>
                
                <div className={styles.productFooter}>
                  <span className={styles.price}>{formatPrice(favorite.price)}</span>
                  <span className={styles.seller}>by {favorite.sellerName}</span>
                </div>
                
                <div className={styles.statusBadge} data-status={favorite.status}>
                  {favorite.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
        </div>
      </>
    );
  };

export default FavoritesPage;
