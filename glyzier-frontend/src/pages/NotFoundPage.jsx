/**
 * NotFoundPage Component - 404 Error Page
 * 
 * Displays when user navigates to an unknown or invalid URL.
 * Provides clear messaging and navigation options to return to the app.
 * 
 * Features:
 * - Clean, minimalist error message
 * - Primary action: Navigate to home page
 * - Secondary action: Go back to previous page
 * - Responsive design matching app aesthetics
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages/NotFound.module.css';
import buttons from '../styles/shared/buttons.module.css';

/**
 * NotFoundPage functional component
 * 
 * Renders a 404 error page with navigation options back to the application.
 * Uses React Router's useNavigate for programmatic navigation.
 * 
 * @returns {JSX.Element} The 404 error page
 */
function NotFoundPage() {
  const navigate = useNavigate();

  /**
   * Navigate back to the previous page in history
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * Navigate to the home page
   */
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Error Code Display */}
        <div className={styles.errorCode}>404</div>
        
        {/* Error Message */}
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.message}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Navigation Actions */}
        <div className={styles.actions}>
          <button 
            onClick={handleGoHome}
            className={buttons.primaryButton}
          >
            Go to Home
          </button>
          <button 
            onClick={handleGoBack}
            className={buttons.secondaryButton}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
