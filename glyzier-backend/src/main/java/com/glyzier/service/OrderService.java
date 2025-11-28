package com.glyzier.service;

import com.glyzier.dto.OrderItemRequest;
import com.glyzier.dto.OrderResponse;
import com.glyzier.dto.PlaceOrderRequest;
import com.glyzier.model.*;
import com.glyzier.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * OrderService - Business logic for order-related operations
 * 
 * This service handles all order processing functionality in the Glyzier platform.
 * It manages simulated order placement, order history retrieval, and order details.
 * 
 * IMPORTANT: This is a SIMULATED implementation for a university project.
 * - No real payment processing is implemented
 * - Inventory decrementing is simple and not production-ready
 * - No handling of race conditions or complex order workflows
 * 
 * Key responsibilities:
 * - Process order placement (simulated)
 * - Calculate order totals
 * - Update inventory (simple decrement)
 * - Create order and order item records
 * - Retrieve order history for users
 * - Retrieve individual order details
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class OrderService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private OrderProductsRepository orderProductsRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private SellerRepository sellerRepository;

    /**
     * Place an order for the authenticated user (SIMULATED)
     * 
     * This method simulates the order placement process:
     * 1. Validates the user exists
     * 2. For each item in the order:
     *    - Finds the product
     *    - Validates stock availability
     *    - Decrements inventory (simple simulation - no race condition handling)
     *    - Creates order item with product name and price snapshot
     * 3. Calculates total price
     * 4. Creates the main order record
     * 5. Links all order items to the order
     * 
     * Note: In a real e-commerce system, this would involve:
     * - Payment gateway integration
     * - Transaction rollback on payment failure
     * - Stock reservation during checkout
     * - Concurrent order handling
     * - Email confirmations
     * - Complex order state management
     * 
     * @param userId The authenticated user's ID
     * @param request The order request containing items and quantities
     * @return OrderResponse DTO containing the created order details
     * @throws IllegalArgumentException if user not found, product not found, or insufficient stock
     */
    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        // Step 1: Get the authenticated user
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Validate request has items
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Step 2: Create the main order record (initially without total)
        Orders order = new Orders();
        order.setUser(user);
        order.setStatus("Pending"); // Initial status
        order.setTotal(BigDecimal.ZERO); // Will be calculated below
        // Capture delivery address from request if provided
        if (request.getAddress() != null) {
            order.setDeliveryAddress(request.getAddress());
        }

        // Save order first to get its ID
        order = ordersRepository.save(order);

        // Step 3: Process each order item
        BigDecimal orderTotal = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            // Validate quantity
            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than 0 for product ID: " + itemRequest.getPid());
            }

            // Find the product
            Products product = productsRepository.findById(itemRequest.getPid())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemRequest.getPid()));

            // Check if product is available
            if (!"Available".equalsIgnoreCase(product.getStatus())) {
                throw new IllegalArgumentException("Product is not available: " + product.getProductname());
            }

            // Step 4: Simulate inventory check and decrement
            // Find inventory for this product
            Inventory inventory = inventoryRepository.findByProductPid(product.getPid())
                    .orElseThrow(() -> new IllegalArgumentException("No inventory record found for product: " + product.getProductname()));

            // Check if enough stock is available (skip for unlimited inventory)
            boolean isUnlimited = inventory.isUnlimited();
            
            if (!isUnlimited) {
                // Available = qtyonhand - qtyreserved
                int availableQuantity = inventory.getQtyonhand() - inventory.getQtyreserved();
                
                if (availableQuantity < itemRequest.getQuantity()) {
                    throw new IllegalArgumentException("Insufficient stock for product: " + product.getProductname() + 
                            ". Available: " + availableQuantity + ", Requested: " + itemRequest.getQuantity());
                }

                // Decrement inventory (SIMULATED - no race condition handling)
                // In a real system, you would:
                // - Use database locks or optimistic locking
                // - Reserve stock first, then confirm after payment
                // - Handle concurrent orders properly
                inventory.setQtyonhand(inventory.getQtyonhand() - itemRequest.getQuantity());
            }
            // For unlimited inventory (digital products), skip decrement
            inventoryRepository.save(inventory);

            // Step 5: Create Order_Products entity with snapshot data
            // We store the product name and unit price at the time of order
            // This preserves historical accuracy even if the product changes later
            OrderProducts orderProduct = new OrderProducts();
            orderProduct.setOrder(order);
            orderProduct.setProduct(product);
            orderProduct.setProductNameSnapshot(product.getProductname()); // Snapshot
            orderProduct.setUnitPrice(product.getPrice()); // Snapshot
            orderProduct.setQuantity(itemRequest.getQuantity());

            // Save the order product
            orderProduct = orderProductsRepository.save(orderProduct);

            // Add to order's product list
            order.addOrderProduct(orderProduct);

            // Step 6: Calculate line total and add to order total
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            orderTotal = orderTotal.add(lineTotal);
        }

        // Step 7: Update order with calculated total
        order.setTotal(orderTotal);
        order = ordersRepository.save(order);

        // Step 8: Return order response
        return new OrderResponse(order);
    }

    /**
     * Get order history for the authenticated user
     * 
     * Returns all orders placed by the user, ordered by most recent first.
     * Does not include full order item details (use getOrderById for that).
     * 
     * @param userId The authenticated user's ID
     * @return List of OrderResponse DTOs (without detailed items)
     */
    public List<OrderResponse> getMyOrderHistory(Long userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Get all orders for this user, ordered by date (newest first)
        List<Orders> orders = ordersRepository.findByUserUseridOrderByPlacedAtDesc(userId);

        // Convert to DTOs without detailed items (for performance)
        return orders.stream()
                .map(order -> new OrderResponse(order, false)) // false = don't include items
                .collect(Collectors.toList());
    }

    /**
     * Get detailed information for a specific order
     * 
     * Returns the complete order details including all order items.
     * Validates that the order belongs to the requesting user.
     * 
     * @param userId The authenticated user's ID
     * @param orderId The order ID to retrieve
     * @return OrderResponse DTO with complete order details
     * @throws IllegalArgumentException if order not found or doesn't belong to user
     */
    public OrderResponse getOrderById(Long userId, Long orderId) {
        // Find the order
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Verify ownership - ensure the order belongs to the requesting user
        if (!order.getUser().getUserid().equals(userId)) {
            throw new IllegalArgumentException("You do not have permission to view this order");
        }

        // Return complete order details with items
        return new OrderResponse(order, true); // true = include items
    }

    /**
     * Get orders containing seller's products (Module 13 - Seller Order Management)
     * 
     * This method returns all orders that contain at least one product belonging to the seller.
     * Each order response includes only the order items that belong to the seller.
     * 
     * This allows sellers to:
     * - See which orders include their products
     * - Track order status for fulfillment
     * - Manage their product deliveries
     * 
     * @param userId The authenticated user's ID (must be a seller)
     * @return List of OrderResponse DTOs containing orders with seller's products
     * @throws IllegalArgumentException if user is not a seller
     */
    public List<OrderResponse> getSellerOrders(Long userId) {
        // Step 1: Verify user is a seller
        Seller seller = sellerRepository.findByUserUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("User is not a seller"));
        
        // Step 2: Get all orders
        List<Orders> allOrders = ordersRepository.findAll();
        
        // Step 3: Filter orders to include only those containing seller's products
        List<OrderResponse> sellerOrders = allOrders.stream()
                .filter(order -> {
                    // Check if this order contains any of the seller's products
                    return order.getOrderProducts().stream()
                            .anyMatch(op -> op.getProduct().getSeller().getSid().equals(seller.getSid()));
                })
                .map(order -> {
                    // Create order response with full details
                    OrderResponse response = new OrderResponse(order, true);
                    
                    // Filter items to show only seller's products
                    // This gives the seller a clear view of which items they need to fulfill
                    List<com.glyzier.dto.OrderProductResponse> sellerItems = response.getItems().stream()
                            .filter(item -> {
                                // Find the actual product to check seller
                                Products product = productsRepository.findById(item.getPid())
                                        .orElse(null);
                                return product != null && product.getSeller().getSid().equals(seller.getSid());
                            })
                            .collect(Collectors.toList());
                    
                    response.setItems(sellerItems);
                    return response;
                })
                .sorted((o1, o2) -> o2.getPlacedAt().compareTo(o1.getPlacedAt())) // Sort by most recent first
                .collect(Collectors.toList());
        
        return sellerOrders;
    }

    /**
     * Get all orders (admin functionality - optional for future use)
     * 
     * This could be used by administrators to view all orders in the system.
     * Not part of the current module requirements but included for completeness.
     * 
     * @return List of all OrderResponse DTOs
     */
    public List<OrderResponse> getAllOrders() {
        List<Orders> orders = ordersRepository.findAll();
        
        return orders.stream()
                .map(order -> new OrderResponse(order, false))
                .collect(Collectors.toList());
    }

    /**
     * Update order status (Module 13 - Seller Order Management)
     * 
     * This method allows sellers to update the status of orders containing their products.
     * The system verifies that the user is a seller and that they own at least one product in the order.
     * 
     * Valid status values:
     * - "Pending" - Order placed, awaiting processing
     * - "Processing" - Order is being prepared
     * - "Shipped" - Order has been shipped to customer
     * - "Delivered" - Order has been delivered
     * - "Cancelled" - Order was cancelled
     * 
     * @param userId The authenticated user's ID (must be a seller)
     * @param orderId The order ID to update
     * @param newStatus The new status value
     * @return Updated OrderResponse DTO
     * @throws IllegalArgumentException if order not found, user not a seller, or seller doesn't own products in order
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long userId, Long orderId, String newStatus) {
        // Step 1: Verify user is a seller
        Seller seller = sellerRepository.findByUserUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("User is not a seller"));
        
        // Step 2: Find the order
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        
        // Step 3: Verify seller owns at least one product in this order
        boolean hasSellerProducts = order.getOrderProducts().stream()
                .anyMatch(op -> op.getProduct().getSeller().getSid().equals(seller.getSid()));
        
        if (!hasSellerProducts) {
            throw new IllegalArgumentException("You do not have permission to update this order - none of your products are in this order");
        }
        
        // Step 4: Validate status value
        List<String> validStatuses = List.of("Pending", "Processing", "Shipped", "Delivered", "Cancelled");
        if (!validStatuses.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status. Valid values are: " + String.join(", ", validStatuses));
        }
        
        // Step 5: Update the status
        order.setStatus(newStatus);
        order = ordersRepository.save(order);

        return new OrderResponse(order, true);
    }

    /**
     * Place an order from the user's shopping cart (Module 9)
     * 
     * This method replaces the single-product checkout with cart-based checkout.
     * It validates the cart, converts all cart items to order items, and clears the cart.
     * 
     * Process:
     * 1. Validates cart is not empty and all items are valid
     * 2. Converts cart items to order items
     * 3. Processes the order (same as regular placeOrder)
     * 4. Clears the cart after successful order
     * 
     * @param userId The authenticated user's ID
     * @return OrderResponse DTO containing the created order details
     * @throws IllegalArgumentException if cart is empty, invalid, or order fails
     */
    @Transactional
    public OrderResponse placeOrderFromCart(Long userId, PlaceOrderRequest request) {
        // Step 1: Validate cart before checkout
        cartService.validateCartForCheckout(userId);

        // Step 2: Get cart details
        com.glyzier.dto.CartResponse cartResponse = cartService.getCart(userId);

        // Step 3: Convert cart items to order item requests
        PlaceOrderRequest orderRequest = new PlaceOrderRequest();
        java.util.List<OrderItemRequest> orderItems = new java.util.ArrayList<>();

        for (com.glyzier.dto.CartItemResponse cartItem : cartResponse.getItems()) {
            OrderItemRequest orderItem = new OrderItemRequest();
            orderItem.setPid(cartItem.getPid());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItems.add(orderItem);
        }

        orderRequest.setItems(orderItems);
        // Propagate delivery address and card number from incoming request
        if (request != null) {
            orderRequest.setAddress(request.getAddress());
            orderRequest.setCardNumber(request.getCardNumber());
        }

        // Step 4: Place the order using the existing method
        OrderResponse orderResponse = placeOrder(userId, orderRequest);

        // Step 5: Clear the cart after successful order
        cartService.clearCart(userId);

        return orderResponse;
    }
}
