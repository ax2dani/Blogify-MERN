import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, PenTool, ArrowRight, FileText, Trash2, Upload } from 'lucide-react';
import BackButton from '../components/BackButton';
import RichEditor from '../components/RichEditor';

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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const [editingDraftId, setEditingDraftId] = useState(null);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    // Autosave to localStorage every 3s when content changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title || content) {
                localStorage.setItem('blogify_draft', JSON.stringify({ title, content, tags, image }));
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [title, content, tags, image]);

    // Restore localStorage draft on mount
    useEffect(() => {
        const saved = localStorage.getItem('blogify_draft');
        if (saved) {
            const { title: t, content: c, tags: tg, image: img } = JSON.parse(saved);
            setTitle(t || '');
            setContent(c || '');
            setTags(tg || '');
            setImage(img || '');
        }
    }, []);

    const fetchDrafts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/posts/my-drafts', config);
            setDrafts(data);
        } catch (err) {}
    };

    const handleToggleDrafts = () => {
        if (!showDrafts) fetchDrafts();
        setShowDrafts(!showDrafts);
    };

    const loadDraft = async (draftId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/posts/${draftId}`, config);
            setTitle(data.title);
            setContent(data.content);
            setTags(data.tags.join(', '));
            setImage(data.image || '');
            setEditingDraftId(draftId);
            setShowDrafts(false);
        } catch (err) {}
    };

    const deleteDraft = async (draftId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/posts/${draftId}`, config);
            setDrafts(drafts.filter(d => d._id !== draftId));
        } catch (err) {}
    };

    const resetForm = () => {
        setTitle(''); setContent(''); setTags(''); setImage('');
        setEditingDraftId(null);
        localStorage.removeItem('blogify_draft');
    };

    const submitPost = async (status) => {
        setLoading(true);
        setMessage(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const postTags = tags.split(',').map(t => t.trim()).filter(t => t);
            const payload = { title, content, tags: postTags, image, status };

            if (editingDraftId) {
                await axios.put(`/api/posts/${editingDraftId}`, payload, config);
            } else {
                await axios.post('/api/posts', payload, config);
            }

            if (status === 'published') {
                resetForm();
                setShowSuccessModal(true);
            } else {
                resetForm();
                setMessage({ type: 'success', text: 'Draft saved successfully!' });
                fetchDrafts();
                if (!showDrafts) setShowDrafts(true);
            }
        } catch (error) {
            const errorMsg = error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            setMessage({ type: 'error', text: `Error: ${errorMsg}` });
        }
        setLoading(false);
    };

    const handleCreatePost = (e) => { e.preventDefault(); submitPost('published'); };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        setMessage(null);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Image upload failed. Images only!' });
        }
        setUploading(false);
    };

    if (!user) return null;

    return (
        <>
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="container" 
            style={{ padding: '40px 24px' }}
        >
            <BackButton />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{user.username}</span>!</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '8px 16px', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        Role: {user.role}
                    </div>
                    <button 
                        onClick={handleToggleDrafts}
                        className="btn btn-secondary"
                        style={{ borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <FileText size={16} /> My Drafts {drafts.length > 0 && <span style={{ background: 'var(--accent-primary)', color: '#fff', padding: '1px 7px', borderRadius: '10px', fontSize: '0.75rem' }}>{drafts.length}</span>}
                    </button>
                </div>
            </div>

            {/* Drafts Panel */}
            {showDrafts && (
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: '12px' }}>Saved Drafts</h3>
                    {drafts.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No drafts yet. Save a draft from the form below.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {drafts.map(d => (
                                <div key={d._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '10px', gap: '12px' }}>
                                    <span style={{ fontWeight: 600 }}>{d.title}</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(d.updatedAt).toLocaleDateString()}</span>
                                    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                        <button onClick={() => loadDraft(d._id)} className="btn btn-secondary" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>Edit</button>
                                        <button onClick={() => deleteDraft(d._id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                        {editingDraftId ? '✏️ Editing Draft' : 'Create New Post'}
                    </h2>
                    
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
                            <input type="file" className="form-control" onChange={uploadFileHandler} accept="image/*" />
                            {uploading && <p style={{ color: 'var(--accent-primary)', marginTop: '10px' }}>Uploading image...</p>}
                            {image && <p style={{ color: 'var(--success)', marginTop: '10px' }}>✓ Image uploaded</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags (comma separated)</label>
                            <input type="text" className="form-control" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tech, coding, react" />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label className="form-label">Content</label>
                            <RichEditor content={content} onChange={setContent} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>💾 Auto-saving draft to your browser every 3 seconds</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" onClick={() => submitPost('draft')} className="btn btn-secondary" disabled={loading} style={{ flex: 1, borderRadius: '10px' }}>
                                <FileText size={16} /> Save Draft
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, borderRadius: '10px' }}>
                                {loading ? 'Publishing...' : 'Publish Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>

            {/* Post Published Success Modal */}
            {showSuccessModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, animation: 'fadeIn 0.2s ease-out' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '40px', maxWidth: '420px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={36} color="var(--success)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Post Published! 🎉</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>Your article is now live on the feed for everyone to read.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowSuccessModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <PenTool size={16} /> Write Another
                            </button>
                            <button onClick={() => navigate('/feed')} className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                Go to Feed <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
