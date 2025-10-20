/**
 * Shared/Common Styles
 * 
 * This file contains reusable style objects that can be imported
 * and used across multiple components. This promotes consistency
 * and makes it easier to update styles globally.
 * 
 * These styles are intentionally simple and can be easily replaced
 * with custom styles from Figma wireframes in future iterations.
 * 
 * Usage:
 * import { buttonPrimary, buttonSecondary, card } from './styles/common';
 * <button style={buttonPrimary}>Click Me</button>
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 6)
 */

/**
 * Color Palette
 * Define colors in one place for easy customization
 */
export const colors = {
  primary: '#667eea',
  primaryDark: '#5568d3',
  secondary: '#764ba2',
  success: '#28a745',
  successLight: '#d4edda',
  successDark: '#155724',
  danger: '#dc3545',
  dangerLight: '#fee',
  dangerDark: '#c33',
  warning: '#ffc107',
  warningLight: '#fff3cd',
  white: '#ffffff',
  black: '#000000',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#dddddd',
  gray400: '#999999',
  gray500: '#666666',
  gray600: '#333333',
};

/**
 * Button Styles
 * Consistent button styling across the application
 */
export const buttonPrimary = {
  padding: '12px 24px',
  fontSize: '1em',
  fontWeight: 'bold',
  backgroundColor: colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
};

export const buttonSecondary = {
  ...buttonPrimary,
  backgroundColor: 'transparent',
  border: `2px solid ${colors.primary}`,
  color: colors.primary,
};

export const buttonDanger = {
  ...buttonPrimary,
  backgroundColor: colors.danger,
};

export const buttonDisabled = {
  ...buttonPrimary,
  backgroundColor: colors.gray400,
  cursor: 'not-allowed',
  opacity: 0.6,
};

/**
 * Card/Container Styles
 * Used for content sections and cards
 */
export const card = {
  backgroundColor: colors.white,
  padding: '25px',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

export const cardHover = {
  ...card,
  transition: 'box-shadow 0.3s, transform 0.3s',
  cursor: 'pointer',
};

/**
 * Form Styles
 * Consistent form element styling
 */
export const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '15px',
};

export const label = {
  fontWeight: 'bold',
  color: colors.gray600,
  fontSize: '0.95em',
};

export const input = {
  padding: '12px',
  fontSize: '1em',
  border: `1px solid ${colors.gray300}`,
  borderRadius: '5px',
  outline: 'none',
  transition: 'border-color 0.3s',
};

export const inputError = {
  ...input,
  borderColor: colors.danger,
};

/**
 * Alert/Message Styles
 * For error, success, warning messages
 */
export const alertError = {
  backgroundColor: colors.dangerLight,
  color: colors.dangerDark,
  padding: '12px',
  borderRadius: '5px',
  marginBottom: '20px',
  border: `1px solid #fcc`,
};

export const alertSuccess = {
  backgroundColor: colors.successLight,
  color: colors.successDark,
  padding: '12px',
  borderRadius: '5px',
  marginBottom: '20px',
  border: `1px solid #c3e6cb`,
};

export const alertWarning = {
  backgroundColor: colors.warningLight,
  color: '#856404',
  padding: '12px',
  borderRadius: '5px',
  marginBottom: '20px',
  border: `1px solid #ffeaa7`,
};

/**
 * Layout Styles
 * Common layout patterns
 */
export const container = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
};

export const containerFluid = {
  width: '100%',
  padding: '20px',
};

export const centerContainer = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.gray100,
  padding: '20px',
};

/**
 * Text/Typography Styles
 */
export const heading1 = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  color: colors.gray600,
  marginBottom: '10px',
};

export const heading2 = {
  fontSize: '2em',
  fontWeight: 'bold',
  color: colors.gray600,
  marginBottom: '10px',
};

export const heading3 = {
  fontSize: '1.5em',
  fontWeight: 'bold',
  color: colors.gray600,
  marginBottom: '10px',
};

export const textMuted = {
  color: colors.gray500,
  fontSize: '0.9em',
};

export const link = {
  color: colors.primary,
  textDecoration: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
};

/**
 * Grid/Flex Layouts
 */
export const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  gap: '15px',
  flexWrap: 'wrap',
};

export const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

export const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
};

/**
 * Utility Classes
 */
export const mt1 = { marginTop: '10px' };
export const mt2 = { marginTop: '20px' };
export const mt3 = { marginTop: '30px' };
export const mb1 = { marginBottom: '10px' };
export const mb2 = { marginBottom: '20px' };
export const mb3 = { marginBottom: '30px' };
export const textCenter = { textAlign: 'center' };
export const textLeft = { textAlign: 'left' };
export const textRight = { textAlign: 'right' };
