import React, { useState, useEffect } from 'react';
// Make sure this path matches your sidebar component!
import AdminSidebar from '../components/AdminSidebar';

const AdminDelivery = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    // Form state for creating a delivery
    const [formData, setFormData] = useState({
        orderId: '',
        customerName: '',
        customerEmail: '',
        deliveryAddress: '',
        deliveryPartner: 'Pathao',
        trackingNumber: '',
        estimatedDeliveryDate: ''
    });

    // UPDATED TO MATCH BACKEND: /delivery
    const API_URL = `${import.meta.env.VITE_API_URL}/delivery`;

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/all`);
            const data = await res.json();
            if (data.success) setDeliveries(data.deliveries);
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDelivery = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setShowCreateModal(false);
                fetchDeliveries(); // Refresh the table
                setFormData({ orderId: '', customerName: '', deliveryAddress: '', deliveryPartner: 'Pathao', trackingNumber: '', estimatedDeliveryDate: '' });
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error creating delivery:", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/status/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) fetchDeliveries();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this delivery record?")) return;
        try {
            const res = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchDeliveries();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
            'Picked Up': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200',
            'Delivered': 'bg-green-50 text-green-700 border-green-200',
            'Failed': 'bg-red-50 text-red-700 border-red-200'
        };
        return `px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-700'}`;
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Assign partners and track parcels.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 shadow-md transition"
                    >
                        + Assign New Delivery
                    </button>
                </header>

                {loading ? (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse text-center text-gray-500">Loading deliveries...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Order Info</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Partner</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {deliveries.map((d) => (
                                        <tr key={d._id} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-900">{d.customerName}</div>
                                                <div className="text-xs text-gray-500">Order: {d.orderId}</div>
                                                <div className="text-xs text-gray-400 mt-1">{d.deliveryAddress}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-medium text-gray-700">{d.deliveryPartner || 'Unassigned'}</span>
                                                <div className="text-xs text-indigo-500">{d.trackingNumber}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={getStatusBadge(d.status)}>{d.status}</span>
                                                {/* QUICK STATUS UPDATER */}
                                                <select
                                                    className="block w-full mt-2 text-xs border-gray-300 rounded p-1 outline-none focus:border-indigo-500 bg-white"
                                                    value={d.status}
                                                    onChange={(e) => handleStatusChange(d._id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Assigned">Assigned</option>
                                                    <option value="Picked Up">Picked Up</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Failed">Failed</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-3">
                                                <button
                                                    onClick={() => { setSelectedDelivery(d); setShowHistoryModal(true); }}
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                                                >
                                                    Log
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(d._id)}
                                                    className="text-xs font-bold text-red-500 hover:text-red-700 underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {deliveries.length === 0 && (
                                        <tr><td colSpan="4" className="py-10 text-center text-gray-500">No deliveries found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE DELIVERY MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Assign New Delivery</h2>
                        <form onSubmit={handleCreateDelivery} className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-600">Order ID</label><input type="text" required value={formData.orderId} onChange={e => setFormData({ ...formData, orderId: e.target.value })} className="w-full border p-2 rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-600">Customer Name</label><input type="text" required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="w-full border p-2 rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-600">Address</label><input type="text" required value={formData.deliveryAddress} onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })} className="w-full border p-2 rounded" /></div>
                            <div>
                                <label className="text-xs font-bold text-gray-600">Partner</label>
                                <select value={formData.deliveryPartner} onChange={e => setFormData({ ...formData, deliveryPartner: e.target.value })} className="w-full border p-2 rounded bg-white">
                                    <option value="Pathao">Pathao</option>
                                    <option value="Steadfast">Steadfast</option>
                                    <option value="RedX">RedX</option>
                                    <option value="Internal Staff">Internal Staff</option>
                                </select>
                            </div>
                            <div><label className="text-xs font-bold text-gray-600">Tracking # (Optional)</label><input type="text" value={formData.trackingNumber} onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })} className="w-full border p-2 rounded" /></div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Assign Delivery</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* HISTORY LOG MODAL */}
            {showHistoryModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Tracking Log</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                            {selectedDelivery.historyLog?.map((log, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-1 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{log.status}</p>
                                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {(!selectedDelivery.historyLog || selectedDelivery.historyLog.length === 0) && <p className="text-sm text-gray-500">No logs recorded yet.</p>}
                        </div>
                        <button onClick={() => setShowHistoryModal(false)} className="mt-6 w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDelivery;