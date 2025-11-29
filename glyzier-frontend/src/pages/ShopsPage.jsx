/**
 * ShopsPage Component (Module 15 - Public Shop Pages)
 * 
 * This page displays a list of all seller shops on Glyzier.
 * Users can browse all shops and click on them to view shop details.
 * 
 * Features:
 * - 2-column card layout following wireframe design
 * - Shop name, seller name (user displayname)
 * - Product carousel preview (4-5 products)
 * - Click to navigate to shop detail page
 * 
 * Route: /shops (public - no authentication required)
 * 
 * @author Glyzier Team
 * @version 2.0 (Module 15 - Implementation)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { getAllSellers } from '../services/sellerService';
import { createOrGetConversation } from '../services/messageService';
import { showSuccess, showError, showInfo } from '../components/NotificationManager';
import styles from '../styles/pages/ShopsPage.module.css';

/**
 * ShopsPage functional component
 * 
 * Fetches all sellers and displays them in a 2-column card layout.
 * Each shop card shows a carousel of products and is clickable.
 * 
 * @returns {JSX.Element} All shops page
 */
function ShopsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Component state
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [contactingLoading, setContactingLoading] = useState({});

  /**
   * Fetch all sellers on component mount
   */
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const data = await getAllSellers();
        setSellers(data);
        // Initialize carousel indexes for each seller
        const indexes = {};
        data.forEach(seller => {
          indexes[seller.sid] = 0;
        });
        setCarouselIndexes(indexes);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch sellers:', err);
        setError('Failed to load shops. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  /**
   * Handle shop card click
   * Navigate to shop detail page
   */
  const handleShopClick = (sid) => {
    navigate(`/shops/${sid}`);
  };

  /**
   * Handle carousel navigation
   */
  const handleCarouselNav = (sellerId, direction, productsLength, e) => {
    e.stopPropagation(); // Prevent card click
    setCarouselIndexes(prev => {
      const currentIndex = prev[sellerId] || 0;
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % productsLength;
      } else {
        newIndex = currentIndex === 0 ? productsLength - 1 : currentIndex - 1;
      }
      return { ...prev, [sellerId]: newIndex };
    });
  };

  /**
   * Handle contacting seller
   * Creates or gets existing conversation and navigates to message thread
   */
  const handleContactSeller = async (sellerUserId, sellerName, e) => {
    e.stopPropagation(); // Prevent card click

    // Check authentication
    if (!isAuthenticated) {
      showInfo('Please login to contact sellers');
      navigate('/login');
      return;
    }

    try {
      setContactingLoading(prev => ({ ...prev, [sellerUserId]: true }));
      
      // Create or get conversation
      const conversation = await createOrGetConversation(sellerUserId);
      
      // Navigate to message thread
      navigate(`/messages/${conversation.id}`);
      showSuccess(`Opening conversation with ${sellerName}`);
      
    } catch (error) {
      console.error('Error contacting seller:', error);
      showError(error.response?.data?.error || 'Failed to contact seller');
    } finally {
      setContactingLoading(prev => ({ ...prev, [sellerUserId]: false }));
    }
  };

  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>All Shops</h1>
          <p className={styles.subtitle}>
            Browse all seller shops on Glyzier and discover amazing art
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>Loading shops...</div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* Shops Grid - 2 Column Layout */}
        {!loading && !error && sellers.length > 0 && (
          <div className={styles.shopsGrid}>
            {sellers.map((seller) => {
              const allProducts = seller.products || [];
              const currentIndex = carouselIndexes[seller.sid] || 0;
              
              // Get 4 products to display, wrapping around if necessary
              const getVisibleProducts = () => {
                if (allProducts.length === 0) return [];
                if (allProducts.length <= 4) return allProducts;
                
                const visible = [];
                for (let i = 0; i < 4; i++) {
                  const index = (currentIndex + i) % allProducts.length;
                  visible.push(allProducts[index]);
                }
                return visible;
              };
              
              const visibleProducts = getVisibleProducts();
              const hasMultipleProducts = allProducts.length > 4;
              
              return (
                <div 
                  key={seller.sid} 
                  className={styles.shopCard}
                  onClick={() => handleShopClick(seller.sid)}
                >
                  {/* Shop Header */}
                  <div className={styles.shopHeader}>
                    <h2 className={styles.shopName}>{seller.sellername}</h2>
                    <p className={styles.sellerName}>{seller.userDisplayName}</p>
                    
                    {/* Contact Seller Button */}
                    <button
                      className={styles.contactButton}
                      onClick={(e) => handleContactSeller(seller.userid, seller.sellername, e)}
                      disabled={contactingLoading[seller.userid]}
                      aria-label="Contact seller"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {contactingLoading[seller.userid] ? 'Contacting...' : 'Contact Seller'}
                    </button>
                  </div>
                  
                  {/* Product Carousel */}
                  <div className={styles.productCarousel}>
                    {allProducts.length > 0 ? (
                      <>
                        <div className={styles.carouselTrack}>
                          {visibleProducts.map((product, idx) => (
                            <div key={`${product.pid}-${idx}`} className={styles.carouselItem}>
                              {product.screenshotPreviewUrl ? (
                                <img 
                                  src={product.screenshotPreviewUrl} 
                                  alt={product.productname}
                                  className={styles.carouselImage}
                                />
                              ) : (
                                <div className={styles.carouselImagePlaceholder}>
                                  {product.productname}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Carousel Navigation - Only show if more than 4 products */}
                        {hasMultipleProducts && (
                          <>
                            <button 
                              className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                              onClick={(e) => handleCarouselNav(seller.sid, 'prev', allProducts.length, e)}
                              aria-label="Previous products"
                              type="button"
                            >
                              ‹
                            </button>
                            <button 
                              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                              onClick={(e) => handleCarouselNav(seller.sid, 'next', allProducts.length, e)}
                              aria-label="Next products"
                              type="button"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className={styles.noProducts}>
                        <p>No products yet</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sellers.length === 0 && (
          <div className={styles.empty}>
            <p>No shops found. Be the first to open a shop!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopsPage;
