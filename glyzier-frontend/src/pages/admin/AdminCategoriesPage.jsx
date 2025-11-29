/**
 * AdminCategoriesPage Component
 * 
 * Simple category management page for admins.
 * For this minimal implementation, we'll just display hardcoded categories.
 * (Full category CRUD can be added in future iterations)
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
import styles from '../../styles/pages/Admin.module.css';

const AdminCategoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hardcoded categories for this minimal implementation
  const [categories] = useState([
    { id: 1, name: 'Digital Art', productCount: 0 },
    { id: 2, name: 'Prints', productCount: 0 },
    { id: 3, name: 'Original Art', productCount: 0 },
    { id: 4, name: 'Photography', productCount: 0 },
    { id: 5, name: 'Illustrations', productCount: 0 },
    { id: 6, name: 'Paintings', productCount: 0 },
  ]);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Category Management</h1>
          <p className={styles.pageSubtitle}>
            Manage product categories (Minimal Implementation)
          </p>
        </div>

        <div className={styles.tableContainer}>
          <h2 className={styles.tableTitle}>Product Categories ({categories.length})</h2>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Product Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.productCount}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeActive}`}>
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#4a5568', fontSize: '0.875rem' }}>
              <strong>Note:</strong> This is a minimal category display. 
              Full category CRUD functionality (add, edit, delete) can be added in future iterations.
              Currently, categories are hardcoded and used for product filtering.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCategoriesPage;
