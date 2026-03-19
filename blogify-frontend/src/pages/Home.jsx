import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/posts?pageNumber=${page}`);
                setPosts(data.posts);
                setPages(data.pages);
            } catch (err) {
                setError('Failed to load posts');
            }
            setLoading(false);
        };

        fetchPosts();
    }, [page]);

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }} className="animate-slide-up">
                <h1 style={{ fontSize: '3rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
                    Discover Amazing Content
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore the latest thoughts, tutorials, and insights from our community of writers.
                </p>
            </div>

            {error && <div style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</div>}

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-panel skeleton" style={{ height: '380px', animation: 'fadeIn 0.5s ease-in' }} />
                    ))}
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {posts.map((post, index) => (
                            <PostCard 
                                key={post._id} 
                                post={post} 
                                style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }} 
                            />
                        ))}
                    </div>

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
    );
};

export default Home;
