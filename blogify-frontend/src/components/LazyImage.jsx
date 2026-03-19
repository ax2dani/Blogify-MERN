import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, style, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={imgRef}
            className={`lazy-img-container ${className || ''}`}
            style={{ 
                ...style, 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {isVisible && (
                <img 
                    src={src} 
                    alt={alt} 
                    onLoad={() => setIsLoaded(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
            )}
            {!isLoaded && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite linear'
                }}>
                    <style>{`
                        @keyframes shimmer {
                            0% { background-position: -200% 0; }
                            100% { background-position: 200% 0; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default LazyImage;
