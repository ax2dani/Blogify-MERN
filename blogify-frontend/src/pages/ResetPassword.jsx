import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { resettoken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        
        if (password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match!' });
        }
        if (password.length < 6) {
            return setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
        }

        setLoading(true);
        try {
            const { data } = await axios.put(`/api/auth/resetpassword/${resettoken}`, { password });
            setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reset password. The token may be expired.' });
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="container" 
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
        >
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Setup New Password
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Please enter your new secure password below to regain access to your account.
                </p>

                {message && (
                    <div style={{ 
                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                        color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', 
                        padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' 
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Securing Account...' : 'Reset Password'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Return to Login</Link>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPassword;
