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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navigation.module.css';

/**
 * Navigation functional component
 * 
 * @returns {JSX.Element} The navigation bar component
 */
function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  
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
   */
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <Link to="/" className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>G</span>
          </div>
          <span className={styles.brandText}>Glyzier</span>
        </Link>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>

        {/* Navigation Tabs - Only show when authenticated */}
        {isAuthenticated && (
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
        )}

        {/* Action Icons */}
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              {/* Messages Icon */}
              <button className={styles.iconButton} title="Messages">
                <span className={styles.icon}>💬</span>
              </button>

              {/* Favorites Icon */}
              <button className={styles.iconButton} title="Favorites">
                <span className={styles.icon}>❤️</span>
              </button>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className={styles.iconButton} title="Cart">
                <span className={styles.icon}>🛒</span>
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
                    <Link 
                      to="/seller/dashboard" 
                      className={styles.dropdownItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      Seller Dashboard
                    </Link>
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
