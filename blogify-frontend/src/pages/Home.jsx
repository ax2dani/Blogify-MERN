import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { X, Loader } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [tagFilter, setTagFilter] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const sentinelRef = useRef(null);

    // Reset and re-fetch when keyword or tag changes
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [keyword, tagFilter]);

    // Fetch posts for the current page
    useEffect(() => {
        const fetchPosts = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            try {
                const { data } = await axios.get(`/api/posts?pageNumber=${page}&keyword=${keyword}&tag=${tagFilter}`);
                setPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
                setHasMore(page < data.pages);
            } catch (err) {
                setError('Failed to load posts');
            }
            setLoading(false);
            setLoadingMore(false);
        };
        fetchPosts();
    }, [page, keyword, tagFilter]);

    // IntersectionObserver for infinite scroll
    const observerRef = useRef(null);
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );
        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
        return () => { if (observerRef.current) observerRef.current.disconnect(); };
    }, [hasMore, loadingMore]);

    const handleTagClick = (tag) => {
        setTagFilter(tag === tagFilter ? '' : tag);
    };

    const clearSearch = () => {
        setSearchParams({});
    };

    const popularTags = ['tech', 'react', 'node', 'architecture', 'design', 'lifestyle'];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container" 
            style={{ padding: '40px 24px' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '50px' }} className="animate-slide-up">
                <h1 style={{ fontSize: '3.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '15px' }}>
                    Blogify
                </h1>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '500', marginBottom: '15px', letterSpacing: '-0.02em' }}>
                    Write the Moment. Share the Connection.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore the latest thoughts, tutorials, and insights from our community of writers.
                </p>
            </div>

            {/* Active Filter Indicators */}
            {(keyword || tagFilter) && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    {keyword && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                            Searching: "{keyword}"
                            <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                        </div>
                    )}
                    {tagFilter && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '20px', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                            Tag: #{tagFilter}
                            <button onClick={() => setTagFilter('')} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                        </div>
                    )}
                </div>
            )}

            {/* Tag Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {popularTags.map(tag => (
                    <button 
                        key={tag} onClick={() => handleTagClick(tag)}
                        style={{ background: tagFilter === tag ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: tagFilter === tag ? '#fff' : 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 500, fontSize: '0.9rem' }}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

            {/* Initial skeleton loading */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-panel skeleton" style={{ height: '380px' }} />
                    ))}
                </div>
            ) : (
                <>
                    {posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)' }}>
                            <h3 style={{ color: 'var(--text-secondary)' }}>No posts found matching your criteria.</h3>
                            <button onClick={() => { clearSearch(); setTagFilter(''); }} className="btn btn-secondary" style={{ marginTop: '20px', borderRadius: '20px' }}>Clear Filters</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                            {posts.map((post) => <PostCard key={post._id} post={post} />)}
                        </div>
                    )}

                    {/* Sentinel div for IntersectionObserver */}
                    <div ref={sentinelRef} style={{ height: '20px', marginTop: '30px' }} />

                    {/* Loading More Spinner */}
                    {loadingMore && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '30px', color: 'var(--text-secondary)' }}>
                            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Loading more posts...</span>
                        </div>
                    )}

                    {/* End of feed message */}
                    {!hasMore && posts.length > 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px', fontSize: '0.95rem' }}>
                            You've reached the end of the feed 🎉
                        </p>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default Home;
