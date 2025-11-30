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
import Aurora from '../components/Aurora';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../context/AuthContext';
import { getSellerById } from '../services/sellerService';
import { createOrGetConversation } from '../services/messageService';
import { showSuccess, showError, showInfo } from '../components/NotificationManager';
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
  const { isAuthenticated, user } = useAuth(); // Module 19: Extract user for ownership checks
  
  // Component state
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactingLoading, setContactingLoading] = useState(false);
  
  /**
   * Helper function to check ownership (Module 19)
   * @param {Object} product - Product object with sellerId
   * @returns {boolean} - True if current user owns the product
   */
  const isOwnerOfProduct = (product) => {
    return user && product.sellerId && user.uid === product.sellerId;
  };

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
   * Handle Contact Seller button click
   * 
   * Creates or gets an existing conversation with the seller,
   * then redirects to the message thread page.
   */
  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to contact the seller');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (contactingLoading || !seller) return;

    // Get seller's user ID
    const sellerUserId = seller.userid;
    if (!sellerUserId) {
      showError('Unable to contact seller. Seller information not available.');
      return;
    }

    try {
      setContactingLoading(true);
      
      // Create or get conversation with the seller
      const conversation = await createOrGetConversation(sellerUserId);
      
      showSuccess('Opening conversation...');
      
      // Redirect to the message thread
      setTimeout(() => navigate(`/messages/${conversation.id}`), 500);
    } catch (err) {
      console.error('Error contacting seller:', err);
      const errorMessage = err.response?.data?.error || 'Failed to start conversation. Please try again.';
      showError(errorMessage);
    } finally {
      setContactingLoading(false);
    }
  };

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
      <Aurora 
        colorStops={['#667eea', '#764ba2', '#f093fb']}
        amplitude={1.2}
        blend={0.6}
        speed={0.4}
      />
      <Navigation />
      
      <div className={styles.container}>
        {/* Shop Header - Glass Card */}
        <div className={styles.headerCard}>
          <div className={styles.shopAvatar}>
            {seller.sellername.charAt(0).toUpperCase()}
          </div>
          <h1 className={styles.shopTitle}>{seller.sellername}</h1>
          <p className={styles.shopSubtitle}>Artist Shop</p>
        </div>

        {/* About Section - 80/20 Split */}
        <div className={styles.aboutSection}>
          {/* Left: About Card (80%) */}
          <div className={styles.aboutCard}>
            <h2 className={styles.sectionTitle}>About the Seller</h2>
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

          {/* Right: Contact Card (20%) */}
          {user && user.uid !== seller.userid && (
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Get in Touch</h3>
              <p className={styles.contactDescription}>
                Have questions about products or commissions?
              </p>
              <button
                className={styles.contactButton}
                onClick={handleContactSeller}
                disabled={contactingLoading}
              >
                {contactingLoading ? (
                  <>
                    <span className={styles.buttonSpinner}></span>
                    Opening...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>
                    </svg>
                    Contact Seller
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Products Section - Glass Card */}
        <div className={styles.productsSection}>
          <h2 className={styles.productsSectionTitle}>
            <span className={styles.titleIcon}>🎨</span>
            Shop Products
          </h2>
          
          {seller.products && seller.products.length > 0 ? (
            <div className={styles.productGrid}>
              {seller.products.map((product) => {
                const isOwner = isOwnerOfProduct(product);
                return (
                  <div 
                    key={product.pid} 
                    className={`${styles.productCard} ${isOwner ? styles.ownProduct : ''}`}
                  >
                    {/* Owner badge - Module 19 */}
                    {isOwner && (
                      <div className={styles.ownerBadgeSmall}>
                        Your Product
                      </div>
                    )}
                    
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
                        
                        {/* Favorite button overlay - Module 10, Module 19: Disabled for owners */}
                        <div className={styles.favoriteButtonOverlay}>
                          <FavoriteButton 
                            productId={product.pid}
                            size="medium"
                            disabled={isOwner}
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
                );
              })}
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
            className={styles.backButton}
            onClick={() => navigate('/shops')}
          >
            <span className={styles.backArrow}>←</span>
            Back to All Shops
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopDetailPage;
