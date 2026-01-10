import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    name: 'Raj Sharma',
    email: 'raj.sharma@example.com',
    phone: '+91 98765 43210',
    address: '123 MG Road, Koramangala, Bangalore, Karnataka - 560034'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });

  const orders = [
    { id: 'ORD001', date: '2025-12-15', items: 3, total: 2499, status: 'Delivered' },
    { id: 'ORD002', date: '2025-12-10', items: 1, total: 1299, status: 'Shipped' },
    { id: 'ORD003', date: '2025-12-05', items: 2, total: 1899, status: 'Processing' }
  ];

  const invoices = [
    { id: 'INV001', orderId: 'ORD001', date: '2025-12-15', amount: 2499 },
    { id: 'INV002', orderId: 'ORD002', date: '2025-12-10', amount: 1299 },
    { id: 'INV003', orderId: 'ORD003', date: '2025-12-05', amount: 1899 }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...userProfile });
  };

  const handleSave = () => {
    setUserProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...userProfile });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const renderProfile = () => (
    <div className="profile-section">
      <h2>User Profile</h2>
      {!isEditing ? (
        <div className="profile-display">
          <div className="profile-field">
            <label>Name:</label>
            <span>{userProfile.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{userProfile.email}</span>
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <span>{userProfile.phone}</span>
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <span>{userProfile.address}</span>
          </div>
          <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
        </div>
      ) : (
        <div className="profile-edit">
          <div className="edit-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={editedProfile.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label>Address:</label>
            <textarea
              name="address"
              value={editedProfile.address}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">#{order.id}</span>
              <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="order-details">
              <p><strong>Date:</strong> {order.date}</p>
              <p><strong>Items:</strong> {order.items}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
            </div>
            <button className="view-order-btn" onClick={() => navigate('/sale-orders')}>View All Orders</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="invoices-section">
      <h2>Your Invoices</h2>
      <div className="invoices-list">
        {invoices.map(invoice => (
          <div key={invoice.id} className="invoice-card">
            <div className="invoice-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="invoice-details">
              <h3>{invoice.id}</h3>
              <p><strong>Order:</strong> {invoice.orderId}</p>
              <p><strong>Date:</strong> {invoice.date}</p>
              <p><strong>Amount:</strong> ₹{invoice.amount}</p>
            </div>
            <button className="download-btn">Download</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="customer-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <h1 className="dashboard-title">My Account</h1>

          <button
            className={`sidebar-btn ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            User Profile
          </button>

          <button
            className={`sidebar-btn ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => {
              if (orders.length > 0) {
                navigate('/sale-orders');
              } else {
                setActiveSection('orders');
              }
            }}
          >
            Your Orders
          </button>

          <button
            className={`sidebar-btn ${activeSection === 'invoices' ? 'active' : ''}`}
            onClick={() => {
              if (invoices.length > 0) {
                navigate('/invoices');
              } else {
                setActiveSection('invoices');
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Your Invoices
          </button>
        </div>

        <div className="dashboard-main">
          <div className="user-info-card">
            <h3>User Details</h3>
            <div className="user-info">
              <p><strong>User Name:</strong> {userProfile.name}</p>
              <p><strong>Address:</strong> {userProfile.address}</p>
              <p><strong>Phone number:</strong> {userProfile.phone}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
            </div>
          </div>

          <div className="dashboard-content">
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'orders' && renderOrders()}
            {activeSection === 'invoices' && renderInvoices()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
