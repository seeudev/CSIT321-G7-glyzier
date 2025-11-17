/**
 * SellerDashboard Component
 * 
 * This page serves as the main dashboard for sellers to manage their products.
 * Only accessible to users who are registered as sellers.
 * 
 * Features:
 * - Create new products with form validation
 * - View all products owned by the seller
 * - Edit existing products (inline editing)
 * - Delete products with confirmation
 * - View product inventory status
 * 
 * Design:
 * - Modern card-based layout with gradient header
 * - Product creation form with proper validation
 * - Product list with action buttons
 * - Uses CSS modules for styling
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 8)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkIfSeller, getMySellerProfile } from '../services/sellerService';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductsBySeller 
} from '../services/productService';
import Navigation from '../components/Navigation';
import styles from './SellerDashboard.module.css';

/**
 * SellerDashboard functional component
 * 
 * @returns {JSX.Element} The seller dashboard page component
 */
function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Seller verification state
  const [isSeller, setIsSeller] = useState(false);
  const [sellerId, setSellerId] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [verifying, setVerifying] = useState(true);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  
  // Product creation form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    productname: '',
    productdescription: '',
    price: '',
    category: '',
    type: '',
    status: 'Available',
    screenshotPreviewUrl: ''
  });
  const [createFormLoading, setCreateFormLoading] = useState(false);
  
  // Product editing state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editFormLoading, setEditFormLoading] = useState(false);
  
  /**
   * Verify seller status on component mount
   * Redirect to dashboard if user is not a seller
   */
  useEffect(() => {
    const verifySeller = async () => {
      try {
        setVerifying(true);
        
        // Check if user is a seller
        const sellerStatus = await checkIfSeller();
        
        if (!sellerStatus.isSeller) {
          alert('You must be a seller to access this page. Please register as a seller first.');
          navigate('/dashboard');
          return;
        }
        
        setIsSeller(true);
        setSellerId(sellerStatus.sid);
        
        // Fetch seller profile
        const profile = await getMySellerProfile();
        console.log('Seller profile received:', profile);
        setSellerProfile(profile);
        
      } catch (err) {
        console.error('Failed to verify seller status:', err);
        alert('Failed to verify seller status. Redirecting to dashboard.');
        navigate('/dashboard');
      } finally {
        setVerifying(false);
      }
    };
    
    verifySeller();
  }, [navigate]);
  
  /**
   * Fetch seller's products
   */
  useEffect(() => {
    if (!sellerId) return;
    
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await getProductsBySeller(sellerId);
        setProducts(data);
        setProductsError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProductsError('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };
    
    fetchProducts();
  }, [sellerId]);
  
  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  /**
   * Handle create form input changes
   */
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handle product creation form submission
   */
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!createFormData.productname.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!createFormData.price || parseFloat(createFormData.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    
    try {
      setCreateFormLoading(true);
      
      // Prepare product data
      const productData = {
        productname: createFormData.productname.trim(),
        productdescription: createFormData.productdescription.trim() || null,
        price: parseFloat(createFormData.price),
        category: createFormData.category.trim() || 'Uncategorized',
        type: createFormData.type.trim() || 'General',
        status: createFormData.status,
        screenshotPreviewUrl: createFormData.screenshotPreviewUrl.trim() || null
      };
      
      // Call the productService to create product
      const result = await createProduct(productData);
      
      // Show success message
      alert(`Product created successfully!\nProduct ID: ${result.pid}`);
      
      // Reset form
      setCreateFormData({
        productname: '',
        productdescription: '',
        price: '',
        category: '',
        type: '',
        status: 'Available',
        screenshotPreviewUrl: ''
      });
      setShowCreateForm(false);
      
      // Refresh product list
      const updatedProducts = await getProductsBySeller(sellerId);
      setProducts(updatedProducts);
      
    } catch (err) {
      console.error('Error creating product:', err);
      alert(`Failed to create product: ${err.message}`);
    } finally {
      setCreateFormLoading(false);
    }
  };
  
  /**
   * Handle edit button click
   */
  const handleEditClick = (product) => {
    setEditingProductId(product.pid);
    setEditFormData({
      productname: product.productname,
      productdescription: product.productdescription || '',
      price: product.price.toString(),
      category: product.category || '',
      type: product.type || '',
      status: product.status,
      screenshotPreviewUrl: product.screenshotPreviewUrl || ''
    });
  };
  
  /**
   * Handle edit form input changes
   */
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handle product update submission
   */
  const handleUpdateProduct = async (pid) => {
    // Basic validation
    if (!editFormData.productname.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!editFormData.price || parseFloat(editFormData.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    
    try {
      setEditFormLoading(true);
      
      // Prepare product data
      const productData = {
        productname: editFormData.productname.trim(),
        productdescription: editFormData.productdescription.trim() || null,
        price: parseFloat(editFormData.price),
        category: editFormData.category.trim() || 'Uncategorized',
        type: editFormData.type.trim() || 'General',
        status: editFormData.status,
        screenshotPreviewUrl: editFormData.screenshotPreviewUrl.trim() || null
      };
      
      // Call the productService to update product
      await updateProduct(pid, productData);
      
      // Show success message
      alert('Product updated successfully!');
      
      // Clear editing state
      setEditingProductId(null);
      setEditFormData({});
      
      // Refresh product list
      const updatedProducts = await getProductsBySeller(sellerId);
      setProducts(updatedProducts);
      
    } catch (err) {
      console.error('Error updating product:', err);
      alert(`Failed to update product: ${err.message}`);
    } finally {
      setEditFormLoading(false);
    }
  };
  
  /**
   * Handle product deletion
   */
  const handleDeleteProduct = async (pid, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      await deleteProduct(pid);
      
      alert('Product deleted successfully!');
      
      // Refresh product list
      const updatedProducts = await getProductsBySeller(sellerId);
      setProducts(updatedProducts);
      
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`Failed to delete product: ${err.message}`);
    }
  };
  
  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditFormData({});
  };
  
  /**
   * Show loading screen while verifying seller status
   */
  if (verifying) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Verifying seller status...</p>
        </div>
      </div>
    );
  }
  
  /**
   * Main render
   */
  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.title}>Seller Dashboard</h1>
              <p className={styles.subtitle}>
                {sellerProfile?.sellername || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      
      {/* Main Content */}
      <div className={styles.content}>
        {/* Seller Info Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🎨</span>
            <h2 className={styles.cardTitle}>Seller Information</h2>
          </div>
          <div className={styles.cardContent}>
            {sellerProfile ? (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Seller ID</span>
                  <span className={styles.infoValue}>{sellerProfile.sid || sellerId || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Shop Name</span>
                  <span className={styles.infoValue}>{sellerProfile.sellername || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Bio</span>
                  <span className={styles.infoValue}>
                    {sellerProfile.storebio || 'No bio provided'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Total Products</span>
                  <span className={styles.infoValue}>{products.length}</span>
                </div>
              </>
            ) : (
              <div className={styles.infoRow}>
                <span className={styles.infoValue}>Loading seller information...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Management Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>📦</span>
            <h2 className={styles.cardTitle}>Product Management</h2>
            <button
              className={styles.createButton}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? '✕ Cancel' : '+ Create Product'}
            </button>
          </div>
          
          {/* Create Product Form */}
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
                    Price (₱) <span className={styles.required}>*</span>
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
                  <label htmlFor="category" className={styles.formLabel}>
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    className={styles.formInput}
                    placeholder="e.g., Digital Art, Painting"
                    value={createFormData.category}
                    onChange={handleCreateFormChange}
                    disabled={createFormLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="type" className={styles.formLabel}>
                    Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    className={styles.formInput}
                    placeholder="e.g., Print, Original, Digital"
                    value={createFormData.type}
                    onChange={handleCreateFormChange}
                    disabled={createFormLoading}
                  />
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
              
              <div className={styles.formGroup}>
                <label htmlFor="productdescription" className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  id="productdescription"
                  name="productdescription"
                  className={styles.formTextarea}
                  placeholder="Describe your product..."
                  value={createFormData.productdescription}
                  onChange={handleCreateFormChange}
                  rows={4}
                  disabled={createFormLoading}
                />
              </div>
              
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
          <div className={styles.cardContent}>
            <h3>Your Products</h3>
            
            {productsLoading ? (
              <p className={styles.muted}>Loading products...</p>
            ) : productsError ? (
              <p style={{ color: '#d32f2f' }}>{productsError}</p>
            ) : products.length === 0 ? (
              <p className={styles.muted}>
                No products yet. Create your first product to get started!
              </p>
            ) : (
              <div className={styles.productsList}>
                {products.map((product) => (
                  <div key={product.pid} className={styles.productCard}>
                    {editingProductId === product.pid ? (
                      // Edit Mode
                      <div className={styles.editForm}>
                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Product Name</label>
                            <input
                              type="text"
                              name="productname"
                              className={styles.formInput}
                              value={editFormData.productname}
                              onChange={handleEditFormChange}
                              disabled={editFormLoading}
                              required
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Price (₱)</label>
                            <input
                              type="number"
                              name="price"
                              className={styles.formInput}
                              value={editFormData.price}
                              onChange={handleEditFormChange}
                              disabled={editFormLoading}
                              min="0.01"
                              step="0.01"
                              required
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Category</label>
                            <input
                              type="text"
                              name="category"
                              className={styles.formInput}
                              value={editFormData.category}
                              onChange={handleEditFormChange}
                              disabled={editFormLoading}
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Type</label>
                            <input
                              type="text"
                              name="type"
                              className={styles.formInput}
                              value={editFormData.type}
                              onChange={handleEditFormChange}
                              disabled={editFormLoading}
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Status</label>
                            <select
                              name="status"
                              className={styles.formInput}
                              value={editFormData.status}
                              onChange={handleEditFormChange}
                              disabled={editFormLoading}
                            >
                              <option value="Available">Available</option>
                              <option value="Sold Out">Sold Out</option>
                              <option value="Coming Soon">Coming Soon</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Screenshot Preview URL</label>
                          <input
                            type="url"
                            name="screenshotPreviewUrl"
                            className={styles.formInput}
                            placeholder="https://example.com/image.jpg"
                            value={editFormData.screenshotPreviewUrl}
                            onChange={handleEditFormChange}
                            disabled={editFormLoading}
                          />
                          <small className={styles.formHint}>
                            Image URL for product thumbnail
                          </small>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Description</label>
                          <textarea
                            name="productdescription"
                            className={styles.formTextarea}
                            value={editFormData.productdescription}
                            onChange={handleEditFormChange}
                            disabled={editFormLoading}
                            rows={3}
                          />
                        </div>
                        
                        <div className={styles.productActions}>
                          <button
                            className={styles.saveButton}
                            onClick={() => handleUpdateProduct(product.pid)}
                            disabled={editFormLoading}
                          >
                            {editFormLoading ? 'Saving...' : '✓ Save'}
                          </button>
                          <button
                            className={styles.cancelButtonSmall}
                            onClick={handleCancelEdit}
                            disabled={editFormLoading}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className={styles.productInfo}>
                          <h4 className={styles.productName}>{product.productname}</h4>
                          <p className={styles.productDescription}>
                            {product.productdescription || 'No description'}
                          </p>
                          <div className={styles.productMeta}>
                            <span className={styles.productPrice}>
                              ₱{product.price.toFixed(2)}
                            </span>
                            <span className={styles.productCategory}>
                              {product.category || 'Uncategorized'}
                            </span>
                            <span className={styles.productType}>
                              {product.type || 'General'}
                            </span>
                            <span className={`${styles.productStatus} ${
                              product.status === 'Available' ? styles.statusAvailable : styles.statusUnavailable
                            }`}>
                              {product.status}
                            </span>
                          </div>
                          <div className={styles.productDetails}>
                            <span>ID: {product.pid}</span>
                            <span>Stock: {product.stockQuantity || 0}</span>
                          </div>
                        </div>
                        <div className={styles.productActions}>
                          <button
                            className={styles.editButton}
                            onClick={() => handleEditClick(product)}
                          >
                            ✎ Edit
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteProduct(product.pid, product.productname)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SellerDashboard;
