import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';

const TailorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchTailorOrders();
    }, []);

    const fetchTailorOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/tailor`, {
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

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/orders/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Order marked as ${newStatus}`);
                fetchTailorOrders();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusBtnStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500 text-white';
            case 'Accepted': return 'bg-blue-500 text-white';
            case 'Processing': return 'bg-indigo-600 text-white';
            case 'Delivered': return 'bg-green-600 text-white';
            case 'Cancelled': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900">Manage <span className="text-indigo-600">Orders</span></h1>
                    <p className="text-sm text-gray-500 mt-1">Track and process your incoming customer orders</p>
                </header>

                {loading ? (
                    <div className="p-10 text-center animate-pulse bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                        <p className="text-gray-400 font-bold">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-bold">No orders received yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-5">Order ID</th>
                                    <th className="px-6 py-5">Customer</th>
                                    <th className="px-6 py-5">Items</th>
                                    <th className="px-6 py-5">Amount</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-gray-900 text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-gray-900">{order.customer?.fullName}</p>
                                            <p className="text-xs text-gray-400 font-mono">{order.customer?.phone}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs text-gray-600 truncate max-w-[150px] font-medium">
                                                {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 font-black text-indigo-600">৳{order.totalAmount}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm ${getStatusBtnStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold outline-none focus:border-indigo-600 shadow-sm transition-all"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Accepted">Accept</option>
                                                <option value="Processing">In Processing</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancel</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TailorOrders;
