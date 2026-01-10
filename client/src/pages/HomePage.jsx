import { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const clothingImages = [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % clothingImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="homepage">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover Your
                        <span className="gradient-text"> Perfect Style</span>
                    </h1>
                    <p className="hero-subtitle">
                        Premium clothing collection for every occasion. Shop the latest trends in fashion.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary">Shop Now</button>
                        <button className="btn-secondary">Explore Collections</button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Products</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Customers</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Quality</div>
                        </div>
                    </div>
                </div>

                <div className="carousel-container">
                    <div className="carousel">
                        {clothingImages.map((img, index) => (
                            <div
                                key={index}
                                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                                style={{
                                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                                }}
                            >
                                <img src={img} alt={`Clothing ${index + 1}`} />
                                <div className="slide-overlay"></div>
                            </div>
                        ))}
                    </div>
                    <div className="carousel-indicators">
                        {clothingImages.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
