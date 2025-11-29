/**
 * AdminProductsPage Component
 * 
 * Product moderation page for admins.
 * Displays list of all products with remove/restore functionality.
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllProducts, removeProduct, restoreProduct } from '../../services/adminService';
import styles from '../../styles/pages/Admin.module.css';

const AdminProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (pid) => {
    if (!window.confirm('Are you sure you want to remove this product?')) {
      return;
    }

    try {
      setActionLoading(pid);
      await removeProduct(pid);
      // Refresh products list
      await fetchProducts();
    } catch (err) {
      console.error('Error removing product:', err);
      alert('Failed to remove product. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestoreProduct = async (pid) => {
    try {
      setActionLoading(pid);
      await restoreProduct(pid);
      // Refresh products list
      await fetchProducts();
    } catch (err) {
      console.error('Error restoring product:', err);
      alert('Failed to restore product. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Product Moderation</h1>
          <p className={styles.pageSubtitle}>
            Manage and moderate platform products
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading products...</div>
        ) : (
          <div className={styles.tableContainer}>
            <h2 className={styles.tableTitle}>All Products ({products.length})</h2>
            
            {products.length === 0 ? (
              <div className={styles.empty}>No products found</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Seller</th>
                    <th>Shop</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.pid}>
                      <td>{product.pid}</td>
                      <td>{product.productname}</td>
                      <td>{product.type}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <span className={`${styles.badge} ${
                          product.status === 'ACTIVE' ? styles.badgeActive : styles.badgeDeleted
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td>{product.sellerEmail}</td>
                      <td>{product.shopName}</td>
                      <td>{formatDate(product.createdAt)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {product.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleRemoveProduct(product.pid)}
                              disabled={actionLoading === product.pid}
                              className={`${styles.btnAction} ${styles.btnRemove}`}
                            >
                              {actionLoading === product.pid ? 'Removing...' : 'Remove'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestoreProduct(product.pid)}
                              disabled={actionLoading === product.pid}
                              className={`${styles.btnAction} ${styles.btnRestore}`}
                            >
                              {actionLoading === product.pid ? 'Restoring...' : 'Restore'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductsPage;
