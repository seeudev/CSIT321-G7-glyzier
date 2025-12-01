/**
 * ProductDetailPage Component
 * 
 * Product detail page with elegant animations and real database data.
 * Features:
 * - Modern glassmorphism design with fade-in animations
 * - Seller name and shop name display
 * - Product description
 * - Real stock information from database
 * - Beautiful notification system instead of alerts
 * - Smooth transitions and loading states
 * 
 * @author Glyzier Team
 * @version 3.0 (Module 9 - Enhanced UX)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, checkPurchaseStatus } from '../services/productService';
import { addToCart } from '../services/cartService';
import { createOrGetConversation } from '../services/messageService';
import fileService from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { showSuccess, showError, showInfo, showConfirm } from '../components/NotificationManager';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import FavoriteButton from '../components/FavoriteButton';
import { extractColorsFromImage, enhanceColorsForAurora } from '../utils/colorExtractor';
import styles from '../styles/pages/ProductDetailPage.module.css';

function ProductDetailPage() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Extract user for ownership checks
  const { updateCartCount } = useCart();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [contactingLoading, setContactingLoading] = useState(false);
  const [auroraColors, setAuroraColors] = useState(['#c9bfe8', '#b8afe8', '#9b8dd4']);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Check if current user owns this product
  const [productFiles, setProductFiles] = useState([]); // Product files (Module 20)
  const [downloadLoading, setDownloadLoading] = useState(false); // Download state (Module 20)
  const [hasPurchased, setHasPurchased] = useState(false); // Check if user purchased this product
  const [checkingPurchase, setCheckingPurchase] = useState(false); // Loading state for purchase check
  
  /**
   * Fetch product details on component mount
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setImageLoaded(false);
        const data = await getProductById(pid);
        console.log('Product data received:', data);
        setProduct(data);
        
        // Check if current user owns this product (Module 19: Ownership guard)
        if (user && data.sellerId) {
          setIsOwner(user.uid === data.sellerId);
        } else {
          setIsOwner(false);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. The product may not exist.');
        showError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [pid, user]); // Add user to dependency array for ownership checks

  /**
   * Check if user has purchased this product (Module 20 Enhancement)
   * Required for showing download button and preventing re-purchase
   */
  useEffect(() => {
    const checkPurchase = async () => {
      if (isAuthenticated && product && product.type === 'Digital' && !isOwner) {
        try {
          setCheckingPurchase(true);
          const response = await checkPurchaseStatus(pid);
          setHasPurchased(response.purchased);
        } catch (err) {
          console.error('Failed to check purchase status:', err);
          setHasPurchased(false);
        } finally {
          setCheckingPurchase(false);
        }
      }
    };
    
    checkPurchase();
  }, [isAuthenticated, product, pid, isOwner]);

  /**
   * Fetch product files (Module 20)
   * Loads digital download files for purchased products
   */
  useEffect(() => {
    const fetchProductFiles = async () => {
      if (product && product.type === 'Digital') {
        try {
          const response = await fileService.getProductFiles(pid);
          setProductFiles(response.files || []);
        } catch (err) {
          console.error('Failed to fetch product files:', err);
          // Silent fail - files are optional
        }
      }
    };
    
    fetchProductFiles();
  }, [product, pid]);

  /**
   * Update Aurora colors when product image loads
   */
  useEffect(() => {
    const updateAuroraColors = async () => {
      if (product?.screenshotPreviewUrl && imageLoaded) {
        const extractedColors = await extractColorsFromImage(product.screenshotPreviewUrl);
        const enhancedColors = enhanceColorsForAurora(extractedColors);
        setAuroraColors(enhancedColors);
      }
    };
    
    updateAuroraColors();
  }, [product, imageLoaded]);
  
  /**
   * Handle Add to Cart button click
   */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to add items to your cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    if (cartLoading) return;
    
    try {
      setCartLoading(true);
      await addToCart(product.pid, 1);
      await updateCartCount();
      
      showSuccess(`${product.productname} added to cart!`);
      
      // Ask if user wants to go to cart
      const goToCart = await showConfirm('Would you like to view your cart?');
      if (goToCart) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      showError(errorMessage);
    } finally {
      setCartLoading(false);
    }
  };

  /**
   * Handle Buy Now button click (Module 12: Updated for checkout flow)
   * Adds product to cart and redirects to checkout page
   */
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to purchase products');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    if (orderLoading) return;
    
    try {
      setOrderLoading(true);
      
      // Add product to cart
      await addToCart(product.pid, 1);
      await updateCartCount();
      
      showSuccess('Added to cart! Redirecting to checkout...');
      
      // Redirect to checkout page
      setTimeout(() => navigate('/checkout'), 1000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      showError(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  };

  /**
   * Handle Download Digital Product (Module 20)
   * 
   * Downloads digital product file after purchase verification.
   * Backend validates that user purchased the product before
   * generating signed download URL.
   * 
   * Logic:
   * - Check authentication
   * - Find digital_download file
   * - Request signed URL from backend (with purchase check)
   * - Trigger browser download
   */
  const handleDownload = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to download');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (downloadLoading) return;

    // Find digital download file
    const downloadFile = productFiles.find(f => f.fileType === 'digital_download');
    if (!downloadFile) {
      showError('Download file not available');
      return;
    }

    try {
      setDownloadLoading(true);
      
      // Download file (backend checks purchase)
      await fileService.downloadFile(downloadFile.fileId, `${product.productname} - Digital Download`);
      
      showSuccess('Download started!');
    } catch (err) {
      console.error('Download error:', err);
      
      // Handle specific error messages
      if (err.toString().includes('must purchase')) {
        showError('You must purchase this product to download it');
      } else {
        showError('Failed to download file. Please try again.');
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  /**
   * Handle Contact Seller button click (Module 16: Messaging)
   * 
   * Creates or gets an existing conversation with the seller,
   * then redirects to the message thread page.
   * 
   * Logic:
   * - Check if user is authenticated
   * - Get seller's user ID from product data
   * - Call API to create/get conversation
   * - Redirect to message thread
   */
  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to contact the seller');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (contactingLoading) return;

    // Get seller's user ID from the product data
    const sellerUserId = product.sellerUserId;
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
   * Render loading state
   */
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>⏳ Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  /**
   * Render error state
   */
  if (error || !product) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || 'Product not found'}</p>
            <a href="/" className={styles.backButton}>
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Backend sends 'unlimited' field (Jackson removes 'is' prefix from boolean fields)
  const isUnlimited = product.unlimited === true || product.isUnlimited === true;
  const isOutOfStock = !isUnlimited && (!product.availableQuantity || product.availableQuantity <= 0);
  
  return (
    <div className={styles.page}>
      <Aurora 
        colorStops={auroraColors}
        amplitude={1.0}
        blend={0.5}
        speed={0.3}
      />
      <Navigation />
      
      <div className={styles.container}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButtonTop}
          aria-label="Go back to previous page"
        >
          <span className={styles.backArrow}>←</span>
          <span className={styles.backText}>Back</span>
        </button>
        
        <div className={styles.productLayout}>
          {/* Left Side - Product Image */}
          <div className={styles.imageSection}>
            <div className={`${styles.productImage} ${imageLoaded ? styles.imageLoaded : ''}`}>
              {product.screenshotPreviewUrl ? (
                <img 
                  src={product.screenshotPreviewUrl} 
                  alt={product.productname}
                  onLoad={() => setImageLoaded(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span style={{ fontSize: '4rem' }}>🖼️</span>
                  <p>No Image Available</p>
                </div>
              )}
              
              {/* Favorite Button - Module 10, Module 19: Disabled for owners */}
              <FavoriteButton 
                productId={product.pid} 
                className={styles.favoriteButtonOverlay}
                disabled={isOwner}
              />
            </div>
          </div>
          
          {/* Right Side - Product Information */}
          <div className={styles.infoSection}>
            {/* Seller & Shop Name - Clickable */}
            <div className={styles.sellerInfo}>
              {product.sellerId ? (
                <>
                  <div 
                    className={`${styles.sellerLabel} ${styles.clickable}`}
                    onClick={() => navigate(`/shops/${product.sellerId}`)}
                    title="View seller shop"
                  >
                    {product.sellerDisplayName || 'Unknown Seller'}
                  </div>
                  <div 
                    className={`${styles.shopName} ${styles.clickable}`}
                    onClick={() => navigate(`/shops/${product.sellerId}`)}
                    title="Visit shop"
                  >
                    {product.sellerName || 'Unknown Shop'}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.sellerLabel}>
                    {product.sellerDisplayName || 'Unknown Seller'}
                  </div>
                  <div className={styles.shopName}>{product.sellerName || 'Unknown Shop'}</div>
                </>
              )}
            </div>
            
            {/* Product Name & Owner Badge */}
            <div className={styles.productHeader}>
              <h1 className={styles.productName}>{product.productname}</h1>
              
              {/* Owner badge - Module 19 */}
              {isOwner && (
                <div className={styles.ownerBadge}>
                  <svg className={styles.badgeIcon} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                  You manage this listing
                </div>
              )}
            </div>
            
            {/* Price */}
            <div className={styles.priceSection}>
              <span className={styles.price}>$ {product.price ? product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
              <span className={styles.productType}>{product.type}</span>
            </div>
            
            {/* Product Description */}
            <div className={styles.descriptionSection}>
              <div className={styles.descriptionTitle}>Product Description:</div>
              <div className={styles.descriptionText}>
                {product.productdesc || 'No description available for this product.'}
              </div>
            </div>
            
            {/* Stock Status */}
            <div className={styles.stockSection}>
              <span className={`${styles.stockBadge} ${isOutOfStock ? styles.outOfStock : styles.inStock}`}>
                {isOutOfStock ? '❌ Out of Stock' : isUnlimited ? '✓ Unlimited' : `✓ In Stock (${product.availableQuantity} available)`}
              </span>
            </div>
            
            {/* Action Buttons - Conditional rendering based on purchase status */}
            {product && product.type === 'Digital' && hasPurchased && productFiles.length > 0 ? (
              // Show download button for purchased digital products
              <div className={styles.actionSection}>
                <button 
                  onClick={handleDownload}
                  className={styles.downloadButton}
                  disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <>⏳ Preparing Download...</>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Digital Product
                    </>
                  )}
                </button>
                <p className={styles.purchasedNote}>
                  ✅ You own this digital product
                </p>
              </div>
            ) : (
              // Show purchase buttons for non-purchased or physical products
              <div className={styles.actionSection}>
                <button 
                  onClick={handleAddToCart}
                  className={styles.addToCartButton}
                  disabled={cartLoading || isOutOfStock || isOwner || (product?.type === 'Digital' && hasPurchased)}
                >
                  {cartLoading ? '⏳ Adding...' : 
                   isOwner ? 'Your Product' : 
                   (product?.type === 'Digital' && hasPurchased) ? 'Already Purchased' : 
                   'Add to Cart'}
                </button>

                <button 
                  onClick={handleBuyNow}
                  className={styles.buyNowButton}
                  disabled={orderLoading || isOutOfStock || isOwner || (product?.type === 'Digital' && hasPurchased)}
                >
                  {orderLoading ? '⏳ Processing...' : 
                   isOwner ? 'Your Product' : 
                   (product?.type === 'Digital' && hasPurchased) ? 'Already Purchased' : 
                   'Buy Now'}
                </button>
              </div>
            )}
            
            {!isAuthenticated && (
              <p className={styles.loginNote}>
                * You must be logged in to add to cart or purchase
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Contact Seller Button - Module 16, Module 19: Hidden for owners */}
      {product && product.sellerUserId && !isOwner && (
        <button
          className={styles.floatingContactButton}
          onClick={handleContactSeller}
          disabled={contactingLoading}
          title="Contact Seller"
        >
          {contactingLoading ? (
            <span>⏳</span>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>
              </svg>
              <span className={styles.floatingButtonText}>Contact Seller</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default ProductDetailPage;
