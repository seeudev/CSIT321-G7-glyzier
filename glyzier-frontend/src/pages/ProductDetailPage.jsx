/**
 * ProductDetailPage Component
 * 
 * This page displays detailed information about a specific product.
 * It is accessible to all users (authenticated or not).
 * 
 * Features:
 * - Fetches and displays product details using the product ID from URL params
 * - Shows product name, description, price, and seller information
 * - Displays simulated product image placeholder
 * - Includes a "Buy Now" button (functionality to be implemented in Module 8)
 * - Provides a link to view the seller's shop
 * 
 * URL: /products/:pid
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 7)
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useAuth } from '../context/AuthContext';

/**
 * ProductDetailPage functional component
 * 
 * @returns {JSX.Element} The product detail page component
 */
function ProductDetailPage() {
  // Get the product ID from URL parameters
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Fetch product details on component mount or when pid changes
   * 
   * Uses the getProductById function from productService
   * to fetch detailed information about the product.
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(pid);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. The product may not exist.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [pid]); // Re-fetch if product ID changes
  
  /**
   * Handle Buy Now button click
   * 
   * In Module 7, this is just a placeholder.
   * In Module 8, this will be wired to the order placement functionality.
   * For now, it checks authentication and shows an alert.
   */
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      alert('Please login to purchase products.');
      navigate('/login');
    } else {
      // Placeholder for Module 8
      alert('Order functionality will be implemented in Module 8!');
    }
  };
  
  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }
  
  /**
   * Render error state
   */
  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={{...styles.message, color: '#d32f2f'}}>
          <p>{error || 'Product not found'}</p>
          <Link to="/" style={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  /**
   * Render product details
   */
  return (
    <div style={styles.container}>
      {/* Breadcrumb navigation */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Home</Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{product.productname}</span>
      </div>
      
      <div style={styles.productContainer}>
        {/* Product Image Section */}
        <div style={styles.imageSection}>
          <div style={styles.productImage}>
            <span style={styles.imagePlaceholder}>🎨</span>
            <p style={styles.imageText}>Product Image</p>
            <p style={styles.imageSubtext}>
              (Simulated - In a real app, this would show the actual product image)
            </p>
          </div>
        </div>
        
        {/* Product Information Section */}
        <div style={styles.infoSection}>
          <h1 style={styles.productName}>{product.productname}</h1>
          
          {/* Seller Information */}
          <div style={styles.sellerInfo}>
            <p style={styles.sellerLabel}>Sold by:</p>
            <Link 
              to={`/sellers/${product.sid}`} 
              style={styles.sellerLink}
            >
              {product.sellerDisplayname || 'Unknown Seller'}
            </Link>
          </div>
          
          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.price}>₱{product.price.toFixed(2)}</span>
          </div>
          
          {/* Description */}
          <div style={styles.descriptionSection}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <p style={styles.description}>
              {product.productdescription || 'No description provided for this product.'}
            </p>
          </div>
          
          {/* Product Details */}
          <div style={styles.detailsSection}>
            <h2 style={styles.sectionTitle}>Product Details</h2>
            <div style={styles.detailsList}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Category:</span>
                <span style={styles.detailValue}>{product.category || 'Uncategorized'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Product ID:</span>
                <span style={styles.detailValue}>#{product.pid}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Availability:</span>
                <span style={styles.detailValue}>
                  {product.stockQuantity > 0 
                    ? `In Stock (${product.stockQuantity} available)` 
                    : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={styles.actionSection}>
            <button 
              onClick={handleBuyNow}
              style={styles.buyButton}
              disabled={!product.stockQuantity || product.stockQuantity <= 0}
            >
              {product.stockQuantity > 0 ? '🛒 Buy Now' : 'Out of Stock'}
            </button>
            
            {!isAuthenticated && (
              <p style={styles.loginNote}>
                * You must be logged in to purchase
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles for the component
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  message: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '1.2em',
    color: '#666',
  },
  backButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1em',
  },
  breadcrumb: {
    marginBottom: '30px',
    fontSize: '0.95em',
    color: '#666',
  },
  breadcrumbLink: {
    color: '#667eea',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    margin: '0 10px',
    color: '#999',
  },
  breadcrumbCurrent: {
    color: '#333',
  },
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  imageSection: {
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
  },
  productImage: {
    height: '500px',
    background: 'linear-gradient(135deg, #b8afe8 0%, #9b8dd4 100%)',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  imagePlaceholder: {
    fontSize: '6em',
    marginBottom: '20px',
  },
  imageText: {
    fontSize: '1.5em',
    fontWeight: '600',
    marginBottom: '10px',
  },
  imageSubtext: {
    fontSize: '0.9em',
    opacity: 0.8,
    textAlign: 'center',
    padding: '0 20px',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  productName: {
    fontSize: '2.5em',
    marginBottom: '20px',
    color: '#2c3e50',
    fontWeight: '700',
  },
  sellerInfo: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  sellerLabel: {
    fontSize: '0.95em',
    color: '#7f8c8d',
    marginBottom: '5px',
  },
  sellerLink: {
    fontSize: '1.1em',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: '30px',
  },
  price: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#667eea',
  },
  descriptionSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.3em',
    marginBottom: '15px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  description: {
    fontSize: '1.05em',
    lineHeight: '1.7',
    color: '#555',
  },
  detailsSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    color: '#777',
  },
  actionSection: {
    marginTop: '30px',
  },
  buyButton: {
    width: '100%',
    padding: '18px',
    fontSize: '1.3em',
    fontWeight: 'bold',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loginNote: {
    marginTop: '15px',
    fontSize: '0.9em',
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};

export default ProductDetailPage;
