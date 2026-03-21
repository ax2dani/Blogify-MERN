import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, PenTool, Users, Globe, Zap, BookOpen, Heart, Bell, Bookmark, UserCheck, MessageCircle, Search } from 'lucide-react';
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
                        🌟 Welcome to Blogify v5.0
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
                        A free platform for writers and readers to share stories, exchange ideas, and grow together. No noise — just great content.
                    </motion.p>
                    
                    <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
                            {user ? 'Write a Post' : "Start Writing — It's Free"} <ArrowRight size={20} />
                        </Link>
                        <Link to="/feed" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
                            Browse Articles
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* What You Can Do Section */}
            <section style={{ padding: '100px 20px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>What you can do on Blogify</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to write, share, and connect — all in one place.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        <FeatureCard 
                            icon={<PenTool size={30} color="var(--accent-primary)" />}
                            title="Write & Publish"
                            description="Create beautiful blog posts with cover images and tags. Your article goes live instantly for the world to read."
                        />
                        <FeatureCard 
                            icon={<MessageCircle size={30} color="#eab308" />}
                            title="Engage & Discuss"
                            description="Like posts, drop comments, and have live conversations. Comments appear in real-time — no refresh needed."
                        />
                        <FeatureCard 
                            icon={<Search size={30} color="var(--accent-secondary)" />}
                            title="Discover & Explore"
                            description="Search articles by keywords, filter by tags, and discover content from writers across the community."
                        />
                        <FeatureCard 
                            icon={<UserCheck size={30} color="#10b981" />}
                            title="Build Your Identity"
                            description="Create your own profile with a bio, interests, and profile picture. Build a public timeline of everything you write."
                        />
                        <FeatureCard 
                            icon={<Bookmark size={30} color="#f97316" />}
                            title="Bookmark & Read Later"
                            description="Found something interesting but short on time? Save any article to your personal reading list and come back when you're ready."
                        />
                        <FeatureCard 
                            icon={<Bell size={30} color="#ec4899" />}
                            title="Stay Notified"
                            description="Get instant alerts when someone likes your post or leaves a comment. Never miss a conversation about your work."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section style={{ padding: '100px 20px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Get started in 3 steps</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>From sign-up to your first published article — it takes less than 2 minutes.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <StepCard 
                            number="01" 
                            title="Create Your Account" 
                            description="Sign up with a username and password. Your profile is live instantly — add a photo, bio, and interests later."
                        />
                        <StepCard 
                            number="02" 
                            title="Write Your First Post" 
                            description="Hit 'New Post' in the navbar, write your article, add tags and a cover image, then publish it to the feed."
                        />
                        <StepCard 
                            number="03" 
                            title="Engage With the Community" 
                            description="Explore articles, leave comments, like what inspires you, and bookmark posts to read later. You'll get notified when people interact with your content."
                        />
                    </div>
                </div>
            </section>

            {/* Extra Features Banner */}
            <section style={{ padding: '80px 20px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Plus, all of this built in</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
                        <MiniFeature icon={<Bookmark size={22} />} label="Save for Later" />
                        <MiniFeature icon={<Bell size={22} />} label="Smart Notifications" />
                        <MiniFeature icon={<Globe size={22} />} label="Public Profiles" />
                        <MiniFeature icon={<Zap size={22} />} label="Dark & Light Mode" />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '120px 20px', textAlign: 'center' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ maxWidth: '700px', margin: '0 auto' }}
                >
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '20px', lineHeight: '1.2' }}>
                        Ready to share your story?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.6' }}>
                        Join our growing community of writers and readers. It's completely free — no credit card, no trial, no catch.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.15rem', borderRadius: '30px' }}>
                            {user ? 'Write a New Post' : 'Create Free Account'} <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '30px 20px', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    © {new Date().getFullYear()} Blogify. Anirudh Adoni.
                </p>
            </footer>
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

const StepCard = ({ number, title, description }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ 
            display: 'flex', gap: '25px', alignItems: 'flex-start',
            padding: '30px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)'
        }}
    >
        <div style={{ 
            minWidth: '50px', height: '50px', borderRadius: '50%', 
            background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '800', fontSize: '1.1rem', flexShrink: 0
        }}>
            {number}
        </div>
        <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem' }}>{description}</p>
        </div>
    </motion.div>
);

const MiniFeature = ({ icon, label }) => (
    <div style={{ 
        padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        color: 'var(--text-secondary)'
    }}>
        <div style={{ color: 'var(--accent-primary)' }}>{icon}</div>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</span>
    </div>
);

export default Landing;
