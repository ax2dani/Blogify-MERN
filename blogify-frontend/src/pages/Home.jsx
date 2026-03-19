import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [searchInput, setSearchInput] = useState(''); // Debounced state

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/posts?pageNumber=${page}&keyword=${keyword}&tag=${tagFilter}`);
                setPosts(data.posts);
                setPages(data.pages);
            } catch (err) {
                setError('Failed to load posts');
            }
            setLoading(false);
        };

        fetchPosts();
    }, [page, keyword, tagFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
        setPage(1); // Reset pagination on new search
    };

    const handleTagClick = (tag) => {
        setTagFilter(tag === tagFilter ? '' : tag); // Toggle tag
        setPage(1);
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

            {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '40px', alignItems: 'start' }}>
                {/* Main Feed */}
                <div style={{ width: '100%' }}>
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass-panel skeleton" style={{ height: '380px', animation: 'fadeIn 0.5s ease-in' }} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {posts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)' }}>
                                    <h3 style={{ color: 'var(--text-secondary)' }}>No posts found visually matching your criteria.</h3>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                                    {posts.map((post) => (
                                        <PostCard 
                                            key={post._id} 
                                            post={post} 
                                        />
                                    ))}
                                </div>
                            )}

                            {pages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '50px' }}>
                                    {[...Array(pages).keys()].map(x => (
                                        <button
                                            key={x + 1}
                                            onClick={() => setPage(x + 1)}
                                            className={`btn ${x + 1 === page ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{ padding: '8px 16px', borderRadius: '50%' }}
                                        >
                                            {x + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="glass-panel" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
                    <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Search Articles</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>🔍</button>
                        </div>
                    </form>

                    <div>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Popular Tags</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {popularTags.map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    style={{ 
                                        background: tagFilter === tag ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', 
                                        color: tagFilter === tag ? '#fff' : 'var(--text-primary)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                        {tagFilter && <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>Currently filtering by <strong>#{tagFilter}</strong></p>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
