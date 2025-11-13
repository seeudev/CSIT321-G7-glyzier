/**
 * HomePage Component
 * 
 * This is the landing page of the Glyzier application.
 * It displays:
 * - A welcome message
 * - A grid of all available products fetched from the backend
 * - Navigation to login/register for guests or dashboard for logged-in users
 * 
 * Products are public and can be viewed by anyone.
 * Each product card links to its detail page.
 * 
 * @author Glyzier Team
 * @version 3.0 (Module 7 - Product listing implementation)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getAllProducts } from '../services/productService';

/**
 * HomePage functional component
 * 
 * @returns {JSX.Element} The home page component
 */
function HomePage() {
  // Get authentication state and functions from context
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Fetch products on component mount
   * 
   * Uses the getAllProducts function from productService
   * to fetch the complete product list from the backend.
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
  }, []); // Empty dependency array = run once on mount
  
  /**
   * Handle logout
   * Logs out the user and stays on the home page
   */
  const handleLogout = () => {
    logout();
    // Optional: You could show a success message here
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          {isAuthenticated ? `Welcome back, ${user.displayname}!` : 'Welcome to Glyzier'}
        </h1>
        <p style={styles.subtitle}>
          Discover and purchase amazing artwork from talented artists
        </p>
        
        <div style={styles.buttonGroup}>
          {isAuthenticated ? (
            // Buttons for authenticated users
            <>
              <Link to="/dashboard" style={styles.button}>
                My Dashboard
              </Link>
              <Link to="/cart" style={styles.cartButton}>
                🛒 Cart {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
              </Link>
              <button 
                onClick={handleLogout} 
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                Logout
              </button>
            </>
          ) : (
            // Buttons for guests
            <>
              <Link to="/login" style={styles.button}>
                Login
              </Link>
              <Link to="/register" style={{...styles.button, ...styles.buttonSecondary}}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div style={styles.info}>
        <h2>About Glyzier</h2>
        <p>
          Glyzier is an artist portfolio and store platform where artists can
          showcase and sell their work, and art enthusiasts can discover and
          purchase unique pieces.
        </p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <h3>🎨 For Artists</h3>
            <p>Create your seller account, upload your artwork, and manage your inventory</p>
          </div>
          
          <div style={styles.feature}>
            <h3>🛒 For Buyers</h3>
            <p>Browse artwork, place orders, and track your purchase history</p>
          </div>
          
          <div style={styles.feature}>
            <h3>📦 Simple & Secure</h3>
            <p>Easy-to-use interface with simulated payment for educational purposes</p>
          </div>
        </div>
      </div>
      
      {/* Product Catalog Section */}
      <div style={styles.catalogSection}>
        <h2 style={styles.catalogTitle}>Available Artwork</h2>
        
        {/* Loading state */}
        {loading && (
          <div style={styles.message}>
            <p>Loading products...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div style={{...styles.message, color: '#d32f2f'}}>
            <p>{error}</p>
          </div>
        )}
        
        {/* Products grid */}
        {!loading && !error && products.length === 0 && (
          <div style={styles.message}>
            <p>No products available yet. Check back soon!</p>
          </div>
        )}
        
        {!loading && !error && products.length > 0 && (
          <div style={styles.productGrid}>
            {products.map((product) => (
              <Link 
                key={product.pid} 
                to={`/products/${product.pid}`}
                style={styles.productCard}
              >
                {/* Product Image Placeholder */}
                <div style={styles.productImage}>
                  <span style={styles.imagePlaceholder}>🎨</span>
                  <p style={styles.imageText}>Product Image</p>
                </div>
                
                {/* Product Info */}
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.productname}</h3>
                  <p style={styles.productDescription}>
                    {product.productdescription && product.productdescription.length > 100
                      ? `${product.productdescription.substring(0, 100)}...`
                      : product.productdescription || 'No description available'}
                  </p>
                  <div style={styles.productFooter}>
                    <span style={styles.productPrice}>₱{product.price.toFixed(2)}</span>
                    <span style={styles.productSeller}>
                      by {product.sellerDisplayname || 'Unknown Seller'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline styles for simplicity (in a real app, you'd use CSS modules or styled-components)
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    marginBottom: '40px',
  },
  title: {
    fontSize: '3em',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.3em',
    marginBottom: '30px',
    opacity: 0.9,
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  button: {
    padding: '12px 30px',
    fontSize: '1.1em',
    backgroundColor: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
  },
  cartButton: {
    padding: '12px 30px',
    fontSize: '1.1em',
    backgroundColor: '#8b7fc4',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    cursor: 'pointer',
  },
  cartBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85em',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
  info: {
    padding: '20px',
    marginBottom: '40px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  feature: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  catalogSection: {
    marginTop: '40px',
  },
  catalogTitle: {
    fontSize: '2em',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
  },
  message: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.1em',
    color: '#666',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    },
  },
  productImage: {
    height: '200px',
    background: 'linear-gradient(135deg, #b8afe8 0%, #9b8dd4 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  imagePlaceholder: {
    fontSize: '4em',
    marginBottom: '10px',
  },
  imageText: {
    fontSize: '1.1em',
    fontWeight: '500',
  },
  productInfo: {
    padding: '20px',
  },
  productName: {
    fontSize: '1.3em',
    marginBottom: '10px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: '0.95em',
    color: '#7f8c8d',
    marginBottom: '15px',
    lineHeight: '1.5',
    minHeight: '60px',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '15px',
  },
  productPrice: {
    fontSize: '1.4em',
    fontWeight: 'bold',
    color: '#667eea',
  },
  productSeller: {
    fontSize: '0.9em',
    color: '#95a5a6',
    fontStyle: 'italic',
  },
};

export default HomePage;
