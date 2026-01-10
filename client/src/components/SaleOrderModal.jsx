import React from 'react';
import './SaleOrderModal.css';

const SaleOrderModal = ({ order, onClose }) => {
    if (!order) return null;

    const orderItems = [
        {
            product: 'Red Shirt',
            quantity: 2,
            unitPrice: 600,
            taxes: '10%',
            amount: 1200
        }
    ];

    const discount = { name: 'Discount 10% on your order', quantity: 1, amount: -120 };
    const untaxedAmount = 1080;
    const taxAmount = 120;
    const total = 1200;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="sale-order-modal-overlay" onClick={onClose}>
            <div className="sale-order-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header-section">
                    <div className="breadcrumb-path">
                        <span className="breadcrumb-slash">/</span>
                        <span className="breadcrumb-item">Sale Orders</span>
                        <span className="breadcrumb-slash">/</span>
                        <span className="breadcrumb-item active">Sale Order S{String(order.id).padStart(4, '0')}</span>
                    </div>
                    <button className="print-btn">Print</button>
                    <button className="close-modal-btn" onClick={onClose}>×</button>
                </div>

                {/* Order Info */}
                <div className="order-info-section">
                    <div className="order-main-info">
                        <h2>Sale Order S{String(order.id).padStart(4, '0')}</h2>
                        <p className="order-date">Order Date: {formatDate(order.order_date)}</p>

                        {/* Invoice Section */}
                        <div className="invoice-section">
                            <h3>Invoice</h3>
                            <div className="invoice-details">
                                <span className="invoice-number">INV/0015</span>
                                <span className="invoice-status paid">Paid</span>
                            </div>
                            <p className="invoice-date">Date: {formatDate(order.order_date)}</p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="address-section">
                        <h3>Address</h3>
                        <p className="customer-name">Raj Sharma</p>
                        <p className="customer-address">401, Tower-3 Infocity,</p>
                        <p className="customer-address">Gandhinagar - 382421</p>
                        <p className="customer-email">raj123@gmail.com</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="products-table-section">
                    <table className="order-products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Taxes</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.unitPrice}</td>
                                    <td>{item.taxes}</td>
                                    <td>₹{item.amount}</td>
                                </tr>
                            ))}
                            <tr className="discount-row">
                                <td>{discount.name}</td>
                                <td>{discount.quantity}</td>
                                <td>-₹{Math.abs(discount.amount / discount.quantity)}</td>
                                <td></td>
                                <td>-₹{Math.abs(discount.amount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Payment Terms & Totals */}
                <div className="bottom-section">
                    <div className="payment-terms">
                        <h3>Payment terms</h3>
                        <p>Immediate Payment</p>
                    </div>

                    <div className="order-totals">
                        <div className="total-row">
                            <span>Untaxed Amount</span>
                            <span>₹{untaxedAmount}</span>
                        </div>
                        <div className="total-row">
                            <span>Tax 10%</span>
                            <span>₹{taxAmount}</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleOrderModal;
