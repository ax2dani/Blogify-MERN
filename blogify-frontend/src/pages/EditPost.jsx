import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const EditPost = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`/api/posts/${id}`);
                // Verify ownership constraints
                if (data.author._id !== user._id && user.role !== 'ADMIN') {
                    navigate('/');
                    return;
                }
                setTitle(data.title);
                setContent(data.content);
                setTags((data.tags || []).join(', '));
                setCurrentImage(data.image);
            } catch (err) {
                alert('Failed to fetch post details');
                navigate('/');
            }
            setLoading(false);
        };

        fetchPost();
    }, [id, user, navigate]);

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            let imagePath = currentImage;

            // Upload new cover image if provided
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await axios.post('/api/upload', formData, config);
                imagePath = uploadRes.data.imagePath;
            }

            const payload = {
                title,
                content,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                image: imagePath
            };

            await axios.put(`/api/posts/${id}`, payload, config);
            navigate(`/post/${id}`);
        } catch (error) {
            alert('Failed to update post');
        }
        setLoading(false);
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading Editor...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container" 
            style={{ maxWidth: '800px', marginTop: '40px', marginBottom: '40px' }}
        >
            <BackButton />
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Edit Article</h2>
                
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Article Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            placeholder="A captivating title goes here..."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Cover Image Mapping</label>
                        {currentImage && !imageFile && (
                            <div style={{ marginBottom: '10px' }}>
                                <img src={`http://localhost:5000${currentImage}`} alt="Current" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px' }} />
                            </div>
                        )}
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="form-control"
                            accept="image/*"
                            style={{ background: 'var(--glass-bg)' }}
                        />
                        <small style={{ color: 'var(--text-secondary)' }}>Leave blank to retain current image.</small>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Tag Matrix (comma separated)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={tags} 
                            onChange={(e) => setTags(e.target.value)} 
                            placeholder="react, tech, future..."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Content Layout (HTML Supported)</label>
                        <textarea 
                            className="form-control" 
                            rows="15" 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            required 
                            placeholder="<p>Draft your masterpiece here...</p>"
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button type="button" onClick={() => navigate(`/post/${id}`)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel Edit</button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
                            {loading ? 'Patching Database...' : 'Update Article'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default EditPost;
