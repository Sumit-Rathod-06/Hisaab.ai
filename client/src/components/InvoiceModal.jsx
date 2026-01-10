import React from 'react';
import './InvoiceModal.css';

const InvoiceModal = ({ invoice, onClose }) => {
    if (!invoice) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="invoice-modal-overlay" onClick={onClose}>
            <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header-section">
                    <div className="breadcrumb-path">
                        <span className="breadcrumb-slash">/</span>
                        <span className="breadcrumb-item">Invoices</span>
                    </div>
                    <button className="close-modal-btn" onClick={onClose}>×</button>
                </div>

                {/* Invoice Table */}
                <div className="invoice-list-section">
                    <table className="invoice-details-table">
                        <thead>
                            <tr>
                                <th>Sale Order</th>
                                <th>Invoice Date</th>
                                <th>Due Date</th>
                                <th>Amount Due</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="invoice-id">INV/{String(invoice.id).padStart(4, '0')}</td>
                                <td>{formatDate(invoice.invoice_date)}</td>
                                <td>{formatDate(invoice.due_date || invoice.invoice_date)}</td>
                                <td className="invoice-amount">₹{invoice.total_amount}</td>
                                <td>
                                    <span className={`status-badge ${invoice.status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                                        {invoice.status || 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
