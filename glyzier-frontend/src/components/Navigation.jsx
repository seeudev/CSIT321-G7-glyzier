/**
 * Navigation Component
 * 
 * Shared navigation bar for the Glyzier application based on UI wireframes.
 * Features:
 * - Glyzier logo/brand
 * - Search bar
 * - Navigation tabs (Home, Shops, Community, More)
 * - Action icons (Messages, Favorites, Cart)
 * - User avatar with dropdown
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { checkIfSeller } from '../services/sellerService';
import { hasNewMessages, markMessagesAsSeen } from '../services/notificationService';
import styles from '../styles/components/Navigation.module.css';

/**
 * Navigation functional component
 * 
 * @returns {JSX.Element} The navigation bar component
 */
function Navigation() {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  
  // Safely get cart count, default to 0 if cart context fails
  let cartCount = 0;
  try {
    const cart = useCart();
    cartCount = cart?.cartCount || 0;
  } catch (error) {
    console.log('Cart context not available');
  }
  
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [checkingSeller, setCheckingSeller] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  /**
   * Check if user is a seller on component mount
   */
  useEffect(() => {
    const checkSellerStatus = async () => {
      if (!isAuthenticated) {
        setIsSeller(false);
        setCheckingSeller(false);
        return;
      }

      try {
        setCheckingSeller(true);
        const status = await checkIfSeller();
        setIsSeller(status.isSeller);
      } catch (error) {
        console.error('Error checking seller status:', error);
        setIsSeller(false);
      } finally {
        setCheckingSeller(false);
      }
    };

    checkSellerStatus();
  }, [isAuthenticated]);

  /**
   * Check for new messages periodically
   * Polls every 10 seconds when user is authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setHasUnreadMessages(false);
      return;
    }

    // Check immediately on mount
    const checkMessages = async () => {
      try {
        const hasNew = await hasNewMessages();
        setHasUnreadMessages(hasNew);
      } catch (error) {
        console.error('Error checking messages:', error);
      }
    };

    checkMessages();

    // Poll every 10 seconds
    const interval = setInterval(checkMessages, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  /**
   * Handle clicking messages icon
   * Marks messages as seen and clears the badge
   */
  const handleMessagesClick = () => {
    markMessagesAsSeen();
    setHasUnreadMessages(false);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  /**
   * Toggle user menu
   * When opening the menu, refresh user data to get latest admin status
   */
  const toggleUserMenu = async () => {
    const newState = !showUserMenu;
    setShowUserMenu(newState);
    
    // Refresh user data when opening the menu
    if (newState && isAuthenticated) {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  /**
   * Handle search form submission
   * Module 11 - Makes navbar search functional
   * Redirects to /search page with query parameter
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input after submission
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Brand (text only, no circle logo) */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandText}>Glyzier</span>
        </Link>

        {/* Search Bar with SVG icon - Module 11: Made functional */}
        <form className={styles.searchContainer} onSubmit={handleSearchSubmit}>
          <div className={styles.searchIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            type="text"
            placeholder="Search artworks, sellers..."
            className={styles.searchInput}
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Navigation Tabs - Show for all users */}
        <div className={styles.navTabs}>
          <Link to="/" className={styles.navTab}>
            Home
          </Link>
          <Link to="/shops" className={styles.navTab}>
            Shops
          </Link>
          <Link to="/community" className={styles.navTab}>
            Community
          </Link>
          <Link to="/more" className={styles.navTab}>
            More
          </Link>
        </div>

        {/* Action Icons */}
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              {/* Messages Icon - Module 16 with notification badge */}
              <Link 
                to="/messages" 
                className={styles.iconButton} 
                title="Messages" 
                aria-label="Messages"
                onClick={handleMessagesClick}
              >
                <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg>
                {hasUnreadMessages && (
                  <span className={styles.notificationBadge}></span>
                )}
              </Link>

              {/* Favorites Icon - Module 10 */}
              <Link to="/favorites" className={styles.iconButton} title="Favorites" aria-label="Favorites">
                <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
              </Link>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className={styles.iconButton} title="Cart" aria-label="Cart">
                <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {cartCount > 0 && (
                  <span className={styles.badge}>{cartCount}</span>
                )}
              </Link>

              {/* User Avatar with Dropdown */}
              <div className={styles.userMenu}>
                <button 
                  className={styles.avatar} 
                  onClick={toggleUserMenu}
                  title="User Menu"
                >
                  <div className={styles.avatarCircle}>
                    {user?.displayname?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.avatarCircle}>
                        {user?.displayname?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{user?.displayname}</div>
                        <div className={styles.userEmail}>{user?.email}</div>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <Link 
                      to="/dashboard" 
                      className={styles.dropdownItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Dashboard
                    </Link>
                    {!checkingSeller && isSeller && (
                      <Link 
                        to="/seller/dashboard" 
                        className={styles.dropdownItem}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Seller Dashboard
                      </Link>
                    )}
                    {user?.isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        className={styles.dropdownItem}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className={styles.dropdownDivider}></div>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login/Register buttons for guests */}
              <Link to="/login" className={styles.authButton}>
                Sign in
              </Link>
              <Link to="/register" className={styles.authButtonPrimary}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
