/**
 * AdminUsersPage Component
 * 
 * User management page for admins.
 * Displays list of all users with ban/unban functionality.
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
import { getAllUsers, banUser, unbanUser } from '../../services/adminService';
import styles from '../../styles/pages/Admin.module.css';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userid) => {
    if (!window.confirm('Are you sure you want to ban this user?')) {
      return;
    }

    try {
      setActionLoading(userid);
      await banUser(userid);
      // Refresh users list
      await fetchUsers();
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userid) => {
    try {
      setActionLoading(userid);
      await unbanUser(userid);
      // Refresh users list
      await fetchUsers();
    } catch (err) {
      console.error('Error unbanning user:', err);
      alert('Failed to unban user. Please try again.');
    } finally {
      setActionLoading(null);
    }
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
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSubtitle}>
            Manage user accounts and permissions
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading users...</div>
        ) : (
          <div className={styles.tableContainer}>
            <h2 className={styles.tableTitle}>All Users ({users.length})</h2>
            
            {users.length === 0 ? (
              <div className={styles.empty}>No users found</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Shop</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((usr) => (
                    <tr key={usr.userid}>
                      <td>{usr.userid}</td>
                      <td>{usr.displayname}</td>
                      <td>{usr.email}</td>
                      <td>
                        <span className={`${styles.badge} ${
                          usr.isAdmin ? styles.badgeAdmin : styles.badgeUser
                        }`}>
                          {usr.isAdmin ? 'ADMIN' : (usr.shopName ? 'SELLER' : 'USER')}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${
                          usr.status === 'ACTIVE' ? styles.badgeActive : styles.badgeBanned
                        }`}>
                          {usr.status}
                        </span>
                      </td>
                      <td>{usr.shopName || '-'}</td>
                      <td>{formatDate(usr.createdAt)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {usr.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleBanUser(usr.userid)}
                              disabled={actionLoading === usr.userid || usr.isAdmin}
                              className={`${styles.btnAction} ${styles.btnBan}`}
                            >
                              {actionLoading === usr.userid ? 'Banning...' : 'Ban'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnbanUser(usr.userid)}
                              disabled={actionLoading === usr.userid}
                              className={`${styles.btnAction} ${styles.btnUnban}`}
                            >
                              {actionLoading === usr.userid ? 'Unbanning...' : 'Unban'}
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

export default AdminUsersPage;
