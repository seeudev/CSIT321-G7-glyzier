/**
 * SearchPage Component
 * 
 * Module 11 - Basic Search & Filter
 * 
 * This page displays search results for products based on user queries.
 * Features:
 * - Display products matching search query
 * - Filter by category (product type)
 * - Show result count
 * - Reuse product card grid from HomePage
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 11)
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import FavoriteButton from '../components/FavoriteButton';
import api from '../services/api';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultCount, setResultCount] = useState(0);
  
  // Get query parameters from URL
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  /**
   * Fetch search results whenever query or category changes
   */
  useEffect(() => {
    const fetchSearchResults = async () => {
      // Don't search if query is empty
      if (!query.trim()) {
        setProducts([]);
        setResultCount(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Build API URL with query parameters
        const categoryFilter = selectedCategory !== 'All' ? selectedCategory : null;
        const params = new URLSearchParams({ query: query.trim() });
        if (categoryFilter) {
          params.append('category', categoryFilter);
        }

        // Call search API endpoint
        const response = await api.get(`/api/products/search?${params.toString()}`);
        
        setProducts(response.data.products || []);
        setResultCount(response.data.count || 0);
        setError(null);
        
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to search products. Please try again.');
        setProducts([]);
        setResultCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, selectedCategory]);

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
      <Navigation />

      <main className={styles.container}>
        {/* Search Header */}
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

        {/* Category Filter */}
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

        {/* Result Count */}
        {!loading && query && (
          <div className={styles.resultCount}>
            Found <strong>{resultCount}</strong> {resultCount === 1 ? 'product' : 'products'}
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
        {!loading && query && products.length === 0 && !error && (
          <div className={styles.noResults}>
            <p>No products found matching your search.</p>
            <p className={styles.suggestion}>Try different keywords or browse all categories.</p>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && products.length > 0 && (
          <div className={styles.resultsGrid}>
            {products.map((product) => (
              <Link 
                key={product.pid} 
                to={`/products/${product.pid}`} 
                className={styles.productCard}
              >
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
                  {/* Favorite Button */}
                  <FavoriteButton 
                    productId={product.pid} 
                    className={styles.favoriteButtonOverlay}
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
