import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark } from 'lucide-react';
import BackButton from '../components/BackButton';
import { io } from 'socket.io-client';
import LazyImage from '../components/LazyImage';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`/api/posts/${id}`);
                setPost(data);
            } catch (err) {
                setError('Failed to load post');
            }
            setLoading(false);
        };
        fetchPost();

        if (user) {
            const fetchBookmarks = async () => {
                try {
                    const { data } = await axios.get('/api/bookmarks', { headers: { Authorization: `Bearer ${user.token}` } });
                    setIsBookmarked(data.some(b => b._id === id));
                } catch (err) {}
            };
            fetchBookmarks();
        }

        // Initialize Socket
        const socket = io(); // Connects via Vite proxy
        socket.emit('join_post', id);

        socket.on('new_comment', (newComment) => {
            setPost(currentPost => {
                // Prevent duplicate optimistic comments
                if (currentPost.comments.some(c => c._id === newComment._id)) return currentPost;
                return { ...currentPost, comments: [...currentPost.comments, newComment] };
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/comments', { content: comment, postId: id }, config);
            // The Socket will broadcast the comment back, but we can do an optimistic UI update 
            // if we want speed, OR just wait for the socket! Since it is instant, we'll let Socket do the heavy lifting.
            // setPost({ ...post, comments: [...post.comments, newComment] });
            setComment('');
        } catch (err) {
            alert('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/comments/${commentId}`, config);
            setPost({ ...post, comments: post.comments.filter(c => c._id !== commentId) });
        } catch (err) {
            alert('Failed to delete comment');
        }
    };

    const handleLike = async () => {
        if (!user) return alert('Please login to like this post!');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/posts/${post._id}/like`, {}, config);
            setPost({ ...post, likes: data });
        } catch (err) {
            alert('Failed to update like');
        }
    };

    const handleBookmark = async () => {
        if (!user) return alert('Please login to bookmark this post!');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/bookmarks/${post._id}`, {}, config);
            setIsBookmarked(data.bookmarked);
        } catch (err) {
            alert('Failed to update bookmark');
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this entire post? This action cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/posts/${id}`, config);
                navigate('/');
            } catch (err) {
                alert('Failed to delete post');
            }
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading post...</div>;
    if (error || !post) return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'var(--danger)' }}>{error || 'Post not found'}</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="container" 
            style={{ maxWidth: '800px', padding: '40px 24px' }}
        >
            <BackButton />

            {post.image && (
                <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '30px' }} />
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <h1 style={{ fontSize: '3rem', marginBottom: '20px', lineHeight: '1.2' }}>{post.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>By {post.author.username}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {user && user._id === post.author._id && (
                        <>
                            <Link 
                                to={`/edit-post/${post._id}`}
                                className="btn btn-secondary"
                                style={{ padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none' }}
                            >
                                Edit Post
                            </Link>
                            <button 
                                onClick={handleDeletePost}
                                className="btn btn-secondary"
                                style={{ 
                                    background: 'transparent', border: '1px solid var(--danger)', 
                                    color: 'var(--danger)', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem'
                                }}
                            >
                                Delete Post
                            </button>
                        </>
                    )}
                    
                    <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={handleLike}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', 
                            background: 'rgba(239, 68, 68, 0.1)', border: 'none', 
                            padding: '10px 15px', borderRadius: '20px', 
                            cursor: 'pointer', color: 'var(--text-primary)',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Heart 
                            size={20} 
                            color={post.likes?.includes(user?._id) ? '#ef4444' : 'var(--text-secondary)'} 
                            fill={post.likes?.includes(user?._id) ? '#ef4444' : 'none'} 
                        />
                        <span style={{ fontWeight: 'bold' }}>{post.likes?.length || 0}</span>
                    </motion.button>

                    <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={handleBookmark}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', 
                            background: 'rgba(59, 130, 246, 0.1)', border: 'none', 
                            padding: '10px 15px', borderRadius: '20px', 
                            cursor: 'pointer', color: 'var(--text-primary)',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Bookmark 
                            size={20} 
                            color={isBookmarked ? 'var(--accent-primary)' : 'var(--text-secondary)'} 
                            fill={isBookmarked ? 'var(--accent-primary)' : 'none'} 
                        />
                    </motion.button>
                </div>
            </div>

            <div 
                className="rich-text-content"
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '60px', whiteSpace: 'pre-wrap' }}
            >
                {post.content}
            </div>

            {/* Comments Section */}
            <div className="glass-panel" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Comments ({post.comments.length})</h3>
                
                {user ? (
                    <form onSubmit={handleAddComment} style={{ marginBottom: '40px' }}>
                        <div className="form-group">
                            <textarea 
                                className="form-control" 
                                rows="3" 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)} 
                                required 
                                placeholder="Add to the discussion..."
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Post Comment</button>
                    </form>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-sm)', marginBottom: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Join the conversation</p>
                        <Link to="/login" className="btn btn-primary">Login to Comment</Link>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {post.comments.map(c => (
                        <div key={c._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{c.author.username}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{c.content}</p>
                            
                            {user && (user._id === c.author._id || user._id === post.author._id) && (
                                <button 
                                    onClick={() => handleDeleteComment(c._id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px', opacity: 0.8 }}
                                    onMouseOver={e => e.target.style.opacity = 1}
                                    onMouseOut={e => e.target.style.opacity = 0.8}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {post.comments.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No comments yet. Be the first!</p>}
                </div>
            </div>
        </motion.div>
    );
};

export default PostDetails;
