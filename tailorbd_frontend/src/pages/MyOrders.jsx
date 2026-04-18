import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderReviews, setOrderReviews] = useState({}); // { orderId: review }

    // Review modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null); // order being reviewed
    const [editingReview, setEditingReview] = useState(null); // existing review being edited
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/mine`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
                // Fetch reviews for delivered orders
                data.orders.forEach(order => {
                    if (order.status === 'Delivered') {
                        fetchReviewForOrder(order._id);
                    }
                });
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewForOrder = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/reviews/order/${orderId}`);
            const data = await res.json();
            if (data.success && data.review) {
                setOrderReviews(prev => ({ ...prev, [orderId]: data.review }));
            }
        } catch (error) {
            // silently fail
        }
    };

    // Open review modal for writing new or editing existing
    const openReviewModal = (order, existingReview = null) => {
        setReviewTarget(order);
        if (existingReview) {
            setEditingReview(existingReview);
            setReviewForm({ rating: existingReview.rating, comment: existingReview.comment });
        } else {
            setEditingReview(null);
            setReviewForm({ rating: 0, comment: '' });
        }
        setHoverRating(0);
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewTarget(null);
        setEditingReview(null);
        setReviewForm({ rating: 0, comment: '' });
        setHoverRating(0);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setSubmitting(true);
        try {
            const url = editingReview
                ? `${API_URL}/reviews/${editingReview._id}`
                : `${API_URL}/reviews`;
            const method = editingReview ? 'PUT' : 'POST';

            const body = editingReview
                ? { rating: reviewForm.rating, comment: reviewForm.comment }
                : { orderId: reviewTarget._id, rating: reviewForm.rating, comment: reviewForm.comment };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(editingReview ? "Review updated!" : "Review submitted!");
                setOrderReviews(prev => ({ ...prev, [reviewTarget._id]: data.review }));
                closeReviewModal();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId, orderId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Review deleted");
                setOrderReviews(prev => {
                    const updated = { ...prev };
                    delete updated[orderId];
                    return updated;
                });
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'Accepted': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const renderStars = (rating, interactive = false) => {
        const stars = [];
        const displayRating = interactive ? (hoverRating || reviewForm.rating) : rating;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-2xl transition-all duration-150 ${i <= displayRating ? 'text-yellow-400 scale-110' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:scale-125' : ''}`}
                    onClick={interactive ? () => setReviewForm({ ...reviewForm, rating: i }) : undefined}
                    onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
                    onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                >
                    ★
                </span>
            );
        }
        return <div className="flex items-center gap-0.5">{stars}</div>;
    };

    if (loading) return <div className="py-20 text-center animate-pulse font-bold text-gray-400">Loading your orders...</div>;

    return (
        <div className="py-10 min-h-screen">
            <h1 className="text-4xl font-black text-gray-900 mb-10">My <span className="text-indigo-600">Orders</span></h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm">
                    <div className="text-5xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const review = orderReviews[order._id];
                        return (
                            <div key={order._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                        <h3 className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Items</p>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 font-medium">{item.name} <span className="text-gray-400 ml-1">x{item.quantity}</span></span>
                                                <span className="font-bold text-gray-900">৳{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-4 flex justify-between items-end">
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Grand Total</div>
                                            <div className="text-2xl font-black text-indigo-600">৳{order.totalAmount}</div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Tailor & Delivery</p>
                                        <div className="space-y-3">
                                            <p className="text-sm"><strong>Tailor:</strong> {order.tailor?.fullName}</p>
                                            <p className="text-sm"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500 italic">Deliver to: {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Section — only for delivered orders */}
                                {order.status === 'Delivered' && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        {review ? (
                                            /* Show existing review */
                                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-5 border border-yellow-100">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black text-yellow-600 uppercase tracking-widest">Your Review</span>
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openReviewModal(order, review)}
                                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(review._id, order._id)}
                                                            className="text-xs font-bold text-red-500 hover:text-red-700 bg-white px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 font-medium leading-relaxed">"{review.comment}"</p>
                                                <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ) : (
                                            /* Show "Write Review" button */
                                            <button
                                                onClick={() => openReviewModal(order)}
                                                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 font-bold py-3 px-8 rounded-2xl hover:from-yellow-500 hover:to-amber-500 transition-all shadow-lg shadow-yellow-100 flex items-center gap-2 justify-center"
                                            >
                                                ⭐ Write a Review
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">
                                {editingReview ? 'Edit Your Review' : 'Write a Review'}
                            </h3>
                            <button onClick={closeReviewModal} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">✕</button>
                        </div>

                        {/* Order reference */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order</p>
                            <p className="text-sm font-bold text-gray-900">#{reviewTarget?._id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 mt-1">Tailor: {reviewTarget?.tailor?.fullName}</p>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            {/* Star Rating */}
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 mb-3">How would you rate this experience?</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`text-4xl transition-all duration-200 hover:scale-125 ${star <= (hoverRating || reviewForm.rating) ? 'text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-300'}`}
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-medium">
                                    {reviewForm.rating === 1 && 'Poor'}
                                    {reviewForm.rating === 2 && 'Fair'}
                                    {reviewForm.rating === 3 && 'Good'}
                                    {reviewForm.rating === 4 && 'Very Good'}
                                    {reviewForm.rating === 5 && 'Excellent!'}
                                    {reviewForm.rating === 0 && 'Tap a star to rate'}
                                </p>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    placeholder="Share your experience with the tailoring quality, communication, delivery..."
                                    className="w-full border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || reviewForm.rating === 0}
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {submitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
