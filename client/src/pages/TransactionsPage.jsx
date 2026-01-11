import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { Upload, FileText, Calendar, DollarSign, Tag, Trash2, Edit2, X, Check, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const TransactionsPage = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Temporary transactions from AI (for review)
    const [tempTransactions, setTempTransactions] = useState([]);
    const [uploadId, setUploadId] = useState(null);
    const [reviewing, setReviewing] = useState(false);

    // Saved/verified transactions
    const [savedTransactions, setSavedTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Editing state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Fetch saved transactions on mount
    useEffect(() => {
        fetchSavedTransactions();
    }, []);

    const fetchSavedTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/finance/transactions/verified', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedTransactions(response.data.transactions || []);
        } catch (error) {
            console.error('Error fetching saved transactions:', error);
            setSavedTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
            } else {
                alert('Please upload a PDF file');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
            } else {
                alert('Please upload a PDF file');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a PDF file first');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('pdf', file);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/finance/uploadPdf',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Get upload_id and fetch temp transactions
            const uploadIdFromResponse = response.data.upload_id;
            setUploadId(uploadIdFromResponse);

            // Fetch temporary transactions from CSV
            const tempResponse = await axios.get(
                `http://localhost:5000/api/finance/transactions/${uploadIdFromResponse}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTempTransactions(tempResponse.data.transactions || []);
            setReviewing(true);
            setFile(null);
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.error || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const startEdit = (transaction) => {
        setEditingId(transaction.id);
        setEditForm({
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = async (transactionId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/finance/transactions/correct`,
                {
                    upload_id: uploadId,
                    transaction_id: transactionId,
                    corrections: editForm
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setTempTransactions(prev =>
                prev.map(t => t.id === transactionId ? { ...t, ...editForm, corrected: true } : t)
            );
            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error('Error saving correction:', error);
            alert('Failed to save correction');
        }
    };

    const finishReview = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/finance/transactions/finalize`,
                { upload_id: uploadId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Clear review state and refresh saved transactions
            setReviewing(false);
            setTempTransactions([]);
            setUploadId(null);
            fetchSavedTransactions();
        } catch (error) {
            console.error('Error finalizing transactions:', error);
            alert('Failed to finalize transactions');
        }
    };

    const handleDeleteSaved = async (transactionId) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/finance/transactions/${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSavedTransactions();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete transaction');
        }
    };

    return (
        <DashboardLayout activePage="transactions">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600 mt-1">
                        Upload bank statements, review AI extractions, and manage verified transactions
                    </p>
                </div>

                {!reviewing ? (
                    <>
                        {/* Upload Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Statement</h2>

                            {/* Drag & Drop Zone */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <Upload size={32} className="text-blue-600" />
                                    </div>

                                    {!file ? (
                                        <>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Drag and drop your PDF here
                                            </h3>
                                            <p className="text-gray-600 mb-4">or</p>
                                            <label
                                                htmlFor="file-upload"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all cursor-pointer font-medium"
                                            >
                                                <FileText size={20} />
                                                Browse Files
                                            </label>
                                            <p className="text-sm text-gray-500 mt-4">
                                                Supported format: PDF (Max 10MB)
                                            </p>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-3 bg-white border border-blue-200 rounded-lg px-4 py-3">
                                                <FileText size={24} className="text-blue-600" />
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setFile(null)}
                                                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {uploading ? 'Processing...' : 'Upload & Extract'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Saved Transactions List */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Verified Transactions</h2>
                                <span className="text-sm text-gray-600">
                                    {savedTransactions.length} {savedTransactions.length === 1 ? 'transaction' : 'transactions'}
                                </span>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading transactions...</p>
                                </div>
                            ) : savedTransactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FileText size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No Previous Transactions
                                    </h3>
                                    <p className="text-gray-600">
                                        Upload a bank statement PDF to get started
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {savedTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="p-3 bg-green-50 rounded-lg">
                                                    <CheckCircle size={20} className="text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {transaction.description || 'Transaction'}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {transaction.date || 'N/A'}
                                                        </span>
                                                        {transaction.category && (
                                                            <span className="text-sm bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                                <Tag size={12} />
                                                                {transaction.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{transaction.amount?.toLocaleString() || '0'}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteSaved(transaction.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Review & Edit Section */
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Review AI-Extracted Transactions</h2>
                                <p className="text-sm text-yellow-700 mt-1 flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    Review and edit any incorrect transactions before saving
                                </p>
                            </div>
                            <button
                                onClick={finishReview}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all font-medium flex items-center gap-2"
                            >
                                <Check size={20} />
                                Finalize & Save
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tempTransactions.map((transaction, index) => (
                                <div
                                    key={transaction.id || index}
                                    className={`p-4 rounded-xl border-2 transition-all ${transaction.corrected
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-yellow-300 bg-yellow-50'
                                        }`}
                                >
                                    {editingId === transaction.id ? (
                                        /* Edit Mode */
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={editForm.description || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Amount"
                                                    value={editForm.amount || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    value={editForm.category || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Date"
                                                    value={editForm.date || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(transaction.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                                >
                                                    <Check size={16} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
                                                >
                                                    <X size={16} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* View Mode */
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`p-3 rounded-lg ${transaction.corrected ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                                    {transaction.corrected ? (
                                                        <CheckCircle size={20} className="text-green-600" />
                                                    ) : (
                                                        <AlertCircle size={20} className="text-yellow-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {transaction.description || 'Transaction'}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {transaction.date || 'N/A'}
                                                        </span>
                                                        {transaction.category && (
                                                            <span className="text-sm bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                                <Tag size={12} />
                                                                {transaction.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{transaction.amount?.toLocaleString() || '0'}
                                                </span>
                                                <button
                                                    onClick={() => startEdit(transaction)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit transaction"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TransactionsPage;
