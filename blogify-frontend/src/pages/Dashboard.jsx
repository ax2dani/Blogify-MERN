import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const postTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            await axios.post('/api/posts', { title, content, tags: postTags, image }, config);
            
            setMessage({ type: 'success', text: 'Post created successfully!' });
            setTitle('');
            setContent('');
            setTags('');
            setImage('');
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create post.' });
        }
        setLoading(false);
    };

    if (!user) return null;

    return (
        <div className="container animate-slide-up" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{user.username}</span>!</p>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '8px 16px', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Role: {user.role}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Create New Post</h2>
                    
                    {message && (
                        <div style={{ 
                            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', 
                            padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' 
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleCreatePost}>
                        <div className="form-group">
                            <label className="form-label">Post Title</label>
                            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Amazing Architecture Patterns" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL (Optional)</label>
                            <input type="url" className="form-control" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags (comma separated)</label>
                            <input type="text" className="form-control" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tech, coding, react" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Content</label>
                            <textarea className="form-control" rows="8" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Write your thoughts here..." style={{ resize: 'vertical' }}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Quick Stats</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Since this is a portfolio project, your dashboard represents a consolidated API endpoint architecture reducing fetch overhead.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>Active Role</span>
                            <span style={{ color: 'var(--accent-secondary)' }}>{user.role}</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>API Status</span>
                            <span style={{ color: 'var(--success)' }}>Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
