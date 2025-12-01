/**
 * File Service
 * 
 * API service for managing product file uploads, downloads, and deletions.
 * Handles interactions with Supabase Storage via backend FileController.
 * 
 * Endpoints:
 * - POST   /api/files/upload/{productId}    - Upload file for product
 * - GET    /api/files/product/{productId}   - Get all files for product
 * - GET    /api/files/download/{fileId}     - Get signed URL for download
 * - DELETE /api/files/{fileId}              - Delete file from storage
 * 
 * @author Glyzier Development Team
 * @since Module 20 - Supabase Storage Integration
 */

import api from './api';

const fileService = {
  /**
   * Upload File for Product
   * 
   * Uploads digital product file to Supabase Storage (digital-products bucket).
   * Requires authentication (seller must own product).
   * 
   * All files are stored in the digital-products bucket.
   * 
   * @param {number} productId - Product ID to associate file with
   * @param {File} file - File object from input or drag-drop
   * @param {string} fileType - File type enum value (typically 'digital_download')
   * @param {function} onProgress - Progress callback (0-100)
   * @returns {Promise<Object>} Response with file details
   */
  uploadFile: async (productId, file, fileType, onProgress = null) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload with progress tracking
      const response = await api.post(
        `/api/files/upload/${productId}?fileType=${fileType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error.response?.data?.error || 'Failed to upload file';
    }
  },

  /**
   * Get Product Files
   * 
   * Fetches all digital files associated with a product.
   * Public endpoint - no authentication required.
   * 
   * Returns array of digital product files.
   * 
   * @param {number} productId - Product ID to fetch files for
   * @returns {Promise<Object>} Response with files array
   */
  getProductFiles: async (productId) => {
    try {
      const response = await api.get(`/api/files/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product files:', error);
      throw error.response?.data?.error || 'Failed to fetch files';
    }
  },

  /**
   * Get Files by Type
   * 
   * Fetches files filtered by type for a product.
   * Useful for fetching only gallery images or only previews.
   * 
   * @param {number} productId - Product ID
   * @param {string} fileType - File type to filter by
   * @returns {Promise<Object>} Response with filtered files
   */
  getProductFilesByType: async (productId, fileType) => {
    try {
      const response = await api.get(`/api/files/product/${productId}/type/${fileType}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch files by type:', error);
      throw error.response?.data?.error || 'Failed to fetch files';
    }
  },

  /**
   * Get Download URL
   * 
   * Generates signed download URL for digital product files.
   * Requires authentication and purchase verification.
   * 
   * Signed URL Expiration: 1 hour (3600 seconds)
   * 
   * Use Case: User clicks "Download" button on purchased digital product
   * 
   * @param {number} fileId - ProductFiles entity ID
   * @returns {Promise<Object>} Response with signed URL and expiration
   */
  getDownloadUrl: async (fileId) => {
    try {
      const response = await api.get(`/api/files/download/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get download URL:', error);
      throw error.response?.data?.error || 'Failed to generate download URL';
    }
  },

  /**
   * Delete File
   * 
   * Removes file from Supabase Storage and deletes database record.
   * Requires authentication (seller must own product).
   * 
   * Use Case:
   * - Seller replaces product image with better photo
   * - Seller updates digital product file
   * - Seller removes unwanted gallery images
   * 
   * @param {number} fileId - ProductFiles entity ID to delete
   * @returns {Promise<Object>} Success response
   */
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/api/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error.response?.data?.error || 'Failed to delete file';
    }
  },

  /**
   * Download File
   * 
   * Downloads file using signed URL.
   * Triggers browser download dialog.
   * 
   * Flow:
   * 1. Get signed URL from backend
   * 2. Create temporary anchor element
   * 3. Trigger download
   * 4. Clean up
   * 
   * @param {number} fileId - ProductFiles entity ID
   * @param {string} fileName - Suggested filename for download
   * @returns {Promise<void>}
   */
  downloadFile: async (fileId, fileName = 'download') => {
    try {
      // Get signed URL
      const { downloadUrl } = await fileService.getDownloadUrl(fileId);
      
      console.log('Starting download from URL:', downloadUrl);
      
      // Fetch the file as blob
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      
      const blob = await response.blob();
      console.log('File downloaded, size:', blob.size);
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },

  /**
   * Validate File Before Upload
   * 
   * Client-side validation before sending to backend.
   * Checks file size and type.
   * 
   * Limits:
   * - Images: Max 10MB, types: JPEG/PNG/WebP
   * - Digital: Max 100MB, types: ZIP/PDF/PSD/AI
   * 
   * @param {File} file - File object to validate
   * @param {string} fileType - File type enum value
   * @returns {Object} { valid: boolean, error: string }
   */
  validateFile: (file, fileType) => {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    // Size limit for digital products
    const MAX_DIGITAL_SIZE = 100 * 1024 * 1024; // 100MB

    // All file types are allowed for digital products
    // Only validate size
    if (file.size > MAX_DIGITAL_SIZE) {
      return { 
        valid: false, 
        error: 'File size must not exceed 100MB' 
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Format File Size
   * 
   * Converts bytes to human-readable format.
   * 
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size (e.g., "2.5 MB")
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Generate Public URL from File Key
   * 
   * Constructs Supabase Storage public URL from file key and type.
   * Fallback for when fileUrl is not in API response.
   * 
   * @param {string} fileKey - File key from database (path in bucket)
   * @param {string} fileType - File type enum value
   * @returns {string} Public URL to file
   */
  getPublicUrl: (fileKey, fileType) => {
    const SUPABASE_URL = 'https://fkkwqnddqnfywbwnhhkw.supabase.co';
    
    // Only use digital-products bucket
    const bucket = 'digital-products';
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileKey}`;
  }
};

export default fileService;
