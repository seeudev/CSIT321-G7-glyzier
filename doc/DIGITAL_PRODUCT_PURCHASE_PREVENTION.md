# Digital Product Purchase Prevention & Download Access

## Overview

This enhancement prevents users from re-purchasing digital products they've already bought and provides seamless download access on the product page after purchase.

**Date**: December 1, 2025  
**Module**: Module 20 Enhancement  
**Related Issues**: Product routing, digital product re-purchase prevention, purchase-based download access

---

## Features Implemented

### 1. Product Routing Fix

**Issue**: Order history page used incorrect route `/product/{pid}` instead of `/products/{pid}`

**Fix**: Updated `OrderHistoryPage.jsx` to use correct route
```jsx
// Before
<Link to={`/product/${item.pid}`}>

// After
<Link to={`/products/${item.pid}`}>
```

---

### 2. Digital Product Re-Purchase Prevention

**Issue**: Users could purchase the same digital product multiple times, wasting money and creating inventory issues.

**Solution**: Added purchase validation in cart service

#### Backend Changes

**OrderService.java** - New helper method:
```java
/**
 * Check if user has purchased a specific product
 */
public boolean hasUserPurchasedProduct(Long userId, Long productId) {
    return orderProductsRepository.existsByOrderUserUseridAndProductPid(userId, productId);
}
```

**CartService.java** - Added validation before adding to cart:
```java
// Prevent re-purchasing digital products
if ("Digital".equalsIgnoreCase(product.getType())) {
    boolean alreadyPurchased = orderProductsRepository
        .existsByOrderUserUseridAndProductPid(userId, productId);
    if (alreadyPurchased) {
        throw new IllegalArgumentException(
            "You have already purchased this digital product. " +
            "Visit the product page to download it."
        );
    }
}
```

**Error Messages**:
- When trying to add purchased digital product to cart: *"You have already purchased this digital product. Visit the product page to download it."*

---

### 3. Purchase Status Check Endpoint

**New Endpoint**: `GET /api/products/{pid}/purchase-status`

**ProductController.java**:
```java
@GetMapping("/{pid}/purchase-status")
public ResponseEntity<?> checkPurchaseStatus(
        @PathVariable Long pid,
        Authentication authentication) {
    
    String email = authentication.getName();
    Users user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    
    boolean purchased = orderService.hasUserPurchasedProduct(user.getUserid(), pid);
    
    return ResponseEntity.ok(Map.of("purchased", purchased));
}
```

**Response**:
```json
{
  "purchased": true
}
```

**Frontend Service** - `productService.js`:
```javascript
export const checkPurchaseStatus = async (pid) => {
  const response = await api.get(`/api/products/${pid}/purchase-status`);
  return response.data;
};
```

---

### 4. Conditional Download Button Display

**Issue**: Digital products always showed "Buy" buttons even after purchase, requiring users to navigate to order history for downloads.

**Solution**: Product detail page now checks purchase status and conditionally renders download button for purchased digital products.

#### ProductDetailPage.jsx Changes

**State Management**:
```javascript
const [hasPurchased, setHasPurchased] = useState(false);
const [checkingPurchase, setCheckingPurchase] = useState(false);
```

**Purchase Status Check**:
```javascript
useEffect(() => {
  const checkPurchase = async () => {
    if (isAuthenticated && product && product.productType === 'Digital' && !isOwner) {
      try {
        setCheckingPurchase(true);
        const response = await checkPurchaseStatus(pid);
        setHasPurchased(response.purchased);
      } catch (err) {
        console.error('Failed to check purchase status:', err);
        setHasPurchased(false);
      } finally {
        setCheckingPurchase(false);
      }
    }
  };
  
  checkPurchase();
}, [isAuthenticated, product, pid, isOwner]);
```

**Conditional Rendering**:
```jsx
{product && product.productType === 'Digital' && hasPurchased && productFiles.length > 0 ? (
  // Show download button for purchased digital products
  <div className={styles.actionSection}>
    <button onClick={handleDownload} className={styles.downloadButton}>
      <svg>...</svg>
      Download Digital Product
    </button>
    <p className={styles.purchasedNote}>
      ✅ You own this digital product
    </p>
  </div>
) : (
  // Show purchase buttons for non-purchased or physical products
  <div className={styles.actionSection}>
    <button 
      disabled={hasPurchased && product?.productType === 'Digital'}
      className={styles.addToCartButton}
    >
      {hasPurchased ? 'Already Purchased' : 'Add to Cart'}
    </button>
    <button 
      disabled={hasPurchased && product?.productType === 'Digital'}
      className={styles.buyNowButton}
    >
      {hasPurchased ? 'Already Purchased' : 'Buy Now'}
    </button>
  </div>
)}
```

