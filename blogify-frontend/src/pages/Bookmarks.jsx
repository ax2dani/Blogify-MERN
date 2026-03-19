import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Clock } from 'lucide-react';
import BackButton from '../components/BackButton';

const Bookmarks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchBookmarks = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/bookmarks', config);
                setBookmarks(data);
            } catch (err) {
                console.error("Failed to load bookmarks");
            }
            setLoading(false);
        };
        fetchBookmarks();
    }, [user, navigate]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading Collection...</div>;

    const removeBookmark = async (postId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/bookmarks/${postId}`, {}, config);
            setBookmarks(bookmarks.filter(b => b._id !== postId));
        } catch (err) {
            console.error("Failed to unsave");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}
        >
            <BackButton />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                    <Bookmark size={28} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Your Saved Articles</h1>
            </div>

            {bookmarks.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <Bookmark size={48} color="var(--text-secondary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>No bookmarks yet</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>When you find an interesting article, tap the Bookmark icon to save it here for later.</p>
                    <Link to="/feed" className="btn btn-primary">Explore Articles</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {bookmarks.map((post) => (
                        <div key={post._id} className="glass-panel card-hover" style={{ padding: '25px', display: 'flex', gap: '20px', position: 'relative' }}>
                            {post.image && (
                                <div style={{ width: '150px', height: '100px', flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <img src={`http://localhost:5000${post.image}`} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <Link to={`/post/${post._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: '1.3' }}>{post.title}</h3>
                                    </Link>
                                    <button 
                                        onClick={() => removeBookmark(post._id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px' }}
                                        title="Remove bookmark"
                                    >
                                        <Bookmark size={20} fill="var(--text-secondary)" />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem', alignItems: 'center' }}>
                                    <span>By <Link to={`/profile/${post.author.username}`} style={{ color: 'var(--accent-secondary)' }}>{post.author.username}</Link></span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Bookmarks;
