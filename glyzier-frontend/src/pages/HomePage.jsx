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
 * Custom hook for auto-rotating carousel with fade effect
 * @param {number} totalSlides - Total number of slides
 * @param {number} interval - Rotation interval in milliseconds
 * @returns {Object} Current index, next/prev handlers, setter, and fade state
 */
const useCarousel = (totalSlides, interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (totalSlides <= 1) return; // Don't auto-rotate if only 1 slide
    
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [totalSlides, interval]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return { currentIndex, goToNext, goToPrev, goToSlide, isTransitioning };
};

// Removed artists, categories data for clean minimal homepage

/**
 * HomePage functional component
 * @returns {JSX.Element} The redesigned home page component
 */
function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // This will be used for "Hot Arts"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroGradient, setHeroGradient] = useState('linear-gradient(135deg, #c9bfe8 0%, #b8afe8 100%)');
  
  // Hero carousel (auto-rotates through first 5 products every 5 seconds)
  const heroSlides = Math.min(products.length, 5);
  const { currentIndex: heroIndex, goToNext: heroNext, goToPrev: heroPrev, goToSlide: goToHeroSlide, isTransitioning } = useCarousel(heroSlides, 5000);

  /**
   * Extract dominant colors from an image using canvas
   * @param {string} imageUrl - URL of the image
   * @returns {Promise<Array>} Array of RGB color values
   */
  const extractColorsFromImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize for performance
          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);
          
          const imageData = ctx.getImageData(0, 0, 100, 100).data;
          const colorMap = {};
          
          // Sample colors and count frequency
          for (let i = 0; i < imageData.length; i += 4 * 10) { // Sample every 10th pixel
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];
            
            // Skip transparent and very light/dark pixels
            if (a < 128 || (r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20)) continue;
            
            // Round to reduce color variations
            const roundedR = Math.round(r / 30) * 30;
            const roundedG = Math.round(g / 30) * 30;
            const roundedB = Math.round(b / 30) * 30;
            const key = `${roundedR},${roundedG},${roundedB}`;
            
            colorMap[key] = (colorMap[key] || 0) + 1;
          }
          
          // Get top 3 colors by frequency
          const sortedColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([color]) => color.split(',').map(Number));
          
          resolve(sortedColors.length > 0 ? sortedColors : [[201, 191, 232], [184, 175, 232]]);
        } catch (error) {
          console.error('Error extracting colors:', error);
          resolve([[201, 191, 232], [184, 175, 232]]); // Fallback colors
        }
      };
      
      img.onerror = () => {
        resolve([[201, 191, 232], [184, 175, 232]]); // Fallback colors
      };
      
      img.src = imageUrl;
    });
  };

  /**
   * Create gradient from extracted colors
   * @param {Array} colors - Array of RGB color arrays
   * @returns {string} CSS gradient string
   */
  const createGradientFromColors = (colors) => {
    if (colors.length === 0) {
      return 'linear-gradient(135deg, #c9bfe8 0%, #b8afe8 100%)';
    }
    
    // Lighten colors for better readability
    const lightenColor = (rgb, amount = 0.4) => {
      return rgb.map(c => Math.min(255, Math.round(c + (255 - c) * amount)));
    };
    
    const color1 = lightenColor(colors[0]);
    const color2 = colors.length > 1 ? lightenColor(colors[1]) : lightenColor(colors[0], 0.5);
    
    return `linear-gradient(135deg, rgb(${color1.join(',')}) 0%, rgb(${color2.join(',')}) 100%)`;
  };

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

  // Update gradient when carousel index changes
  useEffect(() => {
    const updateGradient = async () => {
      if (products.length > 0 && products[heroIndex]?.screenshotPreviewUrl) {
        const colors = await extractColorsFromImage(products[heroIndex].screenshotPreviewUrl);
        const gradient = createGradientFromColors(colors);
        setHeroGradient(gradient);
      }
    };
    
    updateGradient();
  }, [heroIndex, products]);

  return (
    <div className={styles.page}>
      <Navigation />

      {/* Hero Carousel Section - Auto-rotates through first 5 products */}
      <header 
        className={styles.heroSection}
        style={{ background: heroGradient }}
      >
        <button 
          className={styles.carouselArrow} 
          onClick={heroPrev}
          aria-label="Previous product"
          disabled={isTransitioning}
        >
          &lt;
        </button>
        
        <div className={styles.heroContent}>
          {products.length > 0 ? (
            <>
              <div className={`${styles.heroText} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                <h1>
                  {products[heroIndex]?.productname || "Eye in Abstract"}
                </h1>
                <p>
                  {products[heroIndex]?.productdesc || "A vibrant, colorful abstract painting of a human eye with splashes and drips of paint, creating an expressive and energetic look."}
                </p>
                <button 
                  className={styles.getItNowButton}
                  onClick={() => products[heroIndex] && navigate(`/products/${products[heroIndex].pid}`)}
                >
                  GET IT NOW
                </button>
              </div>
              <div className={styles.heroImageContainer}>
                <div className={`${styles.heroImage} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                  {products[heroIndex]?.screenshotPreviewUrl ? (
                    <img 
                      src={products[heroIndex].screenshotPreviewUrl} 
                      alt={products[heroIndex].productname}
                      className={styles.heroImageDisplay}
                    />
                  ) : (
                    <div className={styles.heroImagePlaceholder}>[Image here]</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.heroText}>
              <h1>Explore The Art World</h1>
              <p>Where Artists and Buyers Unite for a Unique Experience</p>
            </div>
          )}
          
          {/* Carousel indicators */}
          {heroSlides > 1 && (
            <div className={styles.carouselIndicators}>
              {products.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${index === heroIndex ? styles.active : ''}`}
                  onClick={() => goToHeroSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          )}
        </div>

        <button 
          className={styles.carouselArrow} 
          onClick={heroNext}
          aria-label="Next product"
          disabled={isTransitioning}
        >
          &gt;
        </button>
      </header>

      <main>
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

      </main>
    </div>
  );
}

export default HomePage;