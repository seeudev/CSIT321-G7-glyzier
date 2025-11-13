package com.glyzier.service;

import com.glyzier.dto.CartResponse;
import com.glyzier.model.*;
import com.glyzier.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CartService - Business logic for shopping cart operations
 * 
 * This service handles all cart-related functionality in the Glyzier platform.
 * It manages cart creation, adding/removing items, updating quantities,
 * and checkout preparation.
 * 
 * Key responsibilities:
 * - Create cart for new users
 * - Add products to cart with stock validation
 * - Update cart item quantities
 * - Remove items from cart
 * - Clear entire cart
 * - Calculate cart totals
 * - Prepare cart for checkout
 * 
 * IMPORTANT: This is a SIMULATED implementation for a university project.
 * - Stock validation is simple and not production-ready
 * - No handling of race conditions
 * - Cart is database-backed for persistence across sessions
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get or create a cart for the user
     * 
     * If the user doesn't have a cart yet, create one.
     * This is called automatically when needed.
     * 
     * @param userId The user's ID
     * @return CartResponse DTO containing cart details
     * @throws IllegalArgumentException if user not found
     */
    @Transactional
    public CartResponse getOrCreateCart(Long userId) {
        // Find the user
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Get or create cart
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElseGet(() -> {
                    // Create new cart for user
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });

        return new CartResponse(cart);
    }

    /**
     * Get cart details for the authenticated user
     * 
     * Returns the user's cart with all items, quantities, and totals.
     * Creates a cart if the user doesn't have one yet.
     * 
     * @param userId The authenticated user's ID
     * @return CartResponse DTO containing cart details
     */
    public CartResponse getCart(Long userId) {
        return getOrCreateCart(userId);
    }

    /**
     * Add a product to the cart
     * 
     * Process:
     * 1. Validates the product exists and is available
     * 2. Checks stock availability
     * 3. If product already in cart, increases quantity
     * 4. If new product, creates new cart item
     * 5. Saves snapshot price at time of adding
     * 
     * @param userId The authenticated user's ID
     * @param productId The product ID to add
     * @param quantity The quantity to add
     * @return CartResponse DTO with updated cart
     * @throws IllegalArgumentException if product not found, unavailable, or insufficient stock
     */
    @Transactional
    public CartResponse addToCart(Long userId, Long productId, Integer quantity) {
        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        // Find the product
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Check if product is available
        if (!"Available".equalsIgnoreCase(product.getStatus())) {
            throw new IllegalArgumentException("Product is not available: " + product.getProductname());
        }

        // Check stock availability
        Inventory inventory = inventoryRepository.findByProductPid(productId)
                .orElseThrow(() -> new IllegalArgumentException("No inventory record found for product: " + product.getProductname()));

        int availableStock = inventory.getAvailableQuantity();
        
        // Get or create cart
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElseGet(() -> {
                    Users user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });

        // Check if product already in cart
        CartItem existingItem = cartItemRepository.findByCartCartidAndProductPid(cart.getCartid(), productId)
                .orElse(null);

        if (existingItem != null) {
            // Product already in cart - increase quantity
            int newQuantity = existingItem.getQuantity() + quantity;
            
            // Validate total quantity against stock
            if (newQuantity > availableStock) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getProductname() + 
                        ". Available: " + availableStock + ", Requested: " + newQuantity);
            }
            
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // New product - create cart item
            
            // Validate quantity against stock
            if (quantity > availableStock) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getProductname() + 
                        ". Available: " + availableStock + ", Requested: " + quantity);
            }
            
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setPriceSnapshot(product.getPrice()); // Snapshot current price
            
            cartItemRepository.save(cartItem);
            cart.addCartItem(cartItem);
        }

        // Refresh cart to get updated items
        cart = cartRepository.findById(cart.getCartid())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        return new CartResponse(cart);
    }

    /**
     * Update the quantity of a cart item
     * 
     * This allows users to change the quantity via dropdown selector.
     * 
     * @param userId The authenticated user's ID
     * @param productId The product ID to update
     * @param newQuantity The new quantity
     * @return CartResponse DTO with updated cart
     * @throws IllegalArgumentException if product not in cart or insufficient stock
     */
    @Transactional
    public CartResponse updateCartItemQuantity(Long userId, Long productId, Integer newQuantity) {
        // Validate quantity
        if (newQuantity == null || newQuantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        // Get cart
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));

        // Find cart item
        CartItem cartItem = cartItemRepository.findByCartCartidAndProductPid(cart.getCartid(), productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found in cart"));

        // Check stock availability
        Products product = cartItem.getProduct();
        Inventory inventory = inventoryRepository.findByProductPid(productId)
                .orElseThrow(() -> new IllegalArgumentException("No inventory record found"));

        int availableStock = inventory.getAvailableQuantity();
        
        if (newQuantity > availableStock) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getProductname() + 
                    ". Available: " + availableStock + ", Requested: " + newQuantity);
        }

        // Update quantity
        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        // Refresh cart to get updated items
        cart = cartRepository.findById(cart.getCartid())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        return new CartResponse(cart);
    }

    /**
     * Remove a product from the cart
     * 
     * @param userId The authenticated user's ID
     * @param productId The product ID to remove
     * @return CartResponse DTO with updated cart
     * @throws IllegalArgumentException if cart or product not found
     */
    @Transactional
    public CartResponse removeFromCart(Long userId, Long productId) {
        // Get cart
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));

        // Find and delete cart item
        CartItem cartItem = cartItemRepository.findByCartCartidAndProductPid(cart.getCartid(), productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found in cart"));

        cartItemRepository.delete(cartItem);
        cart.removeCartItem(cartItem);

        // Refresh cart to get updated items
        cart = cartRepository.findById(cart.getCartid())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        return new CartResponse(cart);
    }

    /**
     * Clear all items from the cart
     * 
     * This removes all products from the user's cart.
     * 
     * @param userId The authenticated user's ID
     * @return CartResponse DTO with empty cart
     * @throws IllegalArgumentException if cart not found
     */
    @Transactional
    public CartResponse clearCart(Long userId) {
        // Get cart
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));

        // Delete all cart items
        cartItemRepository.deleteByCartCartid(cart.getCartid());
        cart.clearCart();

        // Save cart
        cart = cartRepository.save(cart);

        return new CartResponse(cart);
    }

    /**
     * Get the total item count in the cart
     * 
     * This is used for displaying the cart badge in the navbar.
     * Returns the sum of all item quantities.
     * 
     * @param userId The authenticated user's ID
     * @return Total item count (0 if no cart exists)
     */
    public Integer getCartItemCount(Long userId) {
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElse(null);

        if (cart == null) {
            return 0;
        }

        return cartItemRepository.countTotalItemsInCart(cart.getCartid());
    }

    /**
     * Validate cart items before checkout
     * 
     * This method checks:
     * 1. Cart is not empty
     * 2. All products are still available
     * 3. Sufficient stock exists for all items
     * 
     * This is called before placing an order to ensure cart is valid.
     * 
     * @param userId The authenticated user's ID
     * @throws IllegalArgumentException if validation fails
     */
    public void validateCartForCheckout(Long userId) {
        // Get cart
        Cart cart = cartRepository.findByUserUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));

        // Check if cart is empty
        if (cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // Validate each item
        for (CartItem cartItem : cart.getCartItems()) {
            Products product = cartItem.getProduct();
            
            // Check if product is still available
            if (!"Available".equalsIgnoreCase(product.getStatus())) {
                throw new IllegalArgumentException("Product is no longer available: " + product.getProductname());
            }

            // Check stock
            Inventory inventory = inventoryRepository.findByProductPid(product.getPid())
                    .orElseThrow(() -> new IllegalArgumentException("No inventory record found for: " + product.getProductname()));

            int availableStock = inventory.getAvailableQuantity();
            
            if (cartItem.getQuantity() > availableStock) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getProductname() + 
                        ". Available: " + availableStock + ", In cart: " + cartItem.getQuantity());
            }
        }
    }
}
