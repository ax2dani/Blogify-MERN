import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { MapPin, User as UserIcon, Calendar, Clock, Edit2, UserPlus, UserCheck } from 'lucide-react';
import BackButton from '../components/BackButton';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`/api/profiles/${username}`);
                setProfile(data.user);
                setPosts(data.posts);
                setComments(data.comments);
                setFollowerCount(data.user.followers?.length || 0);
                setFollowingCount(data.user.following?.length || 0);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
            setLoading(false);
        };
        fetchProfile();

        if (currentUser && currentUser.username !== username) {
            const fetchFollowStatus = async () => {
                try {
                    const { data } = await axios.get(`/api/profiles/${username}`);
                    const profileUser = data.user;
                    const { data: followData } = await axios.get(`/api/follow/${profileUser._id}/status`, {
                        headers: { Authorization: `Bearer ${currentUser.token}` }
                    });
                    setIsFollowing(followData.following);
                } catch (err) {}
            };
            fetchFollowStatus();
        }
    }, [username]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}><h2>Loading Identity...</h2></div>;
    if (!profile) return <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}><h2>User Not Found</h2></div>;

    const isOwner = currentUser && currentUser.username === profile.username;

    const handleFollow = async () => {
        if (!currentUser) return;
        try {
            const { data } = await axios.post(`/api/follow/${profile._id}`, {}, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            setIsFollowing(data.following);
            setFollowerCount(data.followerCount);
        } catch (err) {}
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <BackButton />
            {/* Header / Identity Splash */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel" 
                style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
                {/* Decorative Background Blur */}
                <div style={{
                    position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
                    width: '300px', height: '150px', background: 'var(--accent-gradient)',
                    filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%'
                }}></div>

                {isOwner && (
                    <Link to="/profile/edit" className="btn btn-secondary" style={{ position: 'absolute', top: 20, right: 20, padding: '8px 15px', borderRadius: '30px' }}>
                        <Edit2 size={16} /> Edit Profile
                    </Link>
                )}

                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    border: '4px solid var(--accent-primary)', marginBottom: '20px', zIndex: 1
                }}>
                    {profile.avatar ? (
                        <img src={`http://localhost:5000${profile.avatar}`} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <UserIcon size={50} color="var(--text-secondary)" />
                    )}
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', zIndex: 1 }}>{profile.username}</h1>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '12px', zIndex: 1 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}><strong style={{ color: 'var(--text-primary)' }}>{followerCount}</strong> followers</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}><strong style={{ color: 'var(--text-primary)' }}>{followingCount}</strong> following</span>
                </div>
                {currentUser && !isOwner && (
                    <button onClick={handleFollow} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '20px', border: `1px solid ${isFollowing ? 'var(--glass-border)' : 'var(--accent-primary)'}`, background: isFollowing ? 'transparent' : 'rgba(59,130,246,0.1)', color: isFollowing ? 'var(--text-secondary)' : 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, marginBottom: '16px', transition: 'all 0.2s', zIndex: 1 }}>
                        {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
                
                <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)', marginBottom: '20px', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><UserIcon size={16} /> {profile.gender || 'Prefer not to say'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>

                {profile.bio && (
                    <p style={{ maxWidth: '600px', lineHeight: '1.6', fontSize: '1.1rem', zIndex: 1, marginBottom: '20px' }}>
                        "{profile.bio}"
                    </p>
                )}

                {profile.interests && profile.interests.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
                        {profile.interests.map((interest, i) => (
                            <span key={i} style={{ 
                                background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', 
                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 
                            }}>
                                #{interest}
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Timelines */}
            <div style={{ marginTop: '40px' }}>
                <div style={{ 
                    display: 'flex', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' 
                }}>
                    <button 
                        onClick={() => setActiveTab('posts')}
                        style={{ 
                            background: 'none', border: 'none', padding: '15px 30px', 
                            color: activeTab === 'posts' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'posts' ? 700 : 500, fontSize: '1.1rem', cursor: 'pointer',
                            borderBottom: activeTab === 'posts' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                            transition: 'var(--transition)'
                        }}
                    >
                        Articles ({posts.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('comments')}
                        style={{ 
                            background: 'none', border: 'none', padding: '15px 30px', 
                            color: activeTab === 'comments' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'comments' ? 700 : 500, fontSize: '1.1rem', cursor: 'pointer',
                            borderBottom: activeTab === 'comments' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                            transition: 'var(--transition)'
                        }}
                    >
                        Comments ({comments.length})
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {activeTab === 'posts' && posts.map(post => (
                        <motion.div key={post._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
                                    <Link to={`/post/${post._id}`} style={{ color: 'var(--text-primary)' }}>{post.title}</Link>
                                </h3>
                                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span>💬 {post.comments?.length || 0} Replies</span>
                                </div>
                            </div>
                            <Link to={`/post/${post._id}`} className="btn btn-secondary" style={{ borderRadius: '30px', padding: '8px 20px' }}>Read</Link>
                        </motion.div>
                    ))}
                    {activeTab === 'posts' && posts.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No articles published yet.</p>}

                    {activeTab === 'comments' && comments.map(comment => (
                        <motion.div key={comment._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '20px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
                                Commented on <Link to={`/post/${comment.post._id}`} style={{ fontWeight: 600 }}>{comment.post.title}</Link>
                                <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </p>
                            <p style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>{comment.content}</p>
                        </motion.div>
                    ))}
                    {activeTab === 'comments' && comments.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No comments posted yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
