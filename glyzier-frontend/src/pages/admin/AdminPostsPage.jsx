/**
 * AdminPostsPage Component
 * 
 * Admin page for managing community posts.
 * Displays all posts with delete functionality.
 * 
 * Module 18: Community Feed - Admin Management
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../../components/Navigation';
import Aurora from '../../components/Aurora';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllPosts, deletePost } from '../../services/postService';
import styles from '../../styles/pages/Admin.module.css';

const AdminPostsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch all posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    // Don't use window.confirm - just delete directly or could add a modal
    try {
      setDeletingPostId(postId);
      await deletePost(postId);
      // Remove from local state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    } finally {
      setDeletingPostId(null);
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Navigation />
      <div className={styles.adminLayout}>
        <AdminSidebar />
      
        <main className={styles.mainContent}>
          <div className={styles.headerWrapper}>
            <Aurora 
              colorStops={['#667eea', '#764ba2', '#f093fb']}
              amplitude={1.2}
              blend={0.6}
              speed={0.4}
            />
            <div className={styles.headerCard}>
              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Community Posts</h1>
                <p className={styles.pageSubtitle}>
                  Manage all community posts from users
                </p>
              </div>
            </div>
          </div>

          <div className={styles.contentSection}>
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            {loading ? (
              <div className={styles.loading}>Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className={styles.empty}>No posts found</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Author</th>
                      <th>Content</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userAvatar}>
                              {post.userDisplayName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span>{post.userDisplayName || 'Unknown User'}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.contentCell}>
                            {truncateContent(post.content)}
                          </div>
                        </td>
                        <td className={styles.centerCell}>{post.likeCount}</td>
                        <td className={styles.centerCell}>{post.commentCount}</td>
                        <td>{formatDate(post.createdAt)}</td>
                        <td>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletingPostId === post.id}
                            className={styles.deleteButton}
                            title="Delete post"
                          >
                            {deletingPostId === post.id ? (
                              'Deleting...'
                            ) : (
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPostsPage;
