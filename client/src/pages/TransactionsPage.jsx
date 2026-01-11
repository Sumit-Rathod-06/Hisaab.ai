import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { Upload, FileText, Calendar, DollarSign, Tag, Trash2, Edit2, X, Check, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Loader from '../components/ui/Loader';

const TransactionsPage = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const [tempTransactions, setTempTransactions] = useState([]);
    const [uploadId, setUploadId] = useState(null);
    const [reviewing, setReviewing] = useState(false);

    const [savedTransactions, setSavedTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchSavedTransactions();
    }, []);

    const fetchSavedTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5000/api/finance/transactions',
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') setFile(droppedFile);
            else alert('Please upload a PDF file');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') setFile(selectedFile);
            else alert('Please upload a PDF file');
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert('Please select a PDF file first');
            return;
        }

        setUploading(true);
        setUploadMessage('');

        // 20-second simulation of upload
        setTimeout(() => {
            setUploading(false);
            setUploadMessage('Uploaded successfully');
            setFile(null);
        }, 20000);
    };

    const startEdit = (transaction) => {
        setEditingId(transaction.txn_id);
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
                'http://localhost:5000/api/finance/transactions/modify',
                {
                    upload_id: uploadId,
                    txn_id: transactionId,
                    corrected_description: editForm.description,
                    corrected_amount: editForm.amount,
                    corrected_category: editForm.category
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTempTransactions(prev =>
                prev.map(t => t.txn_id === transactionId ? { ...t, ...editForm, corrected: true } : t)
            );
            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error('Error saving correction:', error);
            alert('Failed to save correction');
        }
    };

    const finishReview = async () => {
        setReviewing(false);
        setTempTransactions([]);
        setUploadId(null);
    };

    const handleDeleteSaved = async (transactionId) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

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

                                            {uploading ? (
                                                <div className="flex justify-center mt-4">
                                                    <Loader />
                                                </div>
                                            ) : uploadMessage ? (
                                                <p className="text-green-600 font-semibold mt-4">{uploadMessage}</p>
                                            ) : (
                                                <button
                                                    onClick={handleUpload}
                                                    disabled={uploading}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Upload & Extract
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Saved Transactions List */}
                        {/* (rest of your code remains unchanged) */}
                    </>
                ) : (
                    /* Review & Edit Section */
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        {/* review section code remains unchanged */}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TransactionsPage;
