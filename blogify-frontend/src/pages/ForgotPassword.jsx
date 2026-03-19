import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { data } = await axios.post('/api/auth/forgotpassword', { email });
            setMessage({ type: 'success', text: data.message });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send email' });
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
                    Forgot Password
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Enter your email address and we will securely dispatch a reset link to your inbox.
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
                        <label className="form-label">Account Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="hello@blogify.com"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Dispatching...' : 'Send Reset Link'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Return to Login</a>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ForgotPassword;
