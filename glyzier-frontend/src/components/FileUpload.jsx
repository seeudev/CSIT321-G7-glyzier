/**
 * FileUpload Component
 * 
 * Reusable file upload component with drag-and-drop, preview, and progress tracking.
 * Supports image uploads (product_image, preview) and digital downloads.
 * 
 * Features:
 * - Drag and drop file upload
 * - File type and size validation
 * - Image preview for photos
 * - Upload progress bar
 * - Error handling and display
 * - Multiple file upload support (for gallery)
 * 
 * Usage:
 * <FileUpload
 *   productId={42}
 *   fileType="product_image"
 *   onUploadSuccess={handleSuccess}
 *   multiple={true}
 *   maxFiles={5}
 * />
 * 
 * @author Glyzier Development Team
 * @since Module 20 - Supabase Storage Integration
 */

import React, { useState, useRef } from 'react';
import fileService from '../services/fileService';
import styles from '../styles/components/FileUpload.module.css';

const FileUpload = ({
  productId,
  fileType = 'product_image',
  onUploadSuccess = null,
  onUploadError = null,
  multiple = false,
  maxFiles = 5,
  accept = null
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Get Accept Attribute for File Input
   * 
   * Determines accepted file types based on fileType prop.
   * 
   * @returns {string} Accept attribute value
   */
  const getAcceptAttribute = () => {
    if (accept) return accept;
    
    if (fileType === 'product_image' || fileType === 'preview') {
      return 'image/jpeg,image/png,image/webp';
    }
    
    return '.zip,.pdf,.psd,.ai,.jpg,.jpeg,.png';
  };

  /**
   * Handle File Selection
   * 
   * Validates and prepares files for upload.
   * Creates preview URLs for images.
   * 
   * @param {FileList} files - Selected files from input or drag-drop
   */
  const handleFileSelect = (files) => {
    setError(null);
    
    // Convert FileList to Array
    const filesArray = Array.from(files);
    
    // Check file count limit
    if (!multiple && filesArray.length > 1) {
      setError('Only one file can be uploaded');
      return;
    }
    
    if (filesArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Validate each file
    const validFiles = [];
    const newPreviews = [];
    
    for (const file of filesArray) {
      const validation = fileService.validateFile(file, fileType);
      
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      
      validFiles.push(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push({
          file,
          url: previewUrl,
          name: file.name,
          size: fileService.formatFileSize(file.size)
        });
      } else {
        newPreviews.push({
          file,
          url: null,
          name: file.name,
          size: fileService.formatFileSize(file.size)
        });
      }
    }
    
    setSelectedFiles(validFiles);
    setPreviews(newPreviews);
  };

  /**
   * Handle Input Change
   * 
   * Triggered when user selects files via file input.
   * 
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  /**
   * Handle Drag Events
   * 
   * Manages drag-and-drop UI feedback.
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Handle Drop
   * 
   * Processes files dropped into drop zone.
   * 
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  /**
   * Handle Upload
   * 
   * Uploads selected files to Supabase Storage.
   * Tracks progress and handles errors.
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const uploadedFiles = [];
      
      // Upload files sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        const result = await fileService.uploadFile(
          productId,
          file,
          fileType,
          (percent) => {
            // Calculate overall progress
            const baseProgress = (i / selectedFiles.length) * 100;
            const fileProgress = (percent / selectedFiles.length);
            setProgress(Math.round(baseProgress + fileProgress));
          }
        );
        
        uploadedFiles.push(result.file);
      }
      
      // Success callback
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFiles);
      }
      
      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setProgress(100);
      
      // Clear progress bar after delay
      setTimeout(() => {
        setProgress(0);
        setUploading(false);
      }, 1000);
      
    } catch (err) {
      setError(err.toString());
      setUploading(false);
      
      if (onUploadError) {
        onUploadError(err);
      }
    }
  };

  /**
   * Handle Remove File
   * 
   * Removes file from selection before upload.
   * 
   * @param {number} index - Index of file to remove
   */
  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    if (previews[index].url) {
      URL.revokeObjectURL(previews[index].url);
    }
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  /**
   * Trigger File Input Click
   */
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.fileUpload}>
      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${dragActive ? styles.active : ''} ${uploading ? styles.uploading : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptAttribute()}
          multiple={multiple}
          onChange={handleInputChange}
          className={styles.fileInput}
        />
        
        <div className={styles.dropContent}>
          <svg className={styles.uploadIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p className={styles.dropText}>
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          
          <p className={styles.dropHint}>or click to browse</p>
          
          <p className={styles.fileTypes}>
            {fileType === 'product_image' || fileType === 'preview'
              ? 'Supported: JPEG, PNG, WebP (Max 10MB)'
              : 'Supported: ZIP, PDF, PSD, AI (Max 100MB)'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Selected Files Preview */}
      {previews.length > 0 && (
        <div className={styles.previewContainer}>
          <h4 className={styles.previewTitle}>
            Selected Files ({previews.length})
          </h4>
          
          <div className={styles.previewGrid}>
            {previews.map((preview, index) => (
              <div key={index} className={styles.previewItem}>
                {preview.url ? (
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.fileIcon}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                
                <div className={styles.previewInfo}>
                  <p className={styles.fileName}>{preview.name}</p>
                  <p className={styles.fileSize}>{preview.size}</p>
                </div>
                
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  disabled={uploading}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressText}>{progress}%</p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && !uploading && (
        <button
          type="button"
          className={styles.uploadButton}
          onClick={handleUpload}
        >
          Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
