import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error("Failed to load global orders");
        } finally {
            setLoading(false);
        }
    };

    const updatePayment = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/orders/payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderId, paymentStatus: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Payment marked as ${newStatus}`);
                fetchAllOrders();
            }
        } catch (error) {
            toast.error("Failed to update payment");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900">All Platform <span className="text-indigo-600">Orders</span></h1>
                    <p className="text-sm text-gray-500 mt-1">Global oversight of all transactions between customers and tailors</p>
                </header>

                {loading ? (
                    <div className="p-10 text-center animate-pulse bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                        <p className="text-gray-400 font-bold">Loading global orders...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-5">Order ID</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Tailor</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-gray-900 text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-6 py-5 font-bold text-gray-900">{order.customer?.fullName}</td>
                                    <td className="px-6 py-5 font-bold text-gray-700">{order.tailor?.fullName}</td>
                                    <td className="px-6 py-5 font-black text-indigo-600">৳{order.totalAmount}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-600 shadow-sm border border-gray-200`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <select 
                                            value={order.paymentStatus}
                                            onChange={(e) => updatePayment(order._id, e.target.value)}
                                            className={`p-2 rounded-xl text-[10px] font-black uppercase outline-none border transition-all shadow-sm ${order.paymentStatus === 'Paid' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
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

export default AdminOrders;
