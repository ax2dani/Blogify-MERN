import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('Prefer not to say');
    const [interests, setInterests] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`/api/profiles/${user.username}`);
                setBio(data.user.bio || '');
                setGender(data.user.gender || 'Prefer not to say');
                setInterests((data.user.interests || []).join(', '));
                setCurrentAvatar(data.user.avatar);
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, [user, navigate]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('gender', gender);
        formData.append('interests', interests);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const config = { 
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}` 
                } 
            };
            await axios.put('/api/profiles/me', formData, config);
            navigate(`/profile/${user.username}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update profile');
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container" 
            style={{ maxWidth: '800px', padding: '40px 20px' }}
        >
            <BackButton />
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Edit Your Identity</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                            border: '2px solid var(--accent-primary)'
                        }}>
                            {avatarFile ? (
                                <img src={URL.createObjectURL(avatarFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : currentAvatar ? (
                                <img src={`http://localhost:5000${currentAvatar}`} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>
                                    {user?.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="form-label">Profile Avatar</label>
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="form-control"
                                accept="image/jpeg,image/png,image/webp"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Biography</label>
                        <textarea 
                            className="form-control" 
                            rows="4" 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            placeholder="Tell the community about yourself..."
                            maxLength={500}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Gender Identity</label>
                            <select 
                                className="form-control"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option>Prefer not to say</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Interests (comma separated)</label>
                            <input 
                                type="text"
                                className="form-control" 
                                value={interests} 
                                onChange={(e) => setInterests(e.target.value)} 
                                placeholder="Tech, Coding, Hiking..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button type="button" onClick={() => navigate(`/profile/${user.username}`)} className="btn btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                            {loading ? 'Saving Identity...' : 'Save Profile Dashboard'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default EditProfile;
