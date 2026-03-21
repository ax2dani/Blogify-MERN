import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, PenTool, UserPlus, LogIn, Sun, Moon, Compass, Bookmark, Bell, User as UserIcon, Search, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/feed?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    return (
        <>
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
                                <button onClick={() => setShowSearch(!showSearch)} title="Search" style={{ color: 'var(--text-primary)', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                    <Search size={22} />
                                </button>
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
                            <button onClick={() => setShowSearch(!showSearch)} title="Search" style={{ color: 'var(--text-primary)', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, alignItems: 'center', gap: '5px' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                <Search size={18} /> Search
                            </button>
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

            {/* Search Dropdown */}
            {showSearch && (
                <div style={{
                    position: 'fixed', top: '70px', left: 0, right: 0,
                    background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)',
                    padding: '16px 0', zIndex: 99, animation: 'slideUp 0.2s ease-out',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                }}>
                    <div className="container" style={{ maxWidth: '600px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search articles by keywords or topics..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px' }}>Search</button>
                        </form>
                        <button onClick={() => setShowSearch(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '8px' }}>
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div 
                    onClick={() => setShowLogoutModal(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 999, animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)', padding: '40px', maxWidth: '400px', width: '90%',
                            textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                    >
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 20px',
                            background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <LogOut size={28} color="var(--danger)" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Log Out?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>
                            Are you sure you want to sign out of your account?
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => setShowLogoutModal(false)} 
                                className="btn btn-secondary" 
                                style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmLogout} 
                                className="btn" 
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
