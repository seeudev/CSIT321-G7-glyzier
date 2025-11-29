/**
 * AdminDashboardPage Component
 * 
 * Main dashboard page for admins showing key statistics.
 * Displays total users, products, orders, and revenue.
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import { getDashboardStats } from '../services/adminService';
import styles from '../styles/pages/Admin.module.css';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Welcome back! Here's an overview of your platform.
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading dashboard...</div>
        ) : stats ? (
          <div className={styles.statsGrid}>
            {/* Total Users Card */}
            <div className={styles.statCard}>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className={styles.statLabel}>Total Users</p>
              <p className={styles.statValue}>{stats.totalUsers || 0}</p>
            </div>

            {/* Total Products Card */}
            <div className={styles.statCard}>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className={styles.statLabel}>Total Products</p>
              <p className={styles.statValue}>{stats.totalProducts || 0}</p>
            </div>

            {/* Total Orders Card */}
            <div className={styles.statCard}>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className={styles.statLabel}>Total Orders</p>
              <p className={styles.statValue}>{stats.totalOrders || 0}</p>
            </div>

            {/* Total Revenue Card */}
            <div className={styles.statCard}>
              <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={styles.statLabel}>Total Revenue</p>
              <p className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        ) : (
          <div className={styles.empty}>No data available</div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
