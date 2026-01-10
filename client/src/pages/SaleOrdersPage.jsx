import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SaleOrderModal from '../Components/SaleOrderModal';
import './SaleOrdersPage.css';

const SaleOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Mock data if API fails
            setOrders([
                { id: 1, order_date: '2025-12-12', total_amount: 1200, status: 'Delivered' },
                { id: 2, order_date: '2025-12-13', total_amount: 5060, status: 'Shipped' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="sale-orders-page">
            <div className="orders-container">
                <div className="breadcrumb-nav">
                    <span className="breadcrumb-slash">/</span>
                    <span className="breadcrumb-text">Sale Orders</span>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Orders Yet</h3>
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Sale Order</th>
                                    <th>Order Date</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                                        <td className="order-id">S{String(order.id).padStart(4, '0')}</td>
                                        <td>{formatDate(order.order_date)}</td>
                                        <td className="order-total">₹{order.total_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedOrder && (
                    <SaleOrderModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default SaleOrdersPage;
