/**
 * PostCard Component - Module 18: Community Feed
 * 
 * Displays a single post with like/comment functionality.
 * Supports:
 * - Displaying post content, author, and timestamp
 * - Liking/unliking posts
 * - Adding comments
 * - Viewing comments (expandable)
 * - Deleting posts (admin/owner only)
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toggleLike, addComment, getComments, deletePost } from '../services/postService';
import { Heart, MessageCircle, Trash2 } from './Icons';
import styles from '../styles/pages/CommunityPage.module.css';

function PostCard({ post, onUpdate, onDelete }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.likedByCurrentUser);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [commentCount, setCommentCount] = useState(post.commentCount);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Check if current user can delete this post
    const canDelete = user && (user.role === 'ADMIN' || user.userid === post.userId);

    /**
     * Handle like toggle
     */
    const handleLike = async () => {
        if (!user) {
            return;
        }

        setLoading(true);
        try {
            const response = await toggleLike(post.id);
            setLiked(response.liked);
            setLikeCount(response.likeCount);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle comment submission
     */
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        if (!commentContent.trim()) {
            return;
        }

        setCommentLoading(true);
        try {
            const newComment = await addComment(post.id, commentContent);
            setComments([...comments, newComment]);
            setCommentCount(commentCount + 1);
            setCommentContent('');
            setShowComments(true); // Show comments after adding
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setCommentLoading(false);
        }
    };

    /**
     * Handle comment toggle (load comments if not loaded)
     */
    const handleToggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setLoading(true);
            try {
                const fetchedComments = await getComments(post.id);
                setComments(fetchedComments);
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                setLoading(false);
            }
        }
        setShowComments(!showComments);
    };

    /**
     * Handle post deletion
     */
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(true);
        try {
            await deletePost(post.id);
            onDelete(post.id); // Notify parent to remove from list
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    /**
     * Format timestamp to relative time
     */
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={styles.postCard}>
            {/* Post Header */}
            <div className={styles.postHeader}>
                <div className={styles.postAuthor}>
                    <div className={styles.authorAvatar}>
                        {post.userDisplayName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <div className={styles.authorName}>{post.userDisplayName || 'Anonymous'}</div>
                        <div className={styles.postTime}>{formatTime(post.createdAt)}</div>
                    </div>
                </div>
                {canDelete && (
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        aria-label="Delete post"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Post Content */}
            <div className={styles.postContent}>
                {post.content}
            </div>

            {/* Post Actions */}
            <div className={styles.postActions}>
                <button
                    type="button"
                    className={`${styles.actionButton} ${liked ? styles.liked : ''}`}
                    onClick={handleLike}
                    disabled={loading}
                >
                    <Heart size={20} fill={liked} />
                    <span>{likeCount}</span>
                </button>
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={handleToggleComments}
                    disabled={loading}
                >
                    <MessageCircle size={20} />
                    <span>{commentCount}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className={styles.commentsSection}>
                    {/* Comment Input */}
                    {user && (
                        <form onSubmit={handleAddComment} className={styles.commentForm}>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                maxLength={200}
                                disabled={commentLoading}
                                className={styles.commentInput}
                            />
                            <button
                                type="submit"
                                disabled={!commentContent.trim() || commentLoading}
                                className={styles.commentSubmit}
                            >
                                {commentLoading ? 'Posting...' : 'Post'}
                            </button>
                        </form>
                    )}

                    {/* Comments List */}
                    {loading && comments.length === 0 ? (
                        <div className={styles.loadingComments}>Loading comments...</div>
                    ) : (
                        <div className={styles.commentsList}>
                            {comments.length === 0 ? (
                                <div className={styles.noComments}>No comments yet</div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className={styles.comment}>
                                        <div className={styles.commentHeader}>
                                            <span className={styles.commentAuthor}>
                                                {comment.userDisplayName || 'Anonymous'}
                                            </span>
                                            <span className={styles.commentTime}>
                                                {formatTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <div className={styles.commentContent}>
                                            {comment.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostCard;
