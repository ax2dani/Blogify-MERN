import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';

const PostCard = ({ post, style }) => {
    return (
        <div style={{ 
            ...style,
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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
            {post.image ? (
                <div style={{ height: '200px', width: '100%', flexShrink: 0 }}>
                    <LazyImage 
                        src={post.image} 
                        alt={post.title}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            ) : null}
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
                    {(() => {
                        const plainText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                        return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
                    })()}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {post.author?.avatar && (
                            <img 
                                src={`http://localhost:5000${post.author.avatar}`} 
                                alt={post.author.username} 
                                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                        )}
                        <span>By <span style={{ color: 'var(--accent-primary)' }}>{post.author?.username || 'Unknown'}</span></span>
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
