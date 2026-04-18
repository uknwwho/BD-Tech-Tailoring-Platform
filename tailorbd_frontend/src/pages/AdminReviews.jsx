import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | active | flagged | hidden
    const [actionModal, setActionModal] = useState(null); // { review, action }
    const [adminNote, setAdminNote] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const fetchAllReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/reviews/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reviewId, newStatus, note = '') => {
        try {
            const res = await fetch(`${API_URL}/reviews/admin/${reviewId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, adminNote: note })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Review ${newStatus === 'active' ? 'restored' : newStatus}!`);
                setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, status: newStatus, adminNote: note || r.adminNote } : r));
                setActionModal(null);
                setAdminNote('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update review status");
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Permanently delete this review? This cannot be undone.")) return;
        try {
            const res = await fetch(`${API_URL}/reviews/admin/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Review permanently deleted");
                setReviews(prev => prev.filter(r => r._id !== reviewId));
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-green-50 text-green-600 border-green-200';
            case 'flagged': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'hidden': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

    const stats = {
        all: reviews.length,
        active: reviews.filter(r => r.status === 'active').length,
        flagged: reviews.filter(r => r.status === 'flagged').length,
        hidden: reviews.filter(r => r.status === 'hidden').length
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-gray-400 font-bold">Loading reviews...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Review <span className="text-yellow-500">Moderation</span></h1>
                        <p className="text-gray-500 font-medium">Monitor, flag, and moderate customer reviews across the platform.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total', key: 'all', count: stats.all, icon: '📊', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
                            { label: 'Active', key: 'active', count: stats.active, icon: '✅', color: 'bg-green-50 border-green-100 text-green-600' },
                            { label: 'Flagged', key: 'flagged', count: stats.flagged, icon: '🚩', color: 'bg-orange-50 border-orange-100 text-orange-600' },
                            { label: 'Hidden', key: 'hidden', count: stats.hidden, icon: '🚫', color: 'bg-red-50 border-red-100 text-red-600' }
                        ].map((stat) => (
                            <button
                                key={stat.key}
                                onClick={() => setFilter(stat.key)}
                                className={`p-5 rounded-2xl border text-left transition-all hover:shadow-md ${filter === stat.key ? stat.color + ' shadow-md ring-2 ring-offset-2 ring-gray-200' : 'bg-white border-gray-100'}`}
                            >
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-2xl font-black">{stat.count}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{stat.label}</div>
                            </button>
                        ))}
                    </div>

                    {/* Reviews List */}
                    {filteredReviews.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews found</h3>
                            <p className="text-gray-500 text-sm">No reviews match the selected filter.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Review Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                {/* Status Badge */}
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(review.status)}`}>
                                                    {review.status}
                                                </span>
                                                {/* Stars */}
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <span key={i} className={`text-sm ${i <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-700 leading-relaxed mb-4">"{review.comment}"</p>

                                            <div className="flex flex-wrap gap-4 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                                                        {review.customer?.fullName?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-700">{review.customer?.fullName || 'Unknown'}</span>
                                                        <span className="text-gray-400 ml-1">({review.customer?.email})</span>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">→</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-[10px] font-black">
                                                        {review.tailor?.fullName?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-700">{review.tailor?.fullName || 'Unknown'}</span>
                                                        <span className="text-gray-400 ml-1">(Tailor)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Admin Note */}
                                            {review.adminNote && (
                                                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Admin Note</p>
                                                    <p className="text-sm text-gray-700">{review.adminNote}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex lg:flex-col gap-2 shrink-0">
                                            {review.status !== 'active' && (
                                                <button
                                                    onClick={() => handleStatusChange(review._id, 'active')}
                                                    className="flex-1 lg:flex-none text-xs font-bold bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-100 transition"
                                                >
                                                    ✅ Restore
                                                </button>
                                            )}
                                            {review.status !== 'flagged' && (
                                                <button
                                                    onClick={() => { setActionModal({ review, action: 'flagged' }); setAdminNote(review.adminNote || ''); }}
                                                    className="flex-1 lg:flex-none text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-xl hover:bg-orange-100 transition"
                                                >
                                                    🚩 Flag
                                                </button>
                                            )}
                                            {review.status !== 'hidden' && (
                                                <button
                                                    onClick={() => { setActionModal({ review, action: 'hidden' }); setAdminNote(review.adminNote || ''); }}
                                                    className="flex-1 lg:flex-none text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                                                >
                                                    🚫 Hide
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="flex-1 lg:flex-none text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Moderation Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 mb-2">
                            {actionModal.action === 'flagged' ? '🚩 Flag Review' : '🚫 Hide Review'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {actionModal.action === 'flagged'
                                ? 'Flag this review for further investigation. It will remain visible but marked.'
                                : 'Hide this review from public view. The tailor\'s rating will be recalculated.'
                            }
                        </p>

                        {/* Preview */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className={`text-sm ${i <= actionModal.review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 italic">"{actionModal.review.comment}"</p>
                            <p className="text-xs text-gray-400 mt-2">By {actionModal.review.customer?.fullName}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Moderation Note (optional)</label>
                            <textarea
                                rows={3}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Reason for moderation..."
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setActionModal(null); setAdminNote(''); }}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusChange(actionModal.review._id, actionModal.action, adminNote)}
                                className={`flex-1 py-3 rounded-xl font-bold text-white transition ${actionModal.action === 'flagged' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                {actionModal.action === 'flagged' ? 'Flag Review' : 'Hide Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
