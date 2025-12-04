/**
 * Icon Components
 * 
 * Simple, lightweight SVG icon components using inline SVG.
 * No external libraries needed - pure React components.
 * 
 * Usage:
 * import { UserIcon, PackageIcon, ArtIcon } from '../components/Icons';
 * <UserIcon size={24} color="#2c3e50" />
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React from 'react';

/**
 * User Icon - Profile/Account representation
 */
export const UserIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/**
 * Package/Box Icon - Orders/Products representation
 */
export const PackageIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

/**
 * Art/Palette Icon - Creative/Seller representation
 */
export const ArtIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    <line x1="21.17" y1="16" x2="12" y2="16" />
    <line x1="3.95" y1="17.94" x2="8.54" y2="10" />
    <line x1="10.88" y1="2.06" x2="15.46" y2="10" />
  </svg>
);

/**
 * Shopping Cart Icon - Cart representation
 */
export const CartIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/**
 * Store/Shop Icon - Seller shop representation
 */
export const StoreIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

/**
 * Image/Picture Icon - Product image representation
 */
export const ImageIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

/**
 * Tag Icon - Category/Type representation
 */
export const TagIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

/**
 * Plus Icon - Add/Create action
 */
export const PlusIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/**
 * Edit Icon - Edit action
 */
export const EditIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

/**
 * Trash Icon - Delete action
 */
export const TrashIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/**
 * Check Icon - Success/Confirmation
 */
export const CheckIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * X Icon - Close/Cancel
 */
export const XIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Alert Icon - Warning/Alert
 */
export const AlertIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/**
 * Infinity Icon - Unlimited representation
 */
export const InfinityIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18.178 8c.356.447.645.895.86 1.334.243.497.36.994.36 1.459 0 .465-.117.962-.36 1.458-.216.44-.506.888-.862 1.335-.617.759-1.364 1.477-2.152 2.093-2.112 1.649-4.508 2.632-6.023 2.633-.743 0-1.493-.211-2.214-.635-.721-.423-1.402-1.058-1.999-1.871-1.173-1.596-1.763-3.755-1.785-5.805.01-2.05.6-4.209 1.762-5.805.594-.816 1.275-1.456 1.998-1.885.723-.43 1.476-.647 2.224-.647 1.505.009 3.89.996 5.993 2.644zM6.472 8.78c-.438.467-.816.975-1.128 1.513-.353.61-.527 1.21-.527 1.788 0 .578.174 1.177.527 1.787.312.539.69 1.046 1.128 1.514 1.025 1.094 2.446 2.056 3.828 2.494-.395-.2-.75-.443-1.067-.72-.543-.473-.934-1.036-1.173-1.619-.228-.555-.336-1.15-.336-1.744 0-.592.107-1.186.333-1.738.237-.582.626-1.147 1.167-1.622.316-.276.67-.518 1.063-.716-1.393.431-2.829 1.4-3.862 2.509.065-.057.135-.115.207-.171.934-.717 2.01-1.348 3.04-1.828-.41-.19-.788-.424-1.135-.693-.675-.525-1.174-1.178-1.517-1.862-.16-.318-.28-.648-.363-.987.055.09.11.18.169.268.406.61.948 1.162 1.582 1.612.435.31.925.575 1.452.792-.625-.3-1.228-.66-1.792-1.076-.78-.577-1.434-1.275-1.91-2.052-.238-.389-.426-.795-.564-1.216.078.179.165.353.258.523zm11.056 0c.438.467.816.975 1.128 1.513.353.61.527 1.21.527 1.788 0 .578-.174 1.177-.527 1.787-.312.539-.69 1.046-1.128 1.514-1.025 1.094-2.446 2.056-3.828 2.494.395-.2.75-.443 1.067-.72.543-.473.934-1.036 1.173-1.619.228-.555.336-1.15.336-1.744 0-.592-.107-1.186-.333-1.738-.237-.582-.626-1.147-1.167-1.622-.316-.276-.67-.518-1.063-.716 1.393.431 2.829 1.4 3.862 2.509-.065-.057-.135-.115-.207-.171-.934-.717-2.01-1.348-3.04-1.828.41-.19.788-.424 1.135-.693.675-.525 1.174-1.178 1.517-1.862.16-.318.28-.648.363-.987-.055.09-.11.18-.169.268-.406.61-.948 1.162-1.582 1.612-.435.31-.925.575-1.452.792.625-.3 1.228-.66 1.792-1.076.78-.577 1.434-1.275 1.91-2.052.238-.389.426-.795.564-1.216-.078.179-.165.353-.258.523z" />
  </svg>
);

/**
 * Layers Icon - Inventory/Stock representation
 */
export const LayersIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

/**
 * CheckCircle Icon - Success confirmation with checkmark in circle
 */
export const CheckCircleIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

/**
 * Lock Icon - Security/Payment security representation
 */
export const LockIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * ChevronDown Icon - Expand/Show more indicator
 */
export const ChevronDownIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * ChevronUp Icon - Collapse/Show less indicator
 */
export const ChevronUpIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ChevronRightIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Heart Icon - Like/Favorite representation
 */
export const Heart = ({ size = 24, color = 'currentColor', fill = false, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={fill ? color : "none"}
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/**
 * MessageCircle Icon - Comment/Message representation
 */
export const MessageCircle = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

/**
 * Trash2 Icon - Delete action (alias for TrashIcon with slightly different design)
 */
export const Trash2 = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
