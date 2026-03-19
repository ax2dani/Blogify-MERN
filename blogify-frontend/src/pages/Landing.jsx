import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, PenTool, Users, Globe, Zap } from 'lucide-react';
import { useEffect } from 'react';

const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section style={{ 
                minHeight: '80vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                textAlign: 'center', 
                padding: '0 20px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 60%)',
                    opacity: 0.05, filter: 'blur(100px)', zIndex: -1, borderRadius: '50%'
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw',
                    background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 60%)',
                    opacity: 0.05, filter: 'blur(80px)', zIndex: -1, borderRadius: '50%'
                }}></div>

                <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <motion.div variants={fadeInUp} style={{ 
                        display: 'inline-flex', alignItems: 'center', padding: '8px 20px', background: 'rgba(59, 130, 246, 0.1)', 
                        border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '30px', 
                        color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '35px', marginTop: '40px', fontSize: '0.95rem'
                    }}>
                        🌟 Welcome to Blogify v4.0
                    </motion.div>
                    
                    <motion.h1 variants={fadeInUp} style={{ 
                        fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: '800', 
                        lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em', textAlign: 'center' 
                    }}>
                        Write the Moment.<br />
                        <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Share the Connection.
                        </span>
                    </motion.h1>
                    
                    <motion.p variants={fadeInUp} style={{ 
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-secondary)', 
                        marginBottom: '40px', maxWidth: '700px', textAlign: 'center', lineHeight: '1.6' 
                    }}>
                        Join thousands of writers and readers building the future of digital storytelling. Fast, secure, and beautiful.
                    </motion.p>
                    
                    <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
                            {user ? 'Go to Dashboard' : 'Start Writing Free'} <ArrowRight size={20} />
                        </Link>
                        <Link to="/feed" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
                            Explore Feed
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '100px 20px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Everything you need to succeed</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>We stripped away the clutter and kept exactly what matters.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        <FeatureCard 
                            icon={<PenTool size={30} color="var(--accent-primary)" />}
                            title="Rich Text Engine"
                            description="Format your thoughts flawlessly with our integrated HTML-native WYSIWYG editor."
                        />
                        <FeatureCard 
                            icon={<Zap size={30} color="#eab308" />}
                            title="Lightning Fast"
                            description="Powered by React 19 and Vite. Your readers will never wait for a page load again."
                        />
                        <FeatureCard 
                            icon={<Users size={30} color="var(--accent-secondary)" />}
                            title="Interactive Networking"
                            description="Like, comment, and engage in real-time. Comments stream instantly via WebSockets."
                        />
                        <FeatureCard 
                            icon={<Globe size={30} color="#10b981" />}
                            title="Global Scale"
                            description="Robust Mongoose architecture ensures your data is indexed, secure, and infinitely scalable."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="glass-panel"
        style={{ padding: '40px 30px', textAlign: 'left', borderRadius: 'var(--radius-lg)' }}
    >
        <div style={{ 
            background: 'var(--bg-secondary)', width: '60px', height: '60px', 
            borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
    </motion.div>
);

export default Landing;
