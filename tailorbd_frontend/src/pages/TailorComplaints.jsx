import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const TailorComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL}/complaints`;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/tailor`, {
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

    const getStatusBadge = (status) => {
        const styles = {
            'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
            'Resolved': 'bg-green-50 text-green-700 border-green-200'
        };
        return `px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-600'}`;
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
                    <p className="text-sm text-gray-500 mt-1">View complaints filed against you or your products.</p>
                </header>

                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : complaints.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Title</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Filed By</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {complaints.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{c.title}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{c.description}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm capitalize text-gray-600">{c.type}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{c.createdBy?.fullName || 'Unknown'}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{c.targetProduct?.name || '—'}</td>
                                        <td className="py-4 px-6"><span className={getStatusBadge(c.status)}>{c.status}</span></td>
                                        <td className="py-4 px-6 text-sm text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                        <p className="text-gray-500 text-lg font-medium">No complaints filed against you. 🎉</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TailorComplaints;
