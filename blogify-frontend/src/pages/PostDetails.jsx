import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Trash2, Flag, UserPlus, UserCheck } from 'lucide-react';
import BackButton from '../components/BackButton';
import { io } from 'socket.io-client';
import LazyImage from '../components/LazyImage';
import PostCard from '../components/PostCard';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [reportStatus, setReportStatus] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [recommended, setRecommended] = useState([]);

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

        // Fetch recommended posts
        const fetchRecommended = async () => {
            try {
                const { data } = await axios.get(`/api/posts/${id}/recommended`);
                setRecommended(data);
            } catch (err) {}
        };
        fetchRecommended();

        if (user) {
            const fetchBookmarks = async () => {
                try {
                    const { data } = await axios.get('/api/bookmarks', { headers: { Authorization: `Bearer ${user.token}` } });
                    setIsBookmarked(data.some(b => b._id === id));
                } catch (err) {}
            };
            fetchBookmarks();
        }

        const socket = io();
        socket.emit('join_post', id);
        socket.on('new_comment', (newComment) => {
            setPost(currentPost => {
                if (currentPost.comments.some(c => c._id === newComment._id)) return currentPost;
                return { ...currentPost, comments: [...currentPost.comments, newComment] };
            });
        });
        return () => { socket.disconnect(); };
    }, [id]);

    // Fetch follow status after post loads (needs author id)
    useEffect(() => {
        if (!user || !post) return;
        if (post.author._id === user._id) return;
        const fetchFollowStatus = async () => {
            try {
                const { data } = await axios.get(`/api/follow/${post.author._id}/status`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setIsFollowing(data.following);
                setFollowerCount(data.followerCount);
            } catch (err) {}
        };
        fetchFollowStatus();
    }, [post, user]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/comments', { content: comment, postId: id }, config);
            setComment('');
        } catch (err) { alert('Failed to add comment'); }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/comments/${commentId}`, config);
            setPost({ ...post, comments: post.comments.filter(c => c._id !== commentId) });
        } catch (err) { alert('Failed to delete comment'); }
    };

    const handleLike = async () => {
        if (!user) return alert('Please login to like this post!');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/posts/${post._id}/like`, {}, config);
            setPost({ ...post, likes: data });
        } catch (err) { alert('Failed to update like'); }
    };

    const handleBookmark = async () => {
        if (!user) return alert('Please login to bookmark this post!');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/bookmarks/${post._id}`, {}, config);
            setIsBookmarked(data.bookmarked);
        } catch (err) { alert('Failed to update bookmark'); }
    };

    const handleDeletePost = async () => { setShowDeleteModal(true); };
    const confirmDelete = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/posts/${id}`, config);
            setShowDeleteModal(false);
            navigate('/');
        } catch (err) { alert('Failed to delete post'); }
    };

    const handleFollow = async () => {
        if (!user) return alert('Please login to follow users!');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/follow/${post.author._id}`, {}, config);
            setIsFollowing(data.following);
            setFollowerCount(data.followerCount);
        } catch (err) { alert('Failed to update follow'); }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/reports', { postId: post._id, reason: reportReason, details: reportDetails }, config);
            setReportStatus('success');
        } catch (err) {
            setReportStatus(err.response?.data?.message || 'Failed to submit report');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading post...</div>;
    if (error || !post) return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'var(--danger)' }}>{error || 'Post not found'}</div>;

    const isAuthor = user && user._id === post.author._id;

    return (
        <>
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
                {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>

            <h1 style={{ fontSize: '3rem', marginBottom: '20px', lineHeight: '1.2' }}>{post.title}</h1>
            
            {/* Author + Actions row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {post.author.avatar && <img src={post.author.avatar} alt={post.author.username} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                    <div>
                        <Link to={`/profile/${post.author.username}`} style={{ fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none' }}>{post.author.username}</Link>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {/* Follow button — only for non-authors */}
                    {user && !isAuthor && (
                        <button onClick={handleFollow} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${isFollowing ? 'var(--glass-border)' : 'var(--accent-primary)'}`, background: isFollowing ? 'transparent' : 'rgba(59,130,246,0.1)', color: isFollowing ? 'var(--text-secondary)' : 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                            {isFollowing ? <UserCheck size={15} /> : <UserPlus size={15} />}
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {isAuthor && (
                        <>
                            <Link to={`/edit-post/${post._id}`} className="btn btn-secondary" style={{ padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none' }}>Edit Post</Link>
                            <button onClick={handleDeletePost} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Delete Post</button>
                        </>
                    )}
                    
                    {/* Like */}
                    <motion.button whileTap={{ scale: 0.8 }} onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s' }}>
                        <Heart size={20} color={post.likes?.includes(user?._id) ? '#ef4444' : 'var(--text-secondary)'} fill={post.likes?.includes(user?._id) ? '#ef4444' : 'none'} />
                        <span style={{ fontWeight: 'bold' }}>{post.likes?.length || 0}</span>
                    </motion.button>

                    {/* Bookmark */}
                    <motion.button whileTap={{ scale: 0.8 }} onClick={handleBookmark} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s' }}>
                        <Bookmark size={20} color={isBookmarked ? 'var(--accent-primary)' : 'var(--text-secondary)'} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} />
                    </motion.button>

                    {/* Report — for non-authors */}
                    {user && !isAuthor && (
                        <button onClick={() => setShowReportModal(true)} title="Report this post" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '20px', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7}>
                            <Flag size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Rich HTML Content */}
            <div 
                className="rich-content"
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '60px', whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Comments Section */}
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Comments ({post.comments.length})</h3>
                {user ? (
                    <form onSubmit={handleAddComment} style={{ marginBottom: '40px' }}>
                        <div className="form-group">
                            <textarea className="form-control" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} required placeholder="Add to the discussion..." style={{ resize: 'vertical' }}></textarea>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {c.author?.avatar && <img src={c.author.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />}
                                    <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{c.author.username}</span>
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{c.content}</p>
                            {user && (user._id === c.author._id || user._id === post.author._id) && (
                                <button onClick={() => handleDeleteComment(c._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px', opacity: 0.8 }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.8}>Delete</button>
                            )}
                        </div>
                    ))}
                    {post.comments.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No comments yet. Be the first!</p>}
                </div>
            </div>

            {/* Recommended Posts */}
            {recommended.length > 0 && (
                <div style={{ marginBottom: '60px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>You might also like</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {recommended.map(p => <PostCard key={p._id} post={p} />)}
                    </div>
                </div>
            )}
        </motion.div>

            {/* Delete Post Modal */}
            {showDeleteModal && (
                <div onClick={() => setShowDeleteModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, animation: 'fadeIn 0.2s ease-out' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={28} color="var(--danger)" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Delete Post?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>This will permanently remove this article and all its comments. This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Cancel</button>
                            <button onClick={confirmDelete} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Post Modal */}
            {showReportModal && (
                <div onClick={() => { setShowReportModal(false); setReportStatus(null); setReportReason(''); setReportDetails(''); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, animation: 'fadeIn 0.2s ease-out' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '40px', maxWidth: '440px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(251, 161, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Flag size={22} color="#f97316" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Report Post</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Help us keep the community safe</p>
                            </div>
                        </div>

                        {reportStatus === 'success' ? (
                            <div>
                                <p style={{ color: 'var(--success)', marginBottom: '20px', lineHeight: '1.5' }}>✅ Report submitted. Thank you for keeping the community safe.</p>
                                <button onClick={() => { setShowReportModal(false); setReportStatus(null); }} className="btn btn-primary" style={{ width: '100%', borderRadius: '10px' }}>Done</button>
                            </div>
                        ) : (
                            <form onSubmit={handleReport}>
                                <div className="form-group">
                                    <label className="form-label">Reason</label>
                                    <select className="form-control" value={reportReason} onChange={e => setReportReason(e.target.value)} required style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                                        <option value="">Select a reason...</option>
                                        <option>Spam</option>
                                        <option>Misinformation</option>
                                        <option>Inappropriate Content</option>
                                        <option>Harassment</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Additional details (optional)</label>
                                    <textarea className="form-control" rows="3" value={reportDetails} onChange={e => setReportDetails(e.target.value)} placeholder="Provide more context..." style={{ resize: 'vertical' }} />
                                </div>
                                {reportStatus && <p style={{ color: 'var(--danger)', marginBottom: '12px', fontSize: '0.9rem' }}>{reportStatus}</p>}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => { setShowReportModal(false); setReportStatus(null); }} className="btn btn-secondary" style={{ flex: 1, borderRadius: '10px' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '10px', background: '#f97316', border: 'none' }}>Submit Report</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PostDetails;
