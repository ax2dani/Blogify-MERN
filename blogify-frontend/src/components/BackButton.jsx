import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate(-1)}
            style={{ 
                marginBottom: '25px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', 
                gap: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', 
                color: 'var(--text-secondary)', borderRadius: '20px', cursor: 'pointer', transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
            <ArrowLeft size={18} />
            Back
        </button>
    );
};

export default BackButton;
