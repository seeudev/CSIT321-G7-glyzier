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
 * Returns default values if used outside CartProvider (for safety)
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // Return safe defaults instead of throwing error
    return {
      cart: null,
      cartCount: 0,
      loading: false,
      refreshCart: () => {},
      updateCartCount: () => {},
      clearCartState: () => {}
    };
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
    if (!isAuthenticated || authLoading) {
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
      // Don't set to null on error, just log it
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
    try {
      console.log('CartContext: Auth loading:', authLoading, 'Authenticated:', isAuthenticated);
      // Wait for auth to finish loading before doing anything
      if (authLoading) {
        console.log('CartContext: Waiting for auth to finish loading');
        return;
      }
      
      if (isAuthenticated) {
        console.log('CartContext: Loading cart for authenticated user');
        refreshCart();
      } else {
        console.log('CartContext: Clearing cart for non-authenticated user');
        clearCartState();
      }
    } catch (error) {
      console.error('CartContext: Error in useEffect', error);
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
