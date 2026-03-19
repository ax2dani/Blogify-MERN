import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';

const PostCard = ({ post, style }) => {
    return (
        <div className="glass-panel" style={{ 
            ...style,
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
        >
            <div style={{ height: '200px', width: '100%' }}>
                <LazyImage 
                    src={post.image || `https://source.unsplash.com/random/800x600/?technology,abstract&sig=${post._id}`} 
                    alt={post.title}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {post.tags?.map((tag, idx) => (
                        <span key={idx} style={{ 
                            fontSize: '0.75rem', 
                            padding: '4px 8px', 
                            background: 'rgba(59, 130, 246, 0.15)', 
                            color: 'var(--accent-primary)',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}>{tag}</span>
                    ))}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                    <Link to={`/post/${post._id}`} style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                    </Link>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', flexGrow: 1 }}>
                    {post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        By <span style={{ color: 'var(--accent-primary)' }}>{post.author?.username || 'Unknown'}</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
