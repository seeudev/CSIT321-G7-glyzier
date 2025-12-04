/**
 * Community Page - Module 18: Community Feed
 * 
 * Main page for the community feed feature.
 * Displays all posts with create input at the top.
 * 
 * Features:
 * - Create new posts
 * - View all posts (newest first)
 * - Interact with posts (like, comment)
 * - Delete posts (admin/owner)
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts, createPost } from '../services/postService';
import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import Aurora from '../components/Aurora';
import styles from '../styles/pages/CommunityPage.module.css';

function CommunityPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postContent, setPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    /**
     * Load all posts on component mount
     */
    useEffect(() => {
        loadPosts();
    }, []);

    /**
     * Fetch all posts from the server
     */
    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle post creation
     */
    const handleCreatePost = async (e) => {
        e.preventDefault();
        
        if (!user) {
            return;
        }

        if (!postContent.trim()) {
            return;
        }

        if (postContent.length > 500) {
            return;
        }

        setSubmitting(true);
        try {
            const newPost = await createPost(postContent);
            setPosts([newPost, ...posts]); // Add to top of list
            setPostContent(''); // Clear input
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Handle post deletion
     */
    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    /**
     * Calculate remaining characters
     */
    const remainingChars = 500 - postContent.length;

    return (
        <>
            <Navigation />
            <div className={styles.headerSection}>
                <Aurora />
                <div className={styles.headerContent}>
                    <div className={styles.headerWrapper}>
                        <button 
                            className={styles.backButton} 
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                        >
                            ← Back
                        </button>
                        <div className={styles.headerGlassCard}>
                            <h1 className={styles.title}>Community Feed</h1>
                            <p className={styles.subtitle}>
                                Share your thoughts and connect with the Glyzier community
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.content}>

                    {/* Create Post Form */}
                    {user ? (
                        <div className={styles.createPostCard}>
                            <form onSubmit={handleCreatePost} className={styles.createPostForm}>
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    maxLength={500}
                                    disabled={submitting}
                                    className={styles.createPostInput}
                                    rows={3}
                                />
                                <div className={styles.createPostFooter}>
                                    <span className={styles.charCount}>
                                        {remainingChars} characters remaining
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={!postContent.trim() || submitting}
                                        className={styles.createPostButton}
                                    >
                                        {submitting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className={styles.loginPrompt}>
                            <p>Please login to create posts and interact with the community</p>
                        </div>
                    )}

                    {/* Posts Feed */}
                    {loading ? (
                        <div className={styles.loading}>Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No posts yet. Be the first to share something!</p>
                        </div>
                    ) : (
                        <div className={styles.postsContainer}>
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onDelete={handleDeletePost}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CommunityPage;
