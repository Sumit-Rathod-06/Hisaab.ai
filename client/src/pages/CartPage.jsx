import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';

const CartPage = () => {
    const [activeTab, setActiveTab] = useState('order');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountMessage, setDiscountMessage] = useState('');

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            label: 'HOME',
            name: 'Raj Sharma',
            street: '123 MG Road, Koramangala',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560034',
            phone: '+91 98765 43210'
        },
        {
            id: 2,
            label: 'WORK',
            name: 'Raj Sharma',
            street: '45 Tech Park, Whitefield',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560066',
            phone: '+91 98765 43210'
        }
    ]);

    const [selectedAddress, setSelectedAddress] = useState(1);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: '',
        name: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    /* ===========================
       FETCH CART
    ============================ */
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                setCartItems([]);
                setLoading(false);
                return;
            }

            console.log('Fetching cart...');
            const res = await axios.get(
                'http://localhost:5000/api/customers/cart',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Cart response:', res.data);
            const cartProducts = res.data?.products || [];
            console.log('Cart products:', cartProducts);

            // Get product metadata from localStorage
            const cartMeta = JSON.parse(localStorage.getItem('cartMeta') || '{}');
            console.log('Cart metadata:', cartMeta);

            // Map cart items using metadata
            const mappedItems = cartProducts.map(item => {
                const meta = cartMeta[item.productId] || {};
                return {
                    id: item.productId,
                    name: meta.name || 'Product',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    image: meta.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
                    tax: item.tax || 0,
                    color: item.color || ''
                };
            });

            console.log('Mapped cart items:', mappedItems);
            setCartItems(mappedItems);
        } catch (err) {
            console.error('Cart fetch error:', err);
            alert('Failed to load cart: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ===========================
       CART ACTIONS
    ============================ */
    const updateQuantity = (id, change) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/customers/cart/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCartItems();
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    /* ===========================
       DISCOUNT
    ============================ */
    const applyDiscount = () => {
        if (!discountCode.trim()) return;
        setAppliedDiscount({ code: discountCode, amount: 120 });
        setDiscountMessage(`Coupon ${discountCode} applied`);
        setDiscountCode('');
    };

    const removeDiscount = () => {
        setAppliedDiscount(null);
        setDiscountMessage('');
    };

    /* ===========================
       CHECKOUT
    ============================ */
    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || cartItems.length === 0) {
                alert('Please login and add items to cart');
                return;
            }

            const address = addresses.find(a => a.id === selectedAddress);
            if (!address) {
                alert('Please select a delivery address');
                setActiveTab('address');
                return;
            }

            const checkoutData = {
                delivery_address: {
                    name: address.name,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    phone: address.phone
                }
            };

            // Add coupon if applied
            if (appliedDiscount && appliedDiscount.code) {
                checkoutData.couponCode = appliedDiscount.code;
            }

            console.log('Checkout data:', checkoutData);

            const response = await axios.post(
                'http://localhost:5000/api/customers/checkout',
                checkoutData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(`Order placed successfully! Order #${response.data.order?.order_number || 'N/A'}`);
            setCartItems([]);
            removeDiscount();
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Checkout failed: ' + (err.response?.data?.message || err.message));
        }
    };

    /* ===========================
       CALCULATIONS
    ============================ */
    const subtotal = cartItems.reduce(
        (s, i) => s + i.price * i.quantity,
        0
    );
    const discount = appliedDiscount ? appliedDiscount.amount : 0;
    const afterDiscount = subtotal - discount;
    const taxes = Math.round(afterDiscount * 0.12);
    const total = afterDiscount + taxes;

    /* ===========================
       RENDER TABS
    ============================ */
    const renderOrderTab = () => (
        <div className="cart-content">
            {loading ? (
                <div className="loading-state" style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
                    <div className="spinner"></div>
                    <p>Loading your cart...</p>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="empty-cart" style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                </div>
            ) : (
                <>
                    <div className="cart-items-section">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">₹{item.price}</p>
                                    {item.color && <p className="item-color">Color: {item.color}</p>}
                                </div>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                            </div>
                        ))}

                        {appliedDiscount && (
                            <div className="discount-item">
                                <div className="discount-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                                <div className="discount-details">
                                    <h3>Discount Applied</h3>
                                    <p className="discount-code">Code: {appliedDiscount.code}</p>
                                </div>
                                <div className="discount-amount">-₹{discount}</div>
                                <button className="remove-btn" onClick={removeDiscount}>Remove</button>
                            </div>
                        )}
                    </div>

                    <div className="order-summary">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        {discount > 0 && (
                            <div className="summary-row discount-row">
                                <span>Discount</span>
                                <span>-₹{discount}</span>
                            </div>
                        )}
                        <div className="summary-row">
                            <span>Taxes (12%)</span>
                            <span>₹{taxes}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <div className="discount-code-input">
                            <input
                                type="text"
                                placeholder="Discount Code..."
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button onClick={applyDiscount}>Apply</button>
                        </div>

                        {discountMessage && (
                            <div className="discount-success-message">
                                {discountMessage}
                            </div>
                        )}

                        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );

    const renderAddressTab = () => (
        <div className="cart-content">
            <div className="address-section">
                <h2>Select Delivery Address</h2>
                {addresses.map(address => (
                    <div key={address.id} className={`address-card ${selectedAddress === address.id ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                        />
                        <div className="address-details">
                            <span className="address-label">{address.label}</span>
                            <p className="address-name">{address.name}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                            <p className="address-phone">Phone: {address.phone}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPaymentTab = () => (
        <div className="cart-content">
            <div className="payment-section">
                <h2>Payment Method</h2>
                <p style={{ color: '#999' }}>Payment integration coming soon...</p>
            </div>
        </div>
    );

    /* ===========================
       MAIN JSX
    ============================ */
    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-tabs">
                    <button
                        className={`tab ${activeTab === 'order' ? 'active' : ''}`}
                        onClick={() => setActiveTab('order')}
                    >
                        Order
                    </button>
                    <button
                        className={`tab ${activeTab === 'address' ? 'active' : ''}`}
                        onClick={() => setActiveTab('address')}
                    >
                        Address
                    </button>
                    <button
                        className={`tab ${activeTab === 'payment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payment')}
                    >
                        Payment
                    </button>
                </div>

                {activeTab === 'order' && renderOrderTab()}
                {activeTab === 'address' && renderAddressTab()}
                {activeTab === 'payment' && renderPaymentTab()}
            </div>
        </div>
    );
};

export default CartPage;
