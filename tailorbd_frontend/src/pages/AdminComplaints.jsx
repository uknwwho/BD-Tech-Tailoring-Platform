import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', type: '' });

    const API_URL = `${import.meta.env.VITE_API_URL}/complaints`;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchComplaints();
    }, [filter]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.status) params.append('status', filter.status);
            if (filter.type) params.append('type', filter.type);

            const res = await fetch(`${API_URL}/all?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setComplaints(data.complaints);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) fetchComplaints();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
            'Resolved': 'bg-green-50 text-green-700 border-green-200'
        };
        return `px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-600'}`;
    };

    const statuses = ['Pending', 'In Review', 'Resolved'];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Review and manage all platform complaints.</p>
                </header>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <select
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    >
                        <option value="">All Types</option>
                        <option value="tailor">Tailor</option>
                        <option value="product">Product</option>
                    </select>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : complaints.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Complaint</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Filed By</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Against</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {complaints.map((c) => (
                                        <tr key={c._id} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{c.title}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">{c.description}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{c.type}</span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{c.createdBy?.fullName || 'Unknown'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {c.targetTailor?.fullName || 'Unknown'}
                                                {c.targetProduct && <span className="text-xs text-gray-400 block">({c.targetProduct.name})</span>}
                                            </td>
                                            <td className="py-4 px-6"><span className={getStatusBadge(c.status)}>{c.status}</span></td>
                                            <td className="py-4 px-6 text-sm text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-6 text-right">
                                                <select
                                                    value={c.status}
                                                    onChange={(e) => updateStatus(c._id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 bg-white"
                                                >
                                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                        <p className="text-gray-500 text-lg font-medium">No complaints found.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminComplaints;
