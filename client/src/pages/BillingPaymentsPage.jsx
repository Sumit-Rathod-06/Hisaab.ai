import React, { useState } from 'react';
import Navbar from '../Components/Admin/Navbar';
import SaleOrderFormModal from '../Components/Admin/SaleOrderFormModal';
import CustomerInvoiceModal from '../Components/Admin/CustomerInvoiceModal';
import './BillingPaymentsPage.css';

const BillingPaymentsPage = () => {
    const [isSaleOrderModalOpen, setIsSaleOrderModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    return (
        <div className="billing-payments-page">
            <Navbar />

            <div className="billing-content">
                {/* Header Info */}
                <div className="page-header">
                    <div className="info-banner">
                        <div className="info-icon">ℹ️</div>
                        <div className="info-content">
                            <p>When a customer makes a payment on the portal, a sales order will be created.</p>
                            <p>If automatic invoicing is enabled, an invoice will also be generated along with the sales order.</p>
                        </div>
                    </div>
                </div>

                {/* Sales Section */}
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">📊</span>
                            Sales
                        </h2>
                        <div className="auto-invoice-badge">
                            <span className="badge-icon">⚡</span>
                            Automatic Invoicing
                        </div>
                    </div>

                    <div className="bento-grid">
                        <div className="stat-card sale-orders" onClick={() => setIsSaleOrderModalOpen(true)}>
                            <div className="card-header">
                                <h3>Sale Orders</h3>
                                <div className="card-icon-large">📋</div>
                            </div>
                            <div className="card-body">
                                <div className="stat-row">
                                    <span className="stat-label">Total orders this month</span>
                                    <span className="stat-number large">159</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-row highlight">
                                    <span className="stat-label">Pending to invoice</span>
                                    <span className="stat-number warning">10</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className="view-details">View Details →</span>
                            </div>
                        </div>

                        <div className="stat-card invoices" onClick={() => setIsInvoiceModalOpen(true)}>
                            <div className="card-header">
                                <h3>Customer Invoices</h3>
                                <div className="card-icon-large">📄</div>
                            </div>
                            <div className="card-body">
                                <div className="stat-row">
                                    <span className="stat-label">Unpaid invoices</span>
                                    <span className="stat-number alert">89</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-row highlight">
                                    <span className="stat-label">Overdue</span>
                                    <span className="stat-number danger">12</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className="view-details">View Details →</span>
                            </div>
                        </div>

                        <div className="stat-card payments">
                            <div className="card-header">
                                <h3>Customer Payments</h3>
                                <div className="card-icon-large">💳</div>
                            </div>
                            <div className="card-body empty-state">
                                <div className="empty-illustration">
                                    <div className="pulse-circle"></div>
                                    <span className="empty-icon">💰</span>
                                </div>
                                <p className="empty-text">No payments recorded</p>
                                <p className="empty-subtext">Recent transactions will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Section */}
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">🛒</span>
                            Purchase
                        </h2>
                    </div>

                    <div className="bento-grid">
                        <div className="stat-card purchase-orders">
                            <div className="card-header">
                                <h3>Purchase Orders</h3>
                                <div className="card-icon-large">📦</div>
                            </div>
                            <div className="card-body">
                                <div className="stat-row">
                                    <span className="stat-label">Total orders this month</span>
                                    <span className="stat-number large">159</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-row highlight">
                                    <span className="stat-label">Pending to bill</span>
                                    <span className="stat-number warning">10</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className="view-details">View Details →</span>
                            </div>
                        </div>

                        <div className="stat-card vendor-bills">
                            <div className="card-header">
                                <h3>Vendor Bills</h3>
                                <div className="card-icon-large">📃</div>
                            </div>
                            <div className="card-body">
                                <div className="stat-row">
                                    <span className="stat-label">Unpaid bills</span>
                                    <span className="stat-number alert">59</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-row highlight">
                                    <span className="stat-label">Overdue</span>
                                    <span className="stat-number danger">7</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className="view-details">View Details →</span>
                            </div>
                        </div>

                        <div className="stat-card vendor-payments">
                            <div className="card-header">
                                <h3>Vendor Payments</h3>
                                <div className="card-icon-large">💸</div>
                            </div>
                            <div className="card-body empty-state">
                                <div className="empty-illustration">
                                    <div className="pulse-circle"></div>
                                    <span className="empty-icon">💵</span>
                                </div>
                                <p className="empty-text">No payments recorded</p>
                                <p className="empty-subtext">Recent transactions will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SaleOrderFormModal
                isOpen={isSaleOrderModalOpen}
                onClose={() => setIsSaleOrderModalOpen(false)}
            />

            <CustomerInvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
            />
        </div>
    );
};

export default BillingPaymentsPage;
