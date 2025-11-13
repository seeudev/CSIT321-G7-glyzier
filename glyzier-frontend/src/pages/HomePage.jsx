/**
 * HomePage Component
 * 
 * Landing page of the Glyzier application based on UI wireframes.
 * Features:
 * - Navigation bar with search and actions
 * - Hero section with tagline
 * - Product grid (New Art section)
 * - Fully public access (no authentication required)
 * 
 * @author Glyzier Team
 * @version 4.0 (UI Refactor - Wireframe Implementation)
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { getAllProducts } from '../services/productService';
import styles from './HomePage.module.css';

/**
 * HomePage functional component
 * 
 * @returns {JSX.Element} The home page component
 */
function HomePage() {
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Fetch products on component mount
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <div className={styles.page}>
      {/* Navigation Bar */}
      <Navigation />
      
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Explore The Art World</h1>
          <p className={styles.heroSubtitle}>
            Where Artists and Buyers Unite for a Unique Experience
          </p>
        </div>
      </div>
      
      {/* Product Section */}
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>New Art</h2>
        
        {/* Loading state */}
        {loading && (
          <div className={styles.message}>
            <p>Loading products...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className={styles.message}>
            <p>No products available yet. Check back soon!</p>
          </div>
        )}
        
        {/* Products grid */}
        {!loading && !error && products.length > 0 && (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <Link 
                key={product.pid} 
                to={`/products/${product.pid}`}
                className={styles.productCard}
              >
                {/* Product Image Placeholder */}
                <div className={styles.productImage}>
                  <span className={styles.imagePlaceholder}>Product Photo</span>
                </div>
                
                {/* Product Info */}
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.productname}</h3>
                  <p className={styles.productDescription}>
                    {product.productdescription && product.productdescription.length > 80
                      ? `${product.productdescription.substring(0, 80)}...`
                      : product.productdescription || 'Product details...'}
                  </p>
                  <div className={styles.productPrice}>
                    ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Contact Button - Fixed Position */}
      <button className={styles.contactButton}>
        Contact Us!
      </button>
    </div>
  );
}

export default HomePage;
