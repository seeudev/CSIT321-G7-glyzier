package com.glyzier.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Cart Entity - Represents a user's shopping cart in the Glyzier platform
 * 
 * This entity maps to the 'cart' table in the database and stores
 * the shopping cart for each user. Each user has exactly one cart (1:1 relationship).
 * The cart contains multiple cart items (1:N relationship with CartItem).
 * 
 * Note: For this university project, the cart is database-backed for persistence.
 * When a user logs in, their cart is preserved from previous sessions.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
@Entity
@Table(name = "cart")
public class Cart {

    /**
     * Primary Key: Unique identifier for each cart
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartid")
    private Long cartid;

    /**
     * One-to-One relationship with Users entity
     * Foreign key reference to the user who owns this cart
     * A cart "belongs to" one user
     */
    @OneToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid", nullable = false, unique = true)
    private Users user;

    /**
     * Timestamp of when the cart was created
     * Automatically set when the entity is first persisted
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    /**
     * Timestamp of when the cart was last updated
     * Automatically updated whenever the entity is modified
     * Useful for tracking cart activity and cleanup
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    /**
     * One-to-Many relationship with CartItem entity
     * A cart contains many cart items (products with quantities)
     * mappedBy indicates that the CartItem entity owns the relationship
     * cascade = CascadeType.ALL means operations cascade to cart items
     * orphanRemoval = true means if an item is removed from this list, it's deleted
     */
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public Cart() {
    }

    /**
     * Constructor with user
     * 
     * @param user The user who owns this cart
     */
    public Cart(Users user) {
        this.user = user;
    }

    // Getters and Setters

    public Long getCartid() {
        return cartid;
    }

    public void setCartid(Long cartid) {
        this.cartid = cartid;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    /**
     * Helper method to add a cart item to this cart
     * Maintains bidirectional relationship consistency
     * 
     * @param cartItem The cart item to add
     */
    public void addCartItem(CartItem cartItem) {
        cartItems.add(cartItem);
        cartItem.setCart(this);
    }

    /**
     * Helper method to remove a cart item from this cart
     * Maintains bidirectional relationship consistency
     * 
     * @param cartItem The cart item to remove
     */
    public void removeCartItem(CartItem cartItem) {
        cartItems.remove(cartItem);
        cartItem.setCart(null);
    }

    /**
     * Helper method to get the total number of items in the cart
     * Sums up the quantities of all cart items
     * 
     * @return Total item count
     */
    public int getTotalItemCount() {
        return cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    /**
     * Helper method to clear all items from the cart
     * Removes all cart items (will be deleted due to orphanRemoval)
     */
    public void clearCart() {
        cartItems.clear();
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "Cart{" +
                "cartid=" + cartid +
                ", userid=" + (user != null ? user.getUserid() : null) +
                ", itemCount=" + getTotalItemCount() +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
