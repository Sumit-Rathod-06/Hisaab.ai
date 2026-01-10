import React, { useState } from 'react';
import './InvoicePaymentModal.css';

const InvoicePaymentModal = ({ isOpen, onClose, invoiceData }) => {
    const [paymentData, setPaymentData] = useState({
        paymentRef: 'Pay/25/0002',
        status: 'New',
        paymentType: 'Send',
        date: new Date().toISOString().split('T')[0],
        partnerType: 'Customer',
        partner: '',
        note: invoiceData?.invoiceNumber || 'Default invoice or bill number',
        amount: invoiceData?.amountDue || 600,
        hasEarlyDiscount: false,
        earlyDiscountAmount: 15.52
    });

    if (!isOpen) return null;

    const handleConfirm = () => {
        alert('Payment confirmed successfully!');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="invoice-payment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="invoice-payment-btn">Invoice Payment</button>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {/* Status Section */}
                    <div className="payment-info-section">
                        <div className="status-badge-row">
                            <div className="status-badge">{paymentData.status}</div>
                            <span className="payment-ref">{paymentData.paymentRef}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="btn btn-confirm" onClick={handleConfirm}>Confirm</button>
                        <button className="btn btn-secondary">Print</button>
                        <button className="btn btn-secondary">Send</button>
                        <button className="btn btn-cancel">Cancel</button>
                    </div>

                    {/* Early Payment Discount Message */}
                    {paymentData.hasEarlyDiscount && (
                        <div className="discount-message">
                            <p className="discount-text">
                                Early Payment Discount of {paymentData.earlyDiscountAmount} has been applied.
                            </p>
                            <p className="discount-note">
                                This message depends on payment terms<br />
                                If early payment discount is applied on payment terms then message will be display
                            </p>
                        </div>
                    )}

                    {/* Payment Form */}
                    <div className="payment-form">
                        <div className="form-row">
                            <div className="form-field">
                                <label>Payment Type</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value="Send"
                                            checked={paymentData.paymentType === 'Send'}
                                            onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}
                                        />
                                        <span>Send</span>
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value="Receive"
                                            checked={paymentData.paymentType === 'Receive'}
                                            onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}
                                        />
                                        <span>Receive</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={paymentData.date}
                                    onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                                    className="input-field"
                                />
                                <p className="field-note">(Default Today Date)</p>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Partner Type</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="partnerType"
                                            value="Customer"
                                            checked={paymentData.partnerType === 'Customer'}
                                            onChange={(e) => setPaymentData({ ...paymentData, partnerType: e.target.value })}
                                        />
                                        <span>Customer</span>
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="partnerType"
                                            value="Vendor"
                                            checked={paymentData.partnerType === 'Vendor'}
                                            onChange={(e) => setPaymentData({ ...paymentData, partnerType: e.target.value })}
                                        />
                                        <span>Vendor</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Note</label>
                                <input
                                    type="text"
                                    value={paymentData.note}
                                    onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                                    className="input-field"
                                    placeholder="Default invoice or bill number"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Partner</label>
                                <input
                                    type="text"
                                    value={paymentData.partner}
                                    onChange={(e) => setPaymentData({ ...paymentData, partner: e.target.value })}
                                    className="input-field"
                                    placeholder="Partner name"
                                />
                                <p className="field-note">( auto fill partner name from Invoice/Bill)</p>
                            </div>

                            <div className="form-field">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                                    className="input-field"
                                />
                                <p className="field-note">( auto fill amount due from Invoice/Bill)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePaymentModal;
