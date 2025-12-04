/**
 * SellerProfilePage Component
 * 
 * This page allows sellers to manage their seller profile information.
 * Similar to the user ProfilePage but for seller-specific data.
 * 
 * Features:
 * - View and edit seller shop name
 * - Edit store bio/description
 * - Display seller since date
 * - View associated user email (read-only)
 * - Save changes with validation
 * 
 * Design:
 * - Modern card-based layout matching ProfilePage
 * - Uses CSS modules for styling
 * - Reuses shared form and button styles
 * - Displays success/error notifications
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMySellerProfile } from '../services/sellerService';
import { updateSellerProfile } from '../services/sellerService';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import { PackageIcon } from '../components/Icons';
import { showSuccess, showError } from '../components/NotificationManager';
import styles from '../styles/pages/ProfilePage.module.css';
import buttons from '../styles/shared/buttons.module.css';
import forms from '../styles/shared/forms.module.css';

/**
 * SellerProfilePage functional component
 * 
 * @returns {JSX.Element} The seller profile management page
 */
function SellerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for seller profile data
  const [sellerData, setSellerData] = useState({
    sellername: '',
    storebio: '',
    email: '',
    createdAt: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  /**
   * Fetch seller profile data on component mount
   */
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setProfileLoading(true);
        const data = await getMySellerProfile();
        setSellerData({
          sellername: data.sellername || '',
          storebio: data.storebio || '',
          email: data.user?.email || user?.email || '',
          createdAt: data.createdAt || ''
        });
      } catch (err) {
        console.error('Failed to fetch seller data:', err);
        if (err.message.includes('not a seller')) {
          showError('You must be a seller to access this page');
          navigate('/dashboard');
        } else {
          showError('Failed to load seller profile');
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchSellerData();
  }, [user, navigate]);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle profile update submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate seller name
    if (!sellerData.sellername || sellerData.sellername.trim().length < 3) {
      showError('Shop name must be at least 3 characters');
      return;
    }

    if (sellerData.sellername.length > 100) {
      showError('Shop name must not exceed 100 characters');
      return;
    }

    // Validate store bio length
    if (sellerData.storebio && sellerData.storebio.length > 1000) {
      showError('Store bio must not exceed 1000 characters');
      return;
    }

    try {
      setProfileSaving(true);
      await updateSellerProfile({
        sellername: sellerData.sellername,
        storebio: sellerData.storebio || null
      });
      
      showSuccess('Seller profile updated successfully!');
    } catch (err) {
      console.error('Failed to update seller profile:', err);
      const errorMsg = err.response?.data?.error || 'Failed to update seller profile';
      showError(errorMsg);
    } finally {
      setProfileSaving(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.page}>
      <Navigation />
      
      {/* Header Section */}
      <div className={styles.header}>
        <Aurora 
          colorStops={['#667eea', '#764ba2', '#f093fb']}
          amplitude={1.2}
          blend={0.6}
          speed={0.4}
        />
        <div className={styles.headerCard}>
          <div className={styles.headerContent}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.title}>Seller Profile</h1>
              <p className={styles.subtitle}>Manage your shop information</p>
            </div>
            <div className={styles.headerActions}>
              <Link to="/seller/dashboard" className={styles.backButton}>
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>

        {/* Loading State */}
        {profileLoading ? (
          <div className={styles.loadingContainer}>
            <p>Loading seller profile...</p>
          </div>
        ) : (
          <div className={styles.formContainer}>
            {/* Seller Information Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Shop Information</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Shop Name Field */}
                <div className={forms.formGroup}>
                  <label htmlFor="sellername" className={forms.label}>
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    id="sellername"
                    name="sellername"
                    value={sellerData.sellername}
                    onChange={handleChange}
                    className={forms.input}
                    placeholder="Your shop name"
                    required
                    minLength={3}
                    maxLength={100}
                  />
                  <small className={styles.fieldNote}>
                    Your unique shop name (3-100 characters)
                  </small>
                </div>

                {/* Store Bio Field */}
                <div className={forms.formGroup}>
                  <label htmlFor="storebio" className={forms.label}>
                    Store Bio <span className={styles.optional}>(Optional)</span>
                  </label>
                  <textarea
                    id="storebio"
                    name="storebio"
                    value={sellerData.storebio}
                    onChange={handleChange}
                    className={forms.formTextarea}
                    placeholder="Tell customers about your shop..."
                    rows={5}
                    maxLength={1000}
                  />
                  <small className={styles.fieldNote}>
                    Describe your shop and products ({sellerData.storebio.length}/1000 characters)
                  </small>
                </div>

                {/* Email Field (Read-Only) */}
                <div className={forms.formGroup}>
                  <label htmlFor="email" className={forms.label}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={sellerData.email}
                    className={`${forms.input} ${styles.readOnlyField}`}
                    readOnly
                    disabled
                  />
                  <small className={styles.fieldNote}>
                    This is your user account email
                  </small>
                </div>

                {/* Seller Since (Read-Only) */}
                <div className={forms.formGroup}>
                  <label className={forms.label}>
                    Seller Since
                  </label>
                  <input
                    type="text"
                    value={formatDate(sellerData.createdAt)}
                    className={`${forms.input} ${styles.readOnlyField}`}
                    readOnly
                    disabled
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className={buttons.primaryButton}
                  disabled={profileSaving}
                >
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfilePage;
