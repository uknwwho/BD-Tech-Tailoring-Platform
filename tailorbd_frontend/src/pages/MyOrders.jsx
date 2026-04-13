import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
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
                    {orders.map((order) => (
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
