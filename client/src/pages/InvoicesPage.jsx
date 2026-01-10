import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InvoiceModal from '../Components/InvoiceModal';
import './InvoicesPage.css';

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInvoices(response.data.invoices || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            // Mock data if API fails
            setInvoices([
                {
                    id: 12,
                    order_id: 1,
                    invoice_date: '2025-12-08',
                    due_date: '2025-12-25',
                    total_amount: 1000,
                    status: 'Waiting for payment'
                },
                {
                    id: 15,
                    order_id: 2,
                    invoice_date: '2025-12-12',
                    due_date: '2025-12-12',
                    total_amount: 0,
                    status: 'Paid'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const getStatusClass = (status) => {
        return status?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    };

    return (
        <div className="invoices-page">
            <div className="invoices-container">
                <div className="breadcrumb-nav">
                    <span className="breadcrumb-slash">/</span>
                    <span className="breadcrumb-text">Invoices</span>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading invoices...</p>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Invoices Yet</h3>
                        <p>You don't have any invoices yet.</p>
                    </div>
                ) : (
                    <div className="invoices-table-wrapper">
                        <table className="invoices-table">
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
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} onClick={() => setSelectedInvoice(invoice)} style={{ cursor: 'pointer' }}>
                                        <td className="invoice-id">INV/{String(invoice.id).padStart(4, '0')}</td>
                                        <td>{formatDate(invoice.invoice_date)}</td>
                                        <td>{formatDate(invoice.due_date)}</td>
                                        <td className="invoice-amount">₹{invoice.total_amount}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedInvoice && (
                    <InvoiceModal
                        invoice={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default InvoicesPage;
