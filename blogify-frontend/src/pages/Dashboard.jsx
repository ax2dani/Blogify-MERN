import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        setMessage(null);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data); // e.g. /uploads/image-xyz.jpg
        } catch (error) {
            setMessage({ type: 'error', text: 'Image upload failed. Images only!' });
        }
        setUploading(false);
    };

    if (!user) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="container" 
            style={{ padding: '40px 24px' }}
        >
            <BackButton />
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
                            <label className="form-label">Cover Image</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={uploadFileHandler} 
                                accept="image/*"
                            />
                            {uploading && <p style={{ color: 'var(--accent-primary)', marginTop: '10px' }}>Uploading image...</p>}
                            {image && <p style={{ color: 'var(--success)', marginTop: '10px' }}>Image uploaded successfully! ({image})</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags (comma separated)</label>
                            <input type="text" className="form-control" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tech, coding, react" />
                        </div>
                        <div className="form-group" style={{ marginBottom: '40px' }}>
                            <label className="form-label">Content</label>
                            <textarea
                                className="form-control"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ height: '300px', resize: 'vertical' }}
                                required
                                placeholder="Write your brilliant article here... (Newlines are preserved!)"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
