import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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

                <div style={{ display: 'flex', gap: '15px' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn btn-secondary">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn btn-danger">
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
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
