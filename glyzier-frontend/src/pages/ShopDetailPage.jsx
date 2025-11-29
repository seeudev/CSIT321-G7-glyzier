/**
 * ShopDetailPage Component (Module 15 - Public Shop Pages)
 * 
 * This page displays a public shop page for a specific seller.
 * Users can:
 * - View seller information (shop name, bio, product count)
 * - Browse all products from this seller
 * - Click on products to view details
 * 
 * Route: /shops/:sid (public - no authentication required)
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 15)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import FavoriteButton from '../components/FavoriteButton';
import { getSellerById } from '../services/sellerService';
import styles from '../styles/pages/ShopDetailPage.module.css';
import buttons from '../styles/shared/buttons.module.css';

/**
 * ShopDetailPage functional component
 * 
 * Fetches seller information and displays their shop page.
 * Shows seller details and a grid of their products.
 * 
 * @returns {JSX.Element} Shop detail page
 */
function ShopDetailPage() {
  const { sid } = useParams(); // Get seller ID from URL
  const navigate = useNavigate();
  
  // Component state
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch seller data on component mount
   * Uses the seller ID from the URL params
   */
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);
        const data = await getSellerById(sid);
        setSeller(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch seller:', err);
        setError('Failed to load shop. Seller may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sid]);

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>Loading shop...</div>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error || !seller) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || 'Shop not found'}</p>
            <button 
              className={buttons.primaryButton}
              onClick={() => navigate('/shops')}
            >
              Back to All Shops
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Shop Banner Header */}
        <div className={styles.shopBanner}>
          <h1 className={styles.shopTitle}>Sellers Shop</h1>
          <p className={styles.shopSubtitle}>{seller.sellername}</p>
        </div>

        {/* About Section */}
        <div className={styles.aboutSection}>
          <div className={styles.aboutCard}>
            <h2 className={styles.sectionTitle}>About the seller</h2>
            {seller.storebio ? (
              <p className={styles.aboutText}>{seller.storebio}</p>
            ) : (
              <p className={styles.aboutTextPlaceholder}>
                No description provided by this seller.
              </p>
            )}
            <div className={styles.shopMetadata}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Joined:</span>
                <span className={styles.metaValue}>
                  {seller.createdAt ? new Date(seller.createdAt).getFullYear() : 'N/A'}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Products:</span>
                <span className={styles.metaValue}>{seller.productCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className={styles.productsSection}>
          <h2 className={styles.productsSectionTitle}>Shop Products</h2>
          
          {seller.products && seller.products.length > 0 ? (
            <div className={styles.productGrid}>
              {seller.products.map((product) => (
                <div key={product.pid} className={styles.productCard}>
                  <Link to={`/products/${product.pid}`} className={styles.productLink}>
                    <div className={styles.productImageContainer}>
                      {product.screenshotPreviewUrl ? (
                        <img 
                          src={product.screenshotPreviewUrl} 
                          alt={product.productname}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.productImagePlaceholder}>
                          No Image
                        </div>
                      )}
                      
                      {/* Favorite button overlay */}
                      <div className={styles.favoriteButtonOverlay}>
                        <FavoriteButton 
                          productId={product.pid}
                          size="medium"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.productname}</h3>
                      <p className={styles.productType}>{product.type}</p>
                      <p className={styles.productPrice}>${product.price}</p>
                      <p className={styles.productStatus}>{product.status}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noProducts}>
              <p>This shop doesn't have any products yet.</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <button 
            className={buttons.secondaryButton}
            onClick={() => navigate('/shops')}
          >
            ← Back to All Shops
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopDetailPage;
