import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrderFromCart } from '../services/orderService';
import { showSuccess, showError } from '../components/NotificationManager';
import { AlertIcon, LockIcon } from '../components/Icons';
import Navigation from '../components/Navigation';
import styles from '../styles/pages/CheckoutPage.module.css';

/**
 * CheckoutPage Component - Simple checkout with address and payment simulation
 * 
 * This page provides a minimal checkout flow (Module 12):
 * - Single address form (not saved to user profile)
 * - Simple card number validation (16 digits only)
 * - Creates order from cart items
 * - Redirects to order confirmation page
 * 
 * Features:
 * - Basic address fields (no address book)
 * - Simulated payment (accepts any 16 digits)
 * - Order summary from cart
 * - Validation and error handling
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 12)
 */
const CheckoutPage = () => {
  const { cart, refreshCart, updateCartCount } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isDigitalOnly, setIsDigitalOnly] = useState(false);
  
  // Address fields
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Payment field
  const [cardNumber, setCardNumber] = useState('');

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await refreshCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  // Check if cart contains only digital products (Module 20)
  useEffect(() => {
    if (cart && cart.items) {
      const allDigital = cart.items.every(item => item.type === 'Digital');
      setIsDigitalOnly(allDigital);
    }
  }, [cart]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
      showError('Your cart is empty');
      navigate('/cart');
    }
  }, [loading, cart, navigate]);

  /**
   * Handle form submission
   * 
   * Validates inputs, constructs address string, and places order.
   * For digital-only orders, skips address validation and uses "DIGITAL_ONLY" marker.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Address validation - skip for digital-only orders (Module 20)
    if (!isDigitalOnly) {
      if (!fullName.trim() || !streetAddress.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
        setError('All address fields are required');
        return;
      }
    }

    // Payment validation
    if (cardNumber.length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }

    // Construct address string
    // For digital-only orders, use special marker to skip shipping
    const addressString = isDigitalOnly 
      ? 'DIGITAL_ONLY'
      : `${fullName}\n${streetAddress}\n${city}, ${postalCode}\nPhone: ${phone}`;

    try {
      setProcessing(true);

      // Place order from cart with address and card number
      const result = await placeOrderFromCart({
        address: addressString,
        cardNumber: cardNumber
      });

      // Show success message
      showSuccess(isDigitalOnly 
        ? 'Digital order placed successfully! Check your email for download links.'
        : 'Order placed successfully!');

      // Update cart count and refresh
      await updateCartCount();
      await refreshCart();

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${result.order.orderid}`);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Format card number input (add spaces every 4 digits)
   */
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    setCardNumber(value.slice(0, 16));
  };

  /**
   * Format phone input (digits only)
   */
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value.slice(0, 11));
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>Loading checkout...</div>
        </div>
      </div>
    );
  }

  // Should not reach here if cart is empty (redirected above)
  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Checkout</h1>
        </div>

        <div className={styles.content}>
          {/* Checkout form */}
          <form onSubmit={handleSubmit} className={styles.checkoutForm}>
            {/* Error banner */}
            {error && (
              <div className={styles.errorBanner}>
                <AlertIcon size={20} color="#d32f2f" style={{ marginRight: '8px' }} />
                {error}
              </div>
            )}

            {/* Delivery Address Section - Skip for digital-only orders (Module 20) */}
            {!isDigitalOnly && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Delivery Address</h2>
                
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>
                    Full Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.input}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="streetAddress" className={styles.label}>
                    Street Address <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className={styles.input}
                    placeholder="123 Main St, Building A, Unit 4B"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>
                      City <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={styles.input}
                      placeholder="Manila"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="postalCode" className={styles.label}>
                      Postal Code <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={styles.input}
                      placeholder="1000"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={styles.input}
                    placeholder="09123456789"
                    required
                  />
                </div>
              </div>
            )}
            
            {/* Digital Order Notice (Module 20) */}
            {isDigitalOnly && (
              <div className={styles.digitalNotice}>
                <svg className={styles.digitalIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div className={styles.digitalNoticeContent}>
                  <h3 className={styles.digitalNoticeTitle}>Digital Products Only</h3>
                  <p className={styles.digitalNoticeText}>
                    Your cart contains only digital products. No shipping address required.
                    Download links will be available immediately after purchase.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <LockIcon size={18} color="#4caf50" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                Payment Information
              </h2>
              
              <p className={styles.paymentNote}>
                This is a simulated payment. Any 16-digit number is accepted.
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="cardNumber" className={styles.label}>
                  Card Number <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={styles.input}
                  placeholder="1234567812345678"
                  required
                />
                <span className={styles.helperText}>
                  {cardNumber.length}/16 digits
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={processing}
              className={styles.submitButton}
            >
              {processing ? 'Processing Payment...' : 'Place Order'}
            </button>
          </form>

          {/* Order summary sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              {/* Items */}
              <div className={styles.summaryItems}>
                {cart.items.map((item) => (
                  <div key={item.cartItemid} className={styles.summaryItem}>
                    <span className={styles.itemName}>
                      {item.productname} × {item.quantity}
                    </span>
                    <span className={styles.itemPrice}>
                      ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalPrice}>
                  ${cart.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
