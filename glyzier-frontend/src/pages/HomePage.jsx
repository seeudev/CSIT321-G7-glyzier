/**
 * HomePage Component
 * * Landing page of the Glyzier application, redesigned to match the UI wireframes.
 * Features:
 * - A dynamic hero carousel section.
 * - "Artist of the Month" showcase.
 * - "Hot Arts" section to display products.
 * - "Category" browsing section.
 * - Sponsor and social media footers.
 * * @author Glyzier Team
 * @version 5.0 (UI Redesign - Mockup Implementation)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { getAllProducts } from '../services/productService'; // We will use this for the "Hot Arts" section
import styles from './HomePage.module.css';

/**
 * Custom hook for auto-rotating carousel
 * @param {number} totalSlides - Total number of slides
 * @param {number} interval - Rotation interval in milliseconds
 * @returns {Object} Current index, next/prev handlers, and setter
 */
const useCarousel = (totalSlides, interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (totalSlides <= 1) return; // Don't auto-rotate if only 1 slide
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, interval);

    return () => clearInterval(timer);
  }, [totalSlides, interval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return { currentIndex, goToNext, goToPrev, setCurrentIndex };
};

// --- Hardcoded data for mockup sections ---
// In a real application, this data would also come from an API.

const artists = [
  { name: 'Adrienne Myers', age: 19 },
  { name: 'Damoin Albarn', age: 25 },
  { name: 'Rufco', age: 26 },
  { name: 'John Andree', age: 20 },
];

const categories = [
  { name: 'Digital Art', items: 120 },
  { name: 'Anime', items: 256 },
  { name: 'GIF Art', items: 89 },
  { name: 'Pixel Art', items: 400 },
  { name: 'Illustrations', items: 30 },
];

/**
 * HomePage functional component
 * @returns {JSX.Element} The redesigned home page component
 */
function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // This will be used for "Hot Arts"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hero carousel (auto-rotates through first 5 products every 5 seconds)
  const { currentIndex: heroIndex, goToNext: heroNext, goToPrev: heroPrev, setCurrentIndex: setHeroIndex } = useCarousel(Math.min(products.length, 5), 5000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // We fetch all products, but for the design, we'll only show the first 6 as "Hot Arts".
        const data = await getAllProducts();
        setProducts(data.slice(0, 6)); 
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load art. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.page}>
      <Navigation />

      {/* Hero Carousel Section - Auto-rotates through first 5 products */}
      <header className={styles.heroSection}>
        <button 
          className={styles.carouselArrow} 
          onClick={heroPrev}
          aria-label="Previous product"
        >
          &lt;
        </button>
        
        <div className={styles.heroContent}>
          {products.length > 0 ? (
            <>
              <div className={styles.heroText}>
                <h1>{products[heroIndex]?.productname || "Eye in Abstract"}</h1>
                <p>{products[heroIndex]?.productdesc || "A vibrant, colorful abstract painting of a human eye with splashes and drips of paint, creating an expressive and energetic look."}</p>
                <button onClick={() => products[heroIndex] && navigate(`/products/${products[heroIndex].pid}`)}>GET IT NOW</button>
              </div>
              <div className={styles.heroImage}>
                {products[heroIndex]?.screenshotPreviewUrl ? (
                  <img 
                    src={products[heroIndex].screenshotPreviewUrl} 
                    alt={products[heroIndex].productname}
                    className={styles.heroImageDisplay}
                  />
                ) : (
                  <div className={styles.heroImagePlaceholder}>[Image here]</div>
                )}
                <button 
                  className={styles.detailsButton} 
                  onClick={() => products[heroIndex] && navigate(`/products/${products[heroIndex].pid}`)}
                >
                  DETAILS
                </button>
              </div>
            </>
          ) : (
            <div className={styles.heroText}>
              <h1>Welcome to Glyzier</h1>
              <p>Discover amazing art from talented artists</p>
            </div>
          )}
          
          {/* Carousel indicators */}
          {products.length > 1 && (
            <div className={styles.carouselIndicators}>
              {products.slice(0, 5).map((_, index) => (
                <span
                  key={index}
                  className={`${styles.indicator} ${index === heroIndex ? styles.active : ''}`}
                  onClick={() => setHeroIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <button 
          className={styles.carouselArrow} 
          onClick={heroNext}
          aria-label="Next product"
        >
          &gt;
        </button>
      </header>

      <main>
        {/* Artist of the Month Section */}
        <section className={styles.artistsSection}>
          <h2>Artist of the Month</h2>
          <p className={styles.sectionSubtitle}>Ranked Popular this Month</p>
          <div className={styles.artistGrid}>
            {products.slice(1, 5).map((product, index) => (
              <div key={product.pid} className={styles.artistCard}>
                {product.screenshotPreviewUrl ? (
                  <img 
                    src={product.screenshotPreviewUrl} 
                    alt={product.productname}
                    className={styles.artistImage}
                  />
                ) : (
                  <div className={styles.artistImage}>[Image here]</div>
                )}
                <div className={styles.artistInfo}>
                  <h3>{product.sellerName || "Artist"}</h3>
                  <p>{product.productname}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className={styles.seeAllLink}>See All Our Designers</a>
        </section>

        {/* Hot Arts Section */}
        <section className={styles.hotArtsSection}>
          <h2>Hot Arts</h2>
          <p className={styles.sectionSubtitle}>Popular Topping Charts</p>
          {loading && <p>Loading art...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {!loading && !error && (
            <div className={styles.hotArtsGrid}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Link key={product.pid} to={`/products/${product.pid}`} className={styles.hotArtCard}>
                    <div className={styles.hotArtImage}>
                      {product.screenshotPreviewUrl ? (
                        <img 
                          src={product.screenshotPreviewUrl} 
                          alt={product.productname}
                          className={styles.productImage}
                        />
                      ) : (
                        <span>[No Image]</span>
                      )}
                    </div>
                    <p>{product.productname}</p>
                  </Link>
                ))
              ) : (
                <p>No hot arts available yet. Add some products!</p>
              )}
            </div>
          )}
        </section>

        {/* Category Section */}
        <section className={styles.categorySection}>
          <h2>Category</h2>
          <p className={styles.sectionSubtitle}>Select variations</p>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <div key={cat.name} className={styles.categoryCard}>
                <div className={styles.categoryImage}>[Image here]</div>
                <div className={styles.categoryInfo}>
                  <h3>{cat.name}</h3>
                  <p>{cat.items} Items</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <section className={styles.partnersSection}>
          <div className={styles.partnerLogo}>[Logo here]</div>
          <div className={styles.partnerLogo}>[Logo here]</div>
          <div className={styles.partnerLogo}>[Logo here]</div>
          <div className={styles.partnerLogo}>[Logo here]</div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.socialIcons}>
          <a href="#">T</a> <a href="#">F</a> <a href="#">I</a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;