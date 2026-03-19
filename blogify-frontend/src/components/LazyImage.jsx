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
                <div className="shimmer-bg"></div>
            )}
        </div>
    );
};

export default LazyImage;
