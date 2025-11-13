import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, getCartItemCount } from '../services/cartService';
import { useAuth } from './AuthContext';

/**
 * CartContext - Global state management for shopping cart
 * 
 * This context provides cart data and functions to all components.
 * It automatically loads the cart when the user logs in and updates
 * the cart count badge in the navbar.
 * 
 * Usage:
 * const { cart, cartCount, refreshCart, updateCartCount } = useCart();
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */

const CartContext = createContext();

/**
 * Hook to use cart context
 * 
 * @returns {Object} Cart context value
 * @throws {Error} If used outside CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * CartProvider component
 * 
 * Wraps the app to provide cart state to all components.
 * Automatically loads cart when user logs in.
 */
export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Refresh cart data from backend
   * 
   * Fetches the latest cart data and updates state.
   * Called after cart operations (add, remove, update).
   */
  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
      setCartCount(cartData.totalItemCount || 0);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      setCart(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update cart count badge
   * 
   * Fetches just the item count for efficiency.
   * Called frequently to keep badge up to date.
   */
  const updateCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    try {
      const count = await getCartItemCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartCount(0);
    }
  };

  /**
   * Clear cart state (used on logout)
   */
  const clearCartState = () => {
    setCart(null);
    setCartCount(0);
  };

  // Load cart when user logs in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshCart();
    } else if (!isAuthenticated) {
      clearCartState();
    }
  }, [isAuthenticated, authLoading]);

  const value = {
    cart,
    cartCount,
    loading,
    refreshCart,
    updateCartCount,
    clearCartState
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
