/**
 * SearchPage Component
 * 
 * Module 11 - Basic Search & Filter
 * 
 * This page displays search results for products and sellers based on user queries.
 * Features:
 * - Display products matching search query
 * - Display sellers matching search query
 * - Filter by category (product type)
 * - Show result count
 * - Aurora animated background
 * - Reuse product card grid from HomePage
 * 
 * @author Glyzier Team
 * @version 2.0 (Enhanced with Aurora and Seller Search)
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import FavoriteButton from '../components/FavoriteButton';
import Aurora from '../components/Aurora';
import { useAuth } from '../context/AuthContext'; // Module 19: For ownership checks
import api from '../services/api';
import { getAllSellers } from '../services/sellerService';
import styles from '../styles/pages/SearchPage.module.css';

/**
 * Available product categories/types
 * These match the types stored in the database
 */
const CATEGORIES = [
  'All',
  'Print',
  'Digital',
  'Original',
  'Sculpture',
  'Photography',
  'Mixed Media'
];

/**
 * SearchPage functional component
 * Fetches and displays products based on URL query parameters
 * 
 * @returns {JSX.Element} The search results page
 */
function SearchPage() {
  const { user } = useAuth(); // Module 19: For ownership checks
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultCount, setResultCount] = useState(0);
  const [searchType, setSearchType] = useState('all'); // 'all', 'products', 'sellers'
  
  // Get query parameters from URL
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  
  /**
   * Helper function to check ownership (Module 19)
   * @param {Object} product - Product object with sellerId
   * @returns {boolean} - True if current user owns the product
   */
  const isOwnerOfProduct = (product) => {
    return user && product.sellerId && user.uid === product.sellerId;
  };

  /**
   * Fetch search results whenever query, category, or search type changes
   */
  useEffect(() => {
    const fetchSearchResults = async () => {
      // Don't search if query is empty
      if (!query.trim()) {
        setProducts([]);
        setSellers([]);
        setResultCount(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let productResults = [];
        let sellerResults = [];

        // Search products if searchType is 'all' or 'products'
        if (searchType === 'all' || searchType === 'products') {
          const categoryFilter = selectedCategory !== 'All' ? selectedCategory : null;
          const params = new URLSearchParams({ query: query.trim() });
          if (categoryFilter) {
            params.append('category', categoryFilter);
          }

          const productResponse = await api.get(`/api/products/search?${params.toString()}`);
          productResults = productResponse.data.products || [];
        }

        // Search sellers if searchType is 'all' or 'sellers'
        if (searchType === 'all' || searchType === 'sellers') {
          const allSellers = await getAllSellers();
          // Filter sellers by search query (case-insensitive)
          const queryLower = query.trim().toLowerCase();
          sellerResults = allSellers.filter(seller => 
            seller.sellername?.toLowerCase().includes(queryLower) ||
            seller.storebio?.toLowerCase().includes(queryLower)
          );
        }
        
        setProducts(productResults);
        setSellers(sellerResults);
        setResultCount(productResults.length + sellerResults.length);
        setError(null);
        
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to search. Please try again.');
        setProducts([]);
        setSellers([]);
        setResultCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, selectedCategory, searchType]);

  /**
   * Handle category filter change
   * Updates URL search params which triggers useEffect
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // Update URL parameters
    const newParams = new URLSearchParams({ q: query });
    if (category !== 'All') {
      newParams.append('category', category);
    }
    setSearchParams(newParams);
  };

  return (
    <div className={styles.page}>
      <Aurora 
        colorStops={['#667eea', '#764ba2', '#f093fb']}
        amplitude={1.2}
        blend={0.6}
        speed={0.4}
      />
      <Navigation />

      <main className={styles.container}>
        {/* Search Header */}
        <div className={styles.searchHeaderCard}>
          <div className={styles.header}>
            <h1>Search Results</h1>
            {query && (
              <p className={styles.searchQuery}>
                Showing results for: <strong>"{query}"</strong>
                {selectedCategory !== 'All' && (
                  <span className={styles.categoryTag}> in {selectedCategory}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Search Type Toggle */}
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Search In:</label>
          <div className={styles.categoryButtons}>
            <button
              className={`${styles.categoryButton} ${searchType === 'all' ? styles.active : ''}`}
              onClick={() => setSearchType('all')}
            >
              All Results
            </button>
            <button
              className={`${styles.categoryButton} ${searchType === 'products' ? styles.active : ''}`}
              onClick={() => setSearchType('products')}
            >
              Products Only
            </button>
            <button
              className={`${styles.categoryButton} ${searchType === 'sellers' ? styles.active : ''}`}
              onClick={() => setSearchType('sellers')}
            >
              Sellers Only
            </button>
          </div>
        </div>

        {/* Category Filter (only show for products) */}
        {(searchType === 'all' || searchType === 'products') && (
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Filter by Category:</label>
            <div className={styles.categoryButtons}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${
                    selectedCategory === category ? styles.active : ''
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Count */}
        {!loading && query && (
          <div className={styles.resultCountCard}>
            <div className={styles.resultCount}>
              Found <strong>{resultCount}</strong> {resultCount === 1 ? 'result' : 'results'}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingMessage}>
            Searching...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Empty Query State */}
        {!loading && !query && (
          <div className={styles.emptyState}>
            <p>Enter a search term to find products</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && query && products.length === 0 && sellers.length === 0 && !error && (
          <div className={styles.noResults}>
            <p>No {searchType === 'products' ? 'products' : searchType === 'sellers' ? 'sellers' : 'results'} found matching your search.</p>
            <p className={styles.suggestion}>Try different keywords or browse all categories.</p>
          </div>
        )}

        {/* Seller Results */}
        {!loading && sellers.length > 0 && (searchType === 'all' || searchType === 'sellers') && (
          <div className={styles.sellersSection}>
            <h2 className={styles.sectionTitle}>Sellers ({sellers.length})</h2>
            <div className={styles.sellersGrid}>
              {sellers.map((seller) => (
                <Link 
                  key={seller.sid} 
                  to={`/shops/${seller.sid}`} 
                  className={styles.sellerCard}
                >
                  <div className={styles.sellerAvatar}>
                    {seller.sellername?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className={styles.sellerInfo}>
                    <h3 className={styles.sellerName}>{seller.sellername}</h3>
                    {seller.storebio && (
                      <p className={styles.sellerBio}>{seller.storebio}</p>
                    )}
                    <p className={styles.productCount}>
                      {seller.productCount || seller.products?.length || 0} products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Product Results */}
        {!loading && products.length > 0 && (searchType === 'all' || searchType === 'products') && (
          <div className={styles.productsSection}>
            <h2 className={styles.sectionTitle}>Products ({products.length})</h2>
            <div className={styles.resultsGrid}>
              {products.map((product) => {
                const isOwner = isOwnerOfProduct(product);
                return (
                  <Link 
                    key={product.pid} 
                    to={`/products/${product.pid}`} 
                    className={`${styles.productCard} ${isOwner ? styles.ownProduct : ''}`}
                  >
                    {/* Owner badge - Module 19 */}
                    {isOwner && (
                      <div className={styles.ownerBadgeSmall}>
                        Your Product
                      </div>
                    )}
                    
                    <div className={styles.productImage}>
                      {product.screenshotPreviewUrl ? (
                        <img 
                          src={product.screenshotPreviewUrl} 
                          alt={product.productname}
                          className={styles.productImageDisplay}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>[No Image]</div>
                      )}
                      {/* Favorite Button - Module 10, Module 19: Disabled for owners */}
                      <FavoriteButton 
                        productId={product.pid} 
                        className={styles.favoriteButtonOverlay}
                        disabled={isOwner}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.productname}</h3>
                      <p className={styles.productPrice}>${product.price?.toFixed(2)}</p>
                      {product.type && (
                        <span className={styles.productType}>{product.type}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
