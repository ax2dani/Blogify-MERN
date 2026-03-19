import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, PenTool, UserPlus, LogIn, Sun, Moon, Compass, Bookmark, Bell, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetchNavStats = async () => {
            try {
                const { data } = await axios.get('/api/notifications', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (err) {
                console.error("Failed to load nav stats", err);
            }
        };
        fetchNavStats();

        // Listen for global notification clicks to sync the badge instantly
        window.addEventListener('notification_read', fetchNavStats);
        return () => window.removeEventListener('notification_read', fetchNavStats);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ 
            background: 'var(--glass-bg)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                height: '70px'
            }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Blogify
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button 
                        onClick={toggleTheme} 
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--text-primary)', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.8,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.8}
                    >
                        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                    </button>

                    {user ? (
                        <>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderRight: '1px solid var(--glass-border)', paddingRight: '20px' }}>
                                <Link to="/feed" title="Explore" style={{ color: 'var(--text-primary)', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                    <Compass size={22} />
                                </Link>
                                <Link to="/bookmarks" title="Bookmarks" style={{ color: 'var(--text-primary)', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                    <Bookmark size={22} />
                                </Link>
                                <Link to="/notifications" title="Notifications" style={{ color: 'var(--text-primary)', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex', position: 'relative' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                    <Bell size={22} />
                                    {unreadCount > 0 && (
                                        <span style={{ 
                                            position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', 
                                            color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' 
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Link to={`/profile/${user.username}`} title="Profile" style={{ color: 'var(--text-primary)', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                    <UserIcon size={22} />
                                </Link>
                            </div>

                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                <PenTool size={16} /> New Post
                            </Link>
                            
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} title="Logout">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/feed" style={{ color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                Explore
                            </Link>
                            <Link to="/login" className="btn btn-secondary">
                                <LogIn size={18} /> Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                <UserPlus size={18} /> Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
