import React, { useState, useEffect } from 'react';

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL}/complaints`;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchMyComplaints();
    }, []);

    const fetchMyComplaints = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/mine`, {
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

    if (loading) {
        return (
            <div className="py-10 min-h-screen">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Complaints</h1>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">My Complaints</h1>
                <p className="text-gray-500">Track the status of your submitted complaints.</p>
            </div>

            {complaints.length > 0 ? (
                <div className="space-y-4">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{complaint.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                            {complaint.type} complaint
                                        </span>
                                        {complaint.targetTailor && (
                                            <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                                vs. {complaint.targetTailor.fullName}
                                            </span>
                                        )}
                                        {complaint.targetProduct && (
                                            <span className="text-xs font-medium bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                                                Product: {complaint.targetProduct.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={getStatusBadge(complaint.status)}>{complaint.status}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                            <p className="text-xs text-gray-400">Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-100">
                    <p className="text-gray-500 text-lg font-medium mb-2">No complaints yet.</p>
                    <p className="text-gray-400 text-sm">Your submitted complaints will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default MyComplaints;
