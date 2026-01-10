import React, { useState } from 'react';
import InvoicePaymentModal from './InvoicePaymentModal';
import './CustomerInvoiceModal.css';

const CustomerInvoiceModal = ({ isOpen, onClose }) => {
    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: 'INV/0001',
        customerName: '',
        paymentTerm: '15 Days',
        reference: 'SO001',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'New',
        products: [
            { id: 1, product: 'Red Shirt', qty: 2, unitPrice: 600, tax: 10 }
        ],
        paidOn: '12/12/2025',
        amountPaid: 600,
        isPaid: false
    });

    const [showDiscount, setShowDiscount] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    if (!isOpen) return null;

    const calculateProductTotal = (product) => {
        const untaxedAmount = product.qty * product.unitPrice;
        const taxAmount = (untaxedAmount * product.tax) / 100;
        return untaxedAmount + taxAmount;
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalTax = 0;

        invoiceData.products.forEach(product => {
            const untaxedAmount = product.qty * product.unitPrice;
            const taxAmount = (untaxedAmount * product.tax) / 100;
            subtotal += untaxedAmount;
            totalTax += taxAmount;
        });

        let discount = 0;
        if (showDiscount) {
            discount = 120; // Fixed 120 discount from wireframe
        }

        const total = subtotal + totalTax - discount;
        const amountDue = total - invoiceData.amountPaid;

        return {
            subtotal,
            discount,
            totalTax,
            total,
            amountDue
        };
    };

    const totals = calculateTotals();

    const handleConfirm = () => {
        setInvoiceData({ ...invoiceData, status: 'Confirm' });
    };

    const handlePay = () => {
        setIsPaymentModalOpen(true);
    };

    const handleViewOrder = () => {
        alert('Redirecting to Sale Order: ' + invoiceData.reference);
    };

    const handleViewPayment = () => {
        alert('Redirecting to Payment details');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="customer-invoice-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="customer-invoice-btn">Customer Invoice</button>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {/* Status and Basic Info */}
                    <div className="invoice-info-section">
                        <div className="status-badge-row">
                            <div className="status-badge">{invoiceData.status}</div>
                            <span className="sale-order-ref">Sale Order Number</span>
                        </div>
                        <p className="auto-generate-note">( auto generate Invoice Number + 1 of last Invoice No. )</p>

                        {!invoiceData.isPaid && (
                            <p className="pay-button-note">The Pay button will be displayed until the invoice is fully paid.</p>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="form-grid">
                        <div className="form-field">
                            <label>Invoice Number</label>
                            <input
                                type="text"
                                value={invoiceData.invoiceNumber}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="form-field">
                            <label>Payment Term</label>
                            <input
                                type="text"
                                value={invoiceData.paymentTerm}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="form-field">
                            <label>Customer Name</label>
                            <select
                                className="input-field"
                                value={invoiceData.customerName}
                                onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                            >
                                <option value="">Select Customer</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                            </select>
                            <p className="field-note">(from Contact & users- Many to one)</p>
                        </div>

                        <div className="form-field">
                            <label>Reference</label>
                            <input
                                type="text"
                                value={invoiceData.reference}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="form-field">
                            <label>Invoice Date</label>
                            <input
                                type="date"
                                value={invoiceData.invoiceDate}
                                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                                className="input-field"
                            />
                            <p className="field-note">Date</p>
                        </div>

                        <div className="form-field">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={invoiceData.dueDate}
                                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                className="input-field"
                            />
                            <p className="field-note">Date</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="btn btn-confirm" onClick={handleConfirm}>Confirm</button>
                        <button className="btn btn-secondary">Print</button>
                        <button className="btn btn-secondary">Send</button>
                        <button className="btn btn-cancel">Cancel</button>
                        {!invoiceData.isPaid && (
                            <button className="btn btn-pay" onClick={handlePay}>Pay</button>
                        )}
                        <button className="btn btn-order" onClick={handleViewOrder}>Order</button>
                        <button className="btn btn-payment" onClick={handleViewPayment}>Payment</button>
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
                                {invoiceData.products.map((product, index) => {
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
                                                    readOnly
                                                />
                                            </td>
                                            <td>{product.qty}</td>
                                            <td>{product.unitPrice}</td>
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
                                    <td><strong>{totals.subtotal - totals.discount}</strong></td>
                                    <td colSpan="2"></td>
                                    <td><strong>{totals.total.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Details */}
                    <div className="payment-details">
                        <div className="payment-row">
                            <span className="payment-label">Paid On {invoiceData.paidOn}</span>
                            <span className="payment-value">{invoiceData.amountPaid}</span>
                        </div>
                        <div className="payment-row amount-due">
                            <span className="payment-label">Amount Due</span>
                            <span className="payment-value">{totals.amountDue.toFixed(2)}</span>
                        </div>
                    </div>

                    <p className="invoice-note">
                        If Invoice is linked to any sale order then this button will be visible
                        and on click of it redirect to that sale order (same for payment button)
                    </p>
                </div>

                {/* Invoice Payment Modal */}
                <InvoicePaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    invoiceData={{
                        invoiceNumber: invoiceData.invoiceNumber,
                        amountDue: totals.amountDue,
                        customerName: invoiceData.customerName
                    }}
                />
            </div>
        </div>
    );
};

export default CustomerInvoiceModal;
