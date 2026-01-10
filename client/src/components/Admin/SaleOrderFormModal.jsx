import React, { useState } from 'react';
import './SaleOrderFormModal.css';

const SaleOrderFormModal = ({ isOpen, onClose }) => {
    const [orderData, setOrderData] = useState({
        soNumber: 'SO001',
        customerName: '',
        paymentTerm: 'Immediate Payment',
        soDate: new Date().toISOString().split('T')[0],
        status: 'New',
        products: [
            { id: 1, product: 'Red Shirt', qty: 2, unitPrice: 600, tax: 10 }
        ],
        couponCode: ''
    });

    const [showDiscount, setShowDiscount] = useState(false);

    if (!isOpen) return null;

    const calculateProductTotal = (product) => {
        const untaxedAmount = product.qty * product.unitPrice;
        const taxAmount = (untaxedAmount * product.tax) / 100;
        return untaxedAmount + taxAmount;
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalTax = 0;

        orderData.products.forEach(product => {
            const untaxedAmount = product.qty * product.unitPrice;
            const taxAmount = (untaxedAmount * product.tax) / 100;
            subtotal += untaxedAmount;
            totalTax += taxAmount;
        });

        let discount = 0;
        if (showDiscount) {
            discount = subtotal * 0.1; // 10% discount
        }

        return {
            subtotal,
            discount,
            totalTax: totalTax - (totalTax * (discount / subtotal)),
            total: subtotal + totalTax - discount
        };
    };

    const totals = calculateTotals();

    const addProduct = () => {
        setOrderData({
            ...orderData,
            products: [...orderData.products, { id: Date.now(), product: '', qty: 1, unitPrice: 0, tax: 0 }]
        });
    };

    const handleConfirm = () => {
        setOrderData({ ...orderData, status: 'Confirm' });
    };

    const handleCreateInvoice = () => {
        alert('Invoice created successfully!');
    };

    const applyCoupon = () => {
        if (orderData.couponCode) {
            setShowDiscount(true);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="sale-order-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="sale-order-btn">Sale Order</button>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {/* Status and Basic Info */}
                    <div className="order-info-section">
                        <div className="status-badge">{orderData.status}</div>
                        <p className="auto-generate-note">( auto generate SO Number + 1 of last order )</p>

                        {orderData.status === 'Confirm' && (
                            <p className="confirm-note">Only display in confirm state</p>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="form-grid">
                        <div className="form-field">
                            <label>SO Number</label>
                            <input
                                type="text"
                                value={orderData.soNumber}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="form-field">
                            <label>Payment Term</label>
                            <input
                                type="text"
                                value={orderData.paymentTerm}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="form-field">
                            <label>Customer Name</label>
                            <select
                                className="input-field"
                                value={orderData.customerName}
                                onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })}
                            >
                                <option value="">Select Customer</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                            </select>
                            <p className="field-note">(from Contact & users- Many to one)</p>
                        </div>

                        <div className="form-field">
                            <label>SO Date</label>
                            <input
                                type="date"
                                value={orderData.soDate}
                                onChange={(e) => setOrderData({ ...orderData, soDate: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="btn btn-confirm" onClick={handleConfirm}>Confirm</button>
                        <button className="btn btn-secondary">Print</button>
                        <button className="btn btn-secondary">Send</button>
                        <button className="btn btn-cancel">Cancel</button>
                        <button className="btn btn-invoice" onClick={handleCreateInvoice}>Create Invoice</button>
                        <button className="btn btn-draft">
                            <span className="invoice-icon">Invoice</span>
                            <span className="draft-badge">Draft</span>
                        </button>
                    </div>

                    {/* Products Table */}
                    <div className="products-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Untaxed Amount</th>
                                    <th>Tax</th>
                                    <th>Tax Amount</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.products.map((product, index) => {
                                    const untaxedAmount = product.qty * product.unitPrice;
                                    const taxAmount = (untaxedAmount * product.tax) / 100;
                                    return (
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={product.product}
                                                    className="table-input"
                                                    placeholder="Select product"
                                                />
                                            </td>
                                            <td><input type="number" value={product.qty} className="table-input-small" /></td>
                                            <td><input type="number" value={product.unitPrice} className="table-input-small" /></td>
                                            <td>{untaxedAmount}</td>
                                            <td>{product.tax}%</td>
                                            <td>{taxAmount.toFixed(2)}</td>
                                            <td>{calculateProductTotal(product).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}

                                {showDiscount && (
                                    <tr className="discount-row">
                                        <td>2</td>
                                        <td>Discount 10% on your order</td>
                                        <td>1</td>
                                        <td>-60</td>
                                        <td>-120</td>
                                        <td></td>
                                        <td></td>
                                        <td>-120</td>
                                    </tr>
                                )}

                                <tr className="total-row">
                                    <td colSpan="4" className="text-right"><strong>Total</strong></td>
                                    <td><strong>{totals.subtotal.toFixed(2)}</strong></td>
                                    <td colSpan="2"></td>
                                    <td><strong>{totals.total.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="products-note">Products from products table (many2one)</p>

                    {/* Coupon Code */}
                    <div className="coupon-section">
                        <input
                            type="text"
                            placeholder="Coupon Code"
                            value={orderData.couponCode}
                            onChange={(e) => setOrderData({ ...orderData, couponCode: e.target.value })}
                            className="coupon-input"
                        />
                        <button className="btn btn-apply" onClick={applyCoupon}>Apply</button>
                    </div>

                    <p className="coupon-note">after applying this line will be added in sale order</p>

                    <p className="invoice-note">
                        Button will be displayed after an invoice is created from the sales order,
                        and clicking it will redirect to the linked invoice.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SaleOrderFormModal;