---

## User Flow

### Scenario 1: User Purchases Digital Product

1. User browses digital product page → Sees "Add to Cart" and "Buy Now" buttons
2. User purchases product → Order completed, status set to "Completed"
3. User returns to product page → Sees "Download Digital Product" button instead of purchase buttons
4. User clicks download → File download initiated (with purchase verification)

### Scenario 2: User Tries to Re-Purchase

1. User already owns digital product
2. User visits product page → Buttons disabled, showing "Already Purchased"
3. User tries to add to cart anyway → Error: *"You have already purchased this digital product. Visit the product page to download it."*
4. User sees download button on product page → Can download anytime

### Scenario 3: Order History Navigation

1. User views order history → Clicks on product name
2. Correct route `/products/{pid}` used → Successfully navigates to product page
3. If digital product purchased → Download button available

---

## Technical Details

### Database Query

The purchase check uses an existing JPA repository method:
```java
OrderProductsRepository.existsByOrderUserUseridAndProductPid(userId, productId)
```

This efficiently queries the `order_products` join table to verify purchase history.

### Performance Considerations

- **Caching**: Purchase status checked once per page load
- **Lazy Loading**: Purchase check only runs for authenticated users viewing digital products
- **Efficient Query**: Uses `EXISTS` clause for fast database lookup

### Security

- **Authentication Required**: Purchase status endpoint requires JWT token
- **Authorization**: Users can only check their own purchase status
- **Download Verification**: Backend still verifies purchase before generating download URL

---

## CSS Styling

**ProductDetailPage.module.css** - New style:
```css
.purchasedNote {
  text-align: center;
  font-size: 0.95em;
  color: rgba(16, 185, 129, 0.95);
  margin-top: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
```

**Button States**:
- Purchased digital products show "Already Purchased" text
- Buttons disabled with visual feedback
- Download button uses green theme to indicate ownership

---

## Testing Checklist

- [x] Order history links navigate to correct product pages
- [x] Digital product purchase prevents re-adding to cart
- [x] Purchase status endpoint returns correct status
- [x] Download button appears after purchasing digital product
- [x] Purchase buttons hidden for owned digital products
- [x] Physical products unaffected by changes
- [x] Owners see "Your Product" instead of purchase/download buttons
- [x] Unauthenticated users see normal purchase flow

---

## Files Modified

### Backend
1. `OrderService.java` - Added `hasUserPurchasedProduct()` helper method
2. `CartService.java` - Added digital product re-purchase prevention
3. `ProductController.java` - Added purchase status endpoint

### Frontend
1. `OrderHistoryPage.jsx` - Fixed product routing
2. `ProductDetailPage.jsx` - Added purchase status check and conditional rendering
3. `productService.js` - Added `checkPurchaseStatus()` method
4. `ProductDetailPage.module.css` - Added `.purchasedNote` style

### Documentation
1. `DIGITAL_PRODUCT_PURCHASE_PREVENTION.md` (this file)

---

## Future Enhancements

1. **Purchase History Link**: Add "View Purchase Receipt" button on product page
2. **Email Notifications**: Send download link via email after purchase
3. **Download Expiry**: Set expiration on signed URLs (currently 1 hour)
4. **Multiple Downloads**: Track download count for analytics
5. **Gift Purchases**: Allow buying digital products for other users

---

## Related Documentation

- [Module 20 Completion Guide](MODULE_20_MANAGE_PRODUCTS_COMPLETION.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Supabase Storage Integration](SUPABASE_STORAGE.md)

---

## Notes

This enhancement improves the user experience by:
- Preventing accidental duplicate purchases
- Providing immediate access to purchased content
- Reducing support requests about download access
- Maintaining proper inventory tracking for digital products

The implementation follows the existing authentication and authorization patterns in the Glyzier platform and maintains consistency with physical product purchasing flows.
