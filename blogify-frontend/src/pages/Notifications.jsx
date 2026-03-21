import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Heart, MessageCircle, CheckCircle2, UserPlus, UserCheck } from 'lucide-react';
import BackButton from '../components/BackButton';

const Notifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingList, setFollowingList] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchNotifications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/notifications', config);
                setNotifications(data);
                
                // Fetch current user's profile to get following list
                const { data: profileData } = await axios.get(`/api/profiles/${user.username}`);
                setFollowingList(profileData.user.following || []);
            } catch (err) {
                console.error("Failed to fetch notifications or profile");
            }
            setLoading(false);
        };
        fetchNotifications();
    }, [user, navigate]);

    const handleRead = async (id, postId, type) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Mark as read in background
            axios.put(`/api/notifications/${id}/read`, {}, config);
            
            // Dispatch event to sync Navbar unread count instantly
            window.dispatchEvent(new Event('notification_read'));
            
            // Navigate immediately if it's a post interaction
            if (postId && (type === 'LIKE' || type === 'COMMENT')) {
                navigate(`/post/${postId}`);
            }
        } catch (err) {
            console.error("Failed to mark read");
        }
    };

    const handleFollowBack = async (e, targetUserId) => {
        e.stopPropagation(); // Prevent triggering handleRead's navigation
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/follow/${targetUserId}`, {}, config);
            
            if (data.following) {
                setFollowingList(prev => [...prev, targetUserId]);
            } else {
                setFollowingList(prev => prev.filter(id => id !== targetUserId));
            }
        } catch (err) {
            console.error("Failed to toggle follow");
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading Alerts...</div>;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="container" style={{ maxWidth: '700px', padding: '40px 20px' }}
        >
            <BackButton />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                        <Bell size={28} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Notifications</h1>
                </div>
                {unreadCount > 0 && (
                    <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
                        {unreadCount} Unread
                    </span>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <Bell size={48} color="var(--text-secondary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>You're all caught up!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>When someone interacts with your posts, you'll see alerts here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {notifications.map((notif) => (
                        <div 
                            key={notif._id} 
                            onClick={() => handleRead(notif._id, notif.post?._id, notif.type)}
                            className="glass-panel card-hover" 
                            style={{ 
                                padding: '20px', display: 'flex', gap: '15px', alignItems: 'center',
                                cursor: 'pointer', borderLeft: notif.isRead ? 'none' : '4px solid var(--accent-primary)',
                                background: notif.isRead ? 'var(--glass-bg)' : 'rgba(59, 130, 246, 0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                                <div style={{ paddingTop: '2px' }}>
                                    {notif.type === 'LIKE' && <Heart size={24} color="#ef4444" fill="#ef4444" />}
                                    {notif.type === 'COMMENT' && <MessageCircle size={24} color="var(--accent-primary)" fill="var(--accent-primary)" />}
                                    {notif.type === 'FOLLOW' && <UserPlus size={24} color="var(--accent-secondary)" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '5px', lineHeight: '1.4' }}>
                                        <span 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${notif.sender.username}`); }}
                                            style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
                                        >
                                            {notif.sender.username}
                                        </span> 
                                        {notif.type === 'LIKE' && ' loved your post '}
                                        {notif.type === 'COMMENT' && ' commented on your post '}
                                        {notif.type === 'FOLLOW' && ' started following you'}
                                        {(notif.type === 'LIKE' || notif.type === 'COMMENT') && (
                                            <span style={{ fontWeight: 600, fontStyle: 'italic' }}> "{notif.post?.title || 'Deleted Post'}"</span>
                                        )}
                                    </p>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {notif.type === 'FOLLOW' && (
                                    <button
                                        onClick={(e) => handleFollowBack(e, notif.sender._id)}
                                        className="btn btn-secondary"
                                        style={{ 
                                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: followingList.includes(notif.sender._id) ? 'transparent' : 'var(--accent-primary)',
                                            color: followingList.includes(notif.sender._id) ? 'var(--text-primary)' : 'white',
                                            border: followingList.includes(notif.sender._id) ? '1px solid var(--glass-border)' : 'none'
                                        }}
                                    >
                                        {followingList.includes(notif.sender._id) ? (
                                            <><UserCheck size={14} /> Following</>
                                        ) : (
                                            <><UserPlus size={14} /> Follow Back</>
                                        )}
                                    </button>
                                )}
                                {notif.isRead && <CheckCircle2 size={18} color="var(--success)" style={{ opacity: 0.5 }} />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Notifications;
