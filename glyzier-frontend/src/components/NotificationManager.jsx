/**
 * NotificationManager Component
 * 
 * A beautiful toast notification system with gradient theme.
 * Replaces browser alerts with elegant slide-in notifications.
 * 
 * Features:
 * - Success, error, and info variants
 * - Auto-dismiss after 5 seconds
 * - Slide-in animations from bottom-right
 * - Gradient backgrounds matching app theme
 * - Stack multiple notifications
 * 
 * Usage:
 * import { showNotification } from '../components/NotificationManager';
 * 
 * showNotification('Product added to cart!', 'success');
 * showNotification('Failed to load data', 'error');
 * showNotification('Please login to continue', 'info');
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import styles from '../styles/components/NotificationManager.module.css';

let notificationRoot = null;
let notificationContainer = null;
let setNotifications = null;

/**
 * Initialize notification system
 */
const initNotificationSystem = () => {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
    notificationRoot = createRoot(notificationContainer);
  }
};

/**
 * Notification Component
 */
const NotificationList = ({ notifications, onRemove }) => {
  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
        >
          <div className={styles.iconWrapper}>
            {notification.type === 'success' && <span className={styles.icon}>✓</span>}
            {notification.type === 'error' && <span className={styles.icon}>✕</span>}
            {notification.type === 'info' && <span className={styles.icon}>i</span>}
          </div>
          <div className={styles.content}>
            <p className={styles.message}>{notification.message}</p>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => onRemove(notification.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

/**
 * Notification Manager Component
 */
const NotificationManager = () => {
  const [notifications, setNotificationsState] = useState([]);

  useEffect(() => {
    setNotifications = setNotificationsState;
  }, []);

  const removeNotification = (id) => {
    setNotificationsState((prev) => prev.filter((n) => n.id !== id));
  };

  return <NotificationList notifications={notifications} onRemove={removeNotification} />;
};

/**
 * Show a notification
 * 
 * @param {string} message - The message to display
 * @param {string} type - Notification type: 'success', 'error', or 'info'
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
export const showNotification = (message, type = 'info', duration = 5000) => {
  initNotificationSystem();

  const id = Date.now() + Math.random();
  const notification = { id, message, type };

  if (!notificationRoot || !setNotifications) {
    // Fallback to console if system not ready
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }

  // Render NotificationManager if not already rendered
  if (!setNotifications) {
    notificationRoot.render(<NotificationManager />);
  }

  // Add notification
  setNotifications((prev) => [...prev, notification]);

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }
};

/**
 * Show success notification
 */
export const showSuccess = (message, duration = 5000) => {
  showNotification(message, 'success', duration);
};

/**
 * Show error notification
 */
export const showError = (message, duration = 6000) => {
  showNotification(message, 'error', duration);
};

/**
 * Show info notification
 */
export const showInfo = (message, duration = 5000) => {
  showNotification(message, 'info', duration);
};

/**
 * Show confirmation dialog with custom styling
 * Returns a Promise that resolves to true/false
 */
export const showConfirm = (message) => {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.className = styles.confirmOverlay || 'confirm-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = styles.confirmDialog || 'confirm-dialog';
    dialog.innerHTML = `
      <div class="${styles.confirmContent || 'confirm-content'}">
        <p class="${styles.confirmMessage || 'confirm-message'}">${message}</p>
        <div class="${styles.confirmButtons || 'confirm-buttons'}">
          <button class="${styles.confirmButtonNo || 'confirm-button-no'}" id="confirm-no">Cancel</button>
          <button class="${styles.confirmButtonYes || 'confirm-button-yes'}" id="confirm-yes">Confirm</button>
        </div>
      </div>
    `;
    
    container.appendChild(dialog);
    document.body.appendChild(container);
    
    const cleanup = () => {
      container.classList.add(styles.fadeOut || 'fade-out');
      setTimeout(() => {
        document.body.removeChild(container);
      }, 300);
    };
    
    document.getElementById('confirm-yes').onclick = () => {
      cleanup();
      resolve(true);
    };
    
    document.getElementById('confirm-no').onclick = () => {
      cleanup();
      resolve(false);
    };
    
    container.onclick = (e) => {
      if (e.target === container) {
        cleanup();
        resolve(false);
      }
    };
  });
};

// Initialize on import
initNotificationSystem();
notificationRoot?.render(<NotificationManager />);

export default NotificationManager;
