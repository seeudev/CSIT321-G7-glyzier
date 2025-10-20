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

            // Check if enough stock is available
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
     * Update order status (admin/seller functionality - optional for future use)
     * 
     * This could be used to update order status (e.g., "Pending" -> "Shipped" -> "Delivered").
     * Not part of the current module requirements but included for completeness.
     * 
     * @param orderId The order ID to update
     * @param newStatus The new status value
     * @return Updated OrderResponse DTO
     * @throws IllegalArgumentException if order not found
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        order = ordersRepository.save(order);

        return new OrderResponse(order, true);
    }
}
