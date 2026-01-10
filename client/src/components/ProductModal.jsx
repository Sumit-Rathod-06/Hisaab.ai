import React, { useState } from 'react';
import axios from 'axios';
import './ProductModal.css';

const ProductModal = ({ product, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const images = [product.image, product.image, product.image]; // Mock multiple images

    const handleQuantityChange = (delta) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Please login to add items to cart');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/customers/cart/add',
                {
                    productId: product.id,
                    quantity: quantity,
                    color: product.colors[selectedColor],
                    price: product.price,
                    product_name: product.name,
                    image: product.image
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                // Store product info in localStorage for cart display
                const cartMeta = JSON.parse(localStorage.getItem('cartMeta') || '{}');
                cartMeta[product.id] = {
                    name: product.name,
                    image: product.image
                };
                localStorage.setItem('cartMeta', JSON.stringify(cartMeta));

                alert('Product added to cart successfully!');
                onClose();
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            if (error.response?.status === 401) {
                alert('Please login to add items to cart');
            } else {
                alert('Failed to add product to cart. Please try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="modal-header" style={{ color: 'white' }}>
                    <div className="breadcrumb">
                        <span>All Products</span>
                        <span className="separator">/</span>
                        <span>{product.category}</span>
                        <span className="separator">/</span>
                        <span className="active">{product.name}</span>
                    </div>
                </div>

                <div className="modal-body">
                    {/* Left: Image Gallery */}
                    <div className="image-gallery">
                        <div className="thumbnail-list">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <div className="main-image">
                            <img src={images[selectedImage]} alt={product.name} />
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="product-details">
                        <h2 className="product-title">{product.name}</h2>

                        <div className="price-section">
                            <span className="price">${product.price}</span>
                            <span className="badge">Rusty Raven</span>
                        </div>

                        <div className="color-selector">
                            <h4>Color</h4>
                            <div className="color-options">
                                {product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className={`color-option ${selectedColor === index ? 'active' : ''}`}
                                        style={{ background: color }}
                                        onClick={() => setSelectedColor(index)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="quantity-section">
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(-1)}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="quantity-input"
                            />
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(1)}
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="add-to-cart-modal-btn"
                            onClick={handleAddToCart}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding...' : 'Add to Cart'}
                        </button>

                        <div className="terms-section">
                            <h4>Terms and Conditions</h4>
                            <p>30-day money-back guarantee</p>
                            <p>Shipping: 2-3 Business Days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
