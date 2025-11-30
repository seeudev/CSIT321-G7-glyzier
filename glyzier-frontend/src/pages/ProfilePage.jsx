/**
 * ProfilePage Component
 * 
 * This page allows authenticated users to manage their profile information.
 * 
 * Features (Module 14 - Basic User Profile):
 * - View and edit display name
 * - View email (read-only for security)
 * - Add/edit phone number (optional)
 * - Change password with current password verification
 * - Save changes with validation
 * 
 * Design:
 * - Modern card-based layout with sections
 * - Uses CSS modules for styling
 * - Reuses shared form and button styles
 * - Displays success/error notifications
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 14 - Basic User Profile)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getCurrentUser, updateProfile, changePassword } from '../services/userService';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import { UserIcon } from '../components/Icons';
import { showSuccess, showError } from '../components/NotificationManager';
import styles from '../styles/pages/ProfilePage.module.css';
import buttons from '../styles/shared/buttons.module.css';
import forms from '../styles/shared/forms.module.css';

/**
 * ProfilePage functional component
 * 
 * @returns {JSX.Element} The profile management page
 */
function ProfilePage() {
  const { user: authUser, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // State for profile data
  const [profileData, setProfileData] = useState({
    displayname: '',
    email: '',
    phonenumber: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  /**
   * Fetch current user data on component mount
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setProfileLoading(true);
        const data = await getCurrentUser();
        setProfileData({
          displayname: data.displayname || '',
          email: data.email || '',
          phonenumber: data.phonenumber || ''
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        showError('Failed to load profile data');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /**
   * Handle profile form input changes
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle password form input changes
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle profile update submission
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Validate display name
    if (!profileData.displayname || profileData.displayname.trim().length < 2) {
      showError('Display name must be at least 2 characters');
      return;
    }

    try {
      setProfileSaving(true);
      await updateProfile({
        displayname: profileData.displayname,
        phonenumber: profileData.phonenumber || null
      });
      
      // Refresh user data in AuthContext to reflect changes immediately
      await refreshUser();
      
      showSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMsg = err.response?.data?.error || 'Failed to update profile';
      showError(errorMsg);
    } finally {
      setProfileSaving(false);
    }
  };

  /**
   * Handle password change submission
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password fields
    if (!passwordData.currentPassword) {
      showError('Current password is required');
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      showError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New password and confirmation do not match');
      return;
    }

    try {
      setPasswordChanging(true);
      await changePassword(passwordData);
      showSuccess('Password changed successfully!');
      
      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Failed to change password:', err);
      const errorMsg = err.response?.data?.error || 'Failed to change password';
      showError(errorMsg);
    } finally {
      setPasswordChanging(false);
    }
  };

  /**
   * Toggle password form visibility
   */
  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    // Clear password data when hiding form
    if (showPasswordForm) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navigation />
      
      <div className={styles.content}>
        {/* Page Header */}
        <div className={styles.header}>
          <Aurora 
            colorStops={['#667eea', '#764ba2', '#f093fb']}
            amplitude={1.2}
            blend={0.6}
            speed={0.4}
          />
          <div className={styles.headerCard}>
            <div className={styles.headerContent}>
              <UserIcon className={styles.headerIcon} />
              <div>
                <h1 className={styles.title}>Profile Settings</h1>
                <p className={styles.subtitle}>Manage your account information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {profileLoading ? (
          <div className={styles.loadingContainer}>
            <p>Loading profile...</p>
          </div>
        ) : (
          <div className={styles.formContainer}>
            {/* Profile Information Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className={styles.form}>
                {/* Display Name Field */}
                <div className={forms.formGroup}>
                  <label htmlFor="displayname" className={forms.label}>
                    Display Name *
                  </label>
                  <input
                    type="text"
                    id="displayname"
                    name="displayname"
                    value={profileData.displayname}
                    onChange={handleProfileChange}
                    className={forms.input}
                    placeholder="Your display name"
                    required
                    minLength={2}
                    maxLength={100}
                  />
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
                    value={profileData.email}
                    className={`${forms.input} ${styles.readOnlyField}`}
                    readOnly
                    disabled
                  />
                  <small className={styles.fieldNote}>
                    Email cannot be changed for security reasons
                  </small>
                </div>

                {/* Phone Number Field (Optional) */}
                <div className={forms.formGroup}>
                  <label htmlFor="phonenumber" className={forms.label}>
                    Phone Number <span className={styles.optional}>(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phonenumber"
                    name="phonenumber"
                    value={profileData.phonenumber}
                    onChange={handleProfileChange}
                    className={forms.input}
                    placeholder="+1 234 567 8900"
                    maxLength={20}
                  />
                  <small className={styles.fieldNote}>
                    Used for order notifications and account recovery
                  </small>
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

            {/* Password Change Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Password & Security</h2>
              
              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={togglePasswordForm}
                  className={buttons.secondaryButton}
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordSubmit} className={styles.form}>
                  {/* Current Password */}
                  <div className={forms.formGroup}>
                    <label htmlFor="currentPassword" className={forms.label}>
                      Current Password *
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={forms.input}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className={forms.formGroup}>
                    <label htmlFor="newPassword" className={forms.label}>
                      New Password *
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={forms.input}
                      placeholder="Enter new password (min 8 characters)"
                      required
                      minLength={8}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className={forms.formGroup}>
                    <label htmlFor="confirmPassword" className={forms.label}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={forms.input}
                      placeholder="Re-enter new password"
                      required
                      minLength={8}
                    />
                  </div>

                  {/* Password Form Buttons */}
                  <div className={styles.buttonGroup}>
                    <button
                      type="submit"
                      className={buttons.primaryButton}
                      disabled={passwordChanging}
                    >
                      {passwordChanging ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={togglePasswordForm}
                      className={buttons.secondaryButton}
                      disabled={passwordChanging}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
