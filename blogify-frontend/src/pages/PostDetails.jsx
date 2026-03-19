import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LazyImage from '../components/LazyImage';

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState(null);

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
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/comments', { content: commentText, postId: id }, config);
            
            // Optimistic UI update
            setPost({ ...post, comments: [...post.comments, data] });
            setCommentText('');
        } catch (err) {
            alert('Failed to add comment');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', color: 'var(--danger)', marginTop: '50px' }}>{error}</div>;
    if (!post) return null;

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
            <div style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '30px' }}>
                <LazyImage src={post.image || `https://source.unsplash.com/random/1200x600/?technology,abstract&sig=${post._id}`} alt={post.title} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {post.tags?.map(tag => (
                    <span key={tag} style={{ fontSize: '0.85rem', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-primary)', borderRadius: '20px', fontWeight: 600 }}>{tag}</span>
                ))}
            </div>

            <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>{post.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                <span>By <strong style={{ color: 'var(--text-primary)' }}>{post.author?.username}</strong></span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: '60px' }}>
                {post.content}
            </div>

            {/* Comments Section */}
            <div className="glass-panel" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Comments ({post.comments?.length || 0})</h3>
                
                {user ? (
                    <form onSubmit={handleAddComment} style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Add a comment..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Post</button>
                    </form>
                ) : (
                    <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}><Link to="/login">Login</Link> to join the conversation.</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {post.comments?.map(comment => (
                        <div key={comment._id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong style={{ color: 'var(--accent-primary)' }}>{comment.author?.username}</strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-primary)' }}>{comment.content}</p>
                        </div>
                    ))}
                    {post.comments?.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No comments yet. Be the first!</p>}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
