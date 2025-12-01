/**
 * ManageProducts Page
 * 
 * Dedicated page for sellers to manage their products.
 * Features full CRUD operations with improved UX.
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkIfSeller } from '../services/sellerService';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductsBySeller 
} from '../services/productService';
import { showSuccess, showError, showInfo, showConfirm } from '../components/NotificationManager';
import { PackageIcon, PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, InfinityIcon } from '../components/Icons';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import FileUpload from '../components/FileUpload';
import fileService from '../services/fileService';
import styles from '../styles/pages/ManageProducts.module.css';

function ManageProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // File management state (Module 20)
  const [productFiles, setProductFiles] = useState({});
  const [fileLoadingStates, setFileLoadingStates] = useState({});
  const [createFormDigitalFile, setCreateFormDigitalFile] = useState(null);
  
  // Form states
  const [createFormData, setCreateFormData] = useState({
    productname: '',
    price: '',
    category: '',
    type: '',
    status: 'Available',
    productdesc: '',
    screenshotPreviewUrl: '',
    qtyonhand: '10',
    qtyreserved: '0'
  });
  
  const [editFormData, setEditFormData] = useState({});
  const [createFormLoading, setCreateFormLoading] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  
  // Check seller status and redirect if not seller
  useEffect(() => {
    const verifySeller = async () => {
      try {
        const data = await checkIfSeller();
        if (!data.isSeller) {
          showError('You must be a seller to access this page');
          navigate('/dashboard');
          return;
        }
        setSellerId(data.sid);
        await loadProducts(data.sid);
      } catch (err) {
        console.error('Failed to verify seller:', err);
        showError('Failed to verify seller status');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    verifySeller();
  }, [navigate]);
  
  // Load products
  const loadProducts = async (sid) => {
    try {
      const data = await getProductsBySeller(sid);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      showError('Failed to load products');
    }
  };
  
  // Form handlers
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Auto-update qty fields when type changes
      if (name === 'type') {
        if (value === 'Digital') {
          // Switching to Digital - clear qty fields (backend will set -1)
          updated.qtyonhand = '';
          updated.qtyreserved = '';
        } else if (prev.type === 'Digital' && value !== 'Digital') {
          // Switching from Digital to Physical - set default values
          updated.qtyonhand = '10';
          updated.qtyreserved = '0';
        }
      }
      
      return updated;
    });
  };
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Auto-update qty fields when type changes
      if (name === 'type') {
        if (value === 'Digital') {
          // Switching to Digital - clear qty fields (backend will set -1)
          updated.qtyonhand = '';
          updated.qtyreserved = '';
        } else if (prev.type === 'Digital' && value !== 'Digital') {
          // Switching from Digital to Physical - set default values
          updated.qtyonhand = '10';
          updated.qtyreserved = '0';
        }
      }
      
      return updated;
    });
  };
  
  // Create product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!createFormData.productname || !createFormData.price || !createFormData.type) {
      showError('Please fill in all required fields');
      return;
    }
    
    if (createFormData.type !== 'Digital' && (!createFormData.qtyonhand || parseInt(createFormData.qtyonhand) < 0)) {
      showError('Physical products require a valid quantity on hand');
      return;
    }
    
    try {
      setCreateFormLoading(true);
      
      const productData = {
        productname: createFormData.productname,
        price: parseFloat(createFormData.price),
        type: createFormData.type,
        status: createFormData.status,
        productdesc: createFormData.productdesc,
        screenshotPreviewUrl: createFormData.screenshotPreviewUrl,
        // Don't send qty for digital products
        ...(createFormData.type !== 'Digital' && {
          qtyonhand: createFormData.qtyonhand ? parseInt(createFormData.qtyonhand) : 10,
          qtyreserved: createFormData.qtyreserved ? parseInt(createFormData.qtyreserved) : 0
        })
      };
      
      const createdProduct = await createProduct(productData);
      const newProductId = createdProduct.pid;
      
      // Upload digital file if provided
      if (createFormData.type === 'Digital' && createFormDigitalFile) {
        try {
          await fileService.uploadFile(newProductId, createFormDigitalFile, 'digital_download');
          showSuccess('Product and digital file created successfully!');
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr);
          showError('Product created but file upload failed. Please edit the product to upload the file.');
        }
      } else {
        showSuccess('Product created successfully!');
      }
      
      // Reset form
      setCreateFormData({
        productname: '',
        price: '',
        category: '',
        type: '',
        status: 'Available',
        productdesc: '',
        screenshotPreviewUrl: '',
        qtyonhand: '10',
        qtyreserved: '0'
      });
      setCreateFormDigitalFile(null);
      setShowCreateForm(false);
      
      // Reload products
      await loadProducts(sellerId);
      
    } catch (err) {
      console.error('Error creating product:', err);
      showError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setCreateFormLoading(false);
    }
  };
  
  // Edit handlers
  const handleEditClick = (product) => {
    setEditingProductId(product.pid);
    setEditFormData({
      productname: product.productname,
      price: product.price?.toString() || '0',
      category: product.category || '',
      type: product.type || '',
      status: product.status || 'Available',
      productdesc: product.productdesc || '',
      screenshotPreviewUrl: product.screenshotPreviewUrl || '',
      qtyonhand: product.qtyonhand?.toString() || '0',
      qtyreserved: product.qtyreserved?.toString() || '0'
    });
  };
  
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditFormData({});
  };
  
  const handleUpdateProduct = async (pid) => {
    if (!editFormData.productname || !editFormData.price) {
      showError('Product name and price are required');
      return;
    }
    
    if (editFormData.type !== 'Digital' && (!editFormData.qtyonhand || parseInt(editFormData.qtyonhand) < 0)) {
      showError('Physical products require a valid quantity on hand');
      return;
    }
    
    try {
      setEditFormLoading(true);
      
      const productData = {
        productname: editFormData.productname,
        price: parseFloat(editFormData.price),
        type: editFormData.type,
        status: editFormData.status,
        productdesc: editFormData.productdesc,
        screenshotPreviewUrl: editFormData.screenshotPreviewUrl,
        ...(editFormData.type !== 'Digital' && {
          qtyonhand: editFormData.qtyonhand ? parseInt(editFormData.qtyonhand) : 0,
          qtyreserved: editFormData.qtyreserved ? parseInt(editFormData.qtyreserved) : 0
        })
      };
      
      await updateProduct(pid, productData);
      showSuccess('Product updated successfully!');
      
      setEditingProductId(null);
      setEditFormData({});
      await loadProducts(sellerId);
      
    } catch (err) {
      console.error('Error updating product:', err);
      showError(err.response?.data?.error || 'Failed to update product');
    } finally {
      setEditFormLoading(false);
    }
  };
  
  // Delete product
  const handleDeleteProduct = async (pid, productName) => {
    const confirmed = await showConfirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    try {
      await deleteProduct(pid);
      showSuccess('Product deleted successfully');
      await loadProducts(sellerId);
    } catch (err) {
      console.error('Error deleting product:', err);
      showError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  // Load product files (images, previews, digital downloads)
  const loadProductFiles = async (productId) => {
    if (!productId) return;
    
    try {
      const response = await fileService.getProductFiles(productId);
      // Backend returns: { success: true, productId: X, files: [...] }
      // Axios wraps in data: response.data = { success, productId, files }
      const files = response.files || [];
      
      console.log('[ManageProducts] Loaded files for product', productId, ':', files);
      
      // Group files by type
      const grouped = {
        images: files.filter(f => f.fileType === 'product_image'),
        preview: files.filter(f => f.fileType === 'preview'),
        digital: files.filter(f => f.fileType === 'digital_download')
      };
      
      console.log('[ManageProducts] Grouped files:', grouped);
      
      setProductFiles(prev => ({
        ...prev,
        [productId]: grouped
      }));
    } catch (err) {
      console.error('Error loading product files:', err);
      // Silently fail - files are optional
    }
  };

  // Delete a product file
  const handleDeleteFile = async (fileId, productId) => {
    const confirmed = await showConfirm('Are you sure you want to delete this file? This action cannot be undone.');
    if (!confirmed) return;

    setFileLoadingStates(prev => ({
      ...prev,
      [fileId]: 'deleting'
    }));

    try {
      await fileService.deleteFile(fileId);
      showSuccess('File deleted successfully');
      
      // Reload files for this product
      await loadProductFiles(productId);
    } catch (err) {
      console.error('Error deleting file:', err);
      showError(err.response?.data?.error || 'Failed to delete file');
    } finally {
      setFileLoadingStates(prev => ({
        ...prev,
        [fileId]: null
      }));
    }
  };

  // Replace a product file
  const handleReplaceFile = async (fileId, productId) => {
    const confirmed = await showConfirm('Replace the current file? The old file will be deleted from storage.');
    if (!confirmed) return;

    setFileLoadingStates(prev => ({
      ...prev,
      [fileId]: 'replacing'
    }));

    try {
      // Delete the old file first
      await fileService.deleteFile(fileId);
      
      // Reload files to show empty state and allow new upload
      await loadProductFiles(productId);
      
      showInfo('Old file deleted. Please upload the new file below.');
    } catch (err) {
      console.error('Error replacing file:', err);
      showError(err.response?.data?.error || 'Failed to replace file');
    } finally {
      setFileLoadingStates(prev => ({
        ...prev,
        [fileId]: null
      }));
    }
  };

  // Load files when editing a product
  useEffect(() => {
    if (editingProductId) {
      loadProductFiles(editingProductId);
    }
  }, [editingProductId]);
  
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className={styles.page}>
      <Navigation />
      
      {/* Header */}
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
              <h1 className={styles.title}>Manage Products</h1>
              <p className={styles.subtitle}>Create, edit, and manage your product catalog</p>
            </div>
            <div className={styles.headerActions}>
              <Link to="/seller/dashboard" className={styles.backButton}>
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.container}>
        {/* Create Product Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}><PackageIcon size={32} color="#8b7fc4" /></span>
            <h2 className={styles.cardTitle}>Your Products ({products.length})</h2>
            <button
              className={styles.createButton}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? <><XIcon size={18} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} />Cancel</> : <><PlusIcon size={18} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} />Create Product</>}
            </button>
          </div>
          
          {/* Create Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateProduct} className={styles.productForm}>
              <h3>Create New Product</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="productname" className={styles.formLabel}>
                    Product Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="productname"
                    name="productname"
                    className={styles.formInput}
                    placeholder="e.g., Sunset Landscape Print"
                    value={createFormData.productname}
                    onChange={handleCreateFormChange}
                    required
                    minLength={3}
                    maxLength={200}
                    disabled={createFormLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.formLabel}>
                    Price ($) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className={styles.formInput}
                    placeholder="0.00"
                    value={createFormData.price}
                    onChange={handleCreateFormChange}
                    required
                    min="0.01"
                    step="0.01"
                    disabled={createFormLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="type" className={styles.formLabel}>
                    Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    className={styles.formInput}
                    value={createFormData.type}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createFormLoading}
                  >
                    <option value="">Select type...</option>
                    <option value="Digital">Digital (Unlimited Stock)</option>
                    <option value="Print">Print (Physical)</option>
                    <option value="Original">Original Art (Physical)</option>
                    <option value="Other">Other (Physical)</option>
                  </select>
                  <small className={styles.formHint}>
                    Digital products have unlimited inventory
                  </small>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status" className={styles.formLabel}>
                    Status <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={styles.formInput}
                    value={createFormData.status}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createFormLoading}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="screenshotPreviewUrl" className={styles.formLabel}>
                  Screenshot Preview URL
                </label>
                <input
                  type="url"
                  id="screenshotPreviewUrl"
                  name="screenshotPreviewUrl"
                  className={styles.formInput}
                  placeholder="https://example.com/image.jpg"
                  value={createFormData.screenshotPreviewUrl}
                  onChange={handleCreateFormChange}
                  disabled={createFormLoading}
                />
                <small className={styles.formHint}>
                  Image URL for product thumbnail (used in cards and galleries)
                </small>
              </div>
              
              {/* Only show inventory fields for physical products */}
              {createFormData.type && createFormData.type !== 'Digital' && (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="qtyonhand" className={styles.formLabel}>
                      Quantity On Hand <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      id="qtyonhand"
                      name="qtyonhand"
                      className={styles.formInput}
                      placeholder="10"
                      value={createFormData.qtyonhand}
                      onChange={handleCreateFormChange}
                      min="0"
                      required
                      disabled={createFormLoading}
                    />
                    <small className={styles.formHint}>Available stock (required for physical products)</small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="qtyreserved" className={styles.formLabel}>
                      Quantity Reserved
                    </label>
                    <input
                      type="number"
                      id="qtyreserved"
                      name="qtyreserved"
                      className={styles.formInput}
                      placeholder="0"
                      value={createFormData.qtyreserved}
                      onChange={handleCreateFormChange}
                      min="0"
                      disabled={createFormLoading}
                    />
                    <small className={styles.formHint}>Reserved for pending orders</small>
                  </div>
                </div>
              )}
              
              {/* Show unlimited indicator for digital products */}
              {createFormData.type === 'Digital' && (
                <div className={styles.formGroup}>
                  <div style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', 
                    borderRadius: '8px', 
                    border: '1px solid #81c784',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <InfinityIcon size={24} color="#2e7d32" />
                    <div>
                      <strong style={{ color: '#2e7d32', display: 'block', marginBottom: '4px' }}>Unlimited Inventory</strong>
                      <span style={{ color: '#558b2f', fontSize: '0.9em' }}>
                        Digital products automatically have unlimited stock. Quantity inputs are disabled.
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="productdesc" className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  id="productdesc"
                  name="productdesc"
                  className={styles.formTextarea}
                  placeholder="Describe your product..."
                  value={createFormData.productdesc}
                  onChange={handleCreateFormChange}
                  rows={4}
                  disabled={createFormLoading}
                />
              </div>
              
              {/* Digital File Upload Section (Module 20) */}
              {createFormData.type === 'Digital' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    💾 Digital Product File <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="file"
                    className={styles.formInput}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Validate file size (max 100MB)
                        const maxSize = 100 * 1024 * 1024;
                        if (file.size > maxSize) {
                          showError('File size must be less than 100MB');
                          e.target.value = '';
                          return;
                        }
                        setCreateFormDigitalFile(file);
                        showInfo(`File "${file.name}" ready to upload (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                      }
                    }}
                    accept="*/*"
                    disabled={createFormLoading}
                  />
                  <small className={styles.formHint}>
                    Upload the digital file customers will download (all file types supported). Max 100MB.
                  </small>
                  {createFormDigitalFile && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      background: '#e3f2fd', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.5em' }}>✅</span>
                      <div>
                        <strong style={{ color: '#1976d2' }}>{createFormDigitalFile.name}</strong>
                        <div style={{ fontSize: '0.85em', color: '#555' }}>
                          {(createFormDigitalFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCreateFormDigitalFile(null)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2em'
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={createFormLoading}
                >
                  {createFormLoading ? 'Creating...' : 'Create Product'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowCreateForm(false)}
                  disabled={createFormLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          {/* Products List */}
          <div className={styles.productsList}>
            {products.length === 0 ? (
              <p className={styles.muted}>No products yet. Create your first product above!</p>
            ) : (
              products.map((product) => (
                <div key={product.pid} className={styles.productCard}>
                  {editingProductId === product.pid ? (
                    // Edit Mode
                    <div className={styles.editForm}>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Product Name *</label>
                          <input
                            type="text"
                            name="productname"
                            className={styles.formInput}
                            value={editFormData.productname}
                            onChange={handleEditFormChange}
                            required
                            disabled={editFormLoading}
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Price ($) *</label>
                          <input
                            type="number"
                            name="price"
                            className={styles.formInput}
                            value={editFormData.price}
                            onChange={handleEditFormChange}
                            min="0.01"
                            step="0.01"
                            required
                            disabled={editFormLoading}
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Type *</label>
                          <select
                            name="type"
                            className={styles.formInput}
                            value={editFormData.type}
                            onChange={handleEditFormChange}
                            required
                            disabled={editFormLoading}
                          >
                            <option value="">Select type...</option>
                            <option value="Digital">Digital (Unlimited Stock)</option>
                            <option value="Print">Print (Physical)</option>
                            <option value="Original">Original Art (Physical)</option>
                            <option value="Other">Other (Physical)</option>
                          </select>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status *</label>
                          <select
                            name="status"
                            className={styles.formInput}
                            value={editFormData.status}
                            onChange={handleEditFormChange}
                            required
                            disabled={editFormLoading}
                          >
                            <option value="Available">Available</option>
                            <option value="Sold Out">Sold Out</option>
                            <option value="Coming Soon">Coming Soon</option>
                          </select>
                        </div>
                      </div>
                      
                      {editFormData.type && editFormData.type !== 'Digital' && (
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Qty On Hand</label>
                            <input
                              type="number"
                              name="qtyonhand"
                              className={styles.formInput}
                              value={editFormData.qtyonhand}
                              onChange={handleEditFormChange}
                              min="0"
                              disabled={editFormLoading}
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Qty Reserved</label>
                            <input
                              type="number"
                              name="qtyreserved"
                              className={styles.formInput}
                              value={editFormData.qtyreserved}
                              onChange={handleEditFormChange}
                              min="0"
                              disabled={editFormLoading}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Description</label>
                        <textarea
                          name="productdesc"
                          className={styles.formTextarea}
                          value={editFormData.productdesc}
                          onChange={handleEditFormChange}
                          rows={3}
                          disabled={editFormLoading}
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Screenshot Preview URL</label>
                        <input
                          type="url"
                          name="screenshotPreviewUrl"
                          className={styles.formInput}
                          placeholder="https://example.com/image.jpg"
                          value={editFormData.screenshotPreviewUrl || ''}
                          onChange={handleEditFormChange}
                          disabled={editFormLoading}
                        />
                        <small className={styles.formHint}>
                          Image URL for product thumbnail (used in cards and galleries)
                        </small>
                      </div>
                      
                      {/* File Upload Section - Digital Products Only (Module 20) */}
                      {editFormData.type === 'Digital' && (
                        <div className={styles.fileUploadSection} data-type="digital">
                          <h4>📦 Digital Product File</h4>
                          <p style={{ fontSize: '0.9em', color: '#7f8c8d', marginTop: '-8px', marginBottom: '12px' }}>
                            Upload the digital file that customers will download after purchase. Only one file allowed.
                          </p>
                          
                          {productFiles[product.pid]?.digital?.length > 0 ? (
                            <div className={styles.uploadedFiles}>
                              {productFiles[product.pid].digital.map((file) => (
                                <div key={file.fileId} className={styles.fileItem}>
                                  <div style={{ fontSize: '3em' }}>💾</div>
                                  <p><strong>Digital File Uploaded</strong></p>
                                  <p style={{ fontSize: '0.85em', color: '#7f8c8d', marginTop: '4px' }}>
                                    {file.fileFormat?.toUpperCase()} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                    <button
                                      className={styles.replaceFileButton}
                                      onClick={() => handleReplaceFile(file.fileId, product.pid)}
                                      disabled={fileLoadingStates[file.fileId] === 'replacing'}
                                    >
                                      {fileLoadingStates[file.fileId] === 'replacing' ? '⏳ Replacing...' : '🔄 Replace File'}
                                    </button>
                                    <button
                                      className={styles.deleteFileButton}
                                      onClick={() => handleDeleteFile(file.fileId, product.pid)}
                                      disabled={fileLoadingStates[file.fileId] === 'deleting'}
                                    >
                                      {fileLoadingStates[file.fileId] === 'deleting' ? '⏳ Deleting...' : '🗑️ Delete'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <FileUpload
                              productId={product.pid}
                              fileType="digital_download"
                              onUploadSuccess={(files) => {
                                showSuccess('Digital file uploaded successfully!');
                                loadProductFiles(product.pid);
                              }}
                              onUploadError={(error) => {
                                showError('Failed to upload file: ' + error);
                              }}
                              multiple={false}
                              maxFiles={1}
                            />
                          )}
                        </div>
                      )}
                      
                      <div className={styles.productActions}>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleUpdateProduct(product.pid)}
                          disabled={editFormLoading}
                        >
                          {editFormLoading ? 'Saving...' : <><CheckIcon size={16} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />Save</>}
                        </button>
                        <button
                          className={styles.cancelButtonSmall}
                          onClick={handleCancelEdit}
                          disabled={editFormLoading}
                        >
                          <XIcon size={16} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>{product.productname}</h3>
                        {product.productdesc && (
                          <p className={styles.productDescription}>{product.productdesc}</p>
                        )}
                        <div className={styles.productMeta}>
                          <span className={styles.productPrice}>${product.price?.toFixed(2)}</span>
                          <span className={styles.productType}>{product.type}</span>
                          <span className={`${styles.productStatus} ${
                            product.status === 'Available' ? styles.statusAvailable : styles.statusUnavailable
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <div className={styles.productDetails}>
                          <span>ID: {product.pid}</span>
                          {product.isUnlimited ? (
                            <>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2e7d32', fontWeight: 600 }}>
                                <InfinityIcon size={16} color="#2e7d32" />
                                Unlimited Stock
                              </span>
                            </>
                          ) : (
                            <>
                              <span>Stock: {product.qtyonhand || 0}</span>
                              <span>Reserved: {product.qtyreserved || 0}</span>
                              <span>Available: {(product.qtyonhand || 0) - (product.qtyreserved || 0)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={styles.productActions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(product)}
                        >
                          <EditIcon size={16} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteProduct(product.pid, product.productname)}
                        >
                          <TrashIcon size={16} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;
