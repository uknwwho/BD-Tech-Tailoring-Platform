import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const TailorDashboard = () => {
    const [stats, setStats] = useState({ products: 0, complaints: 0 });
    const [recentProducts, setRecentProducts] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const prodRes = await fetch(`${API_URL}/products/my/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const prodData = await prodRes.json();
            if (prodData.success) {
                setRecentProducts(prodData.products.slice(0, 5));
            }

            const compRes = await fetch(`${API_URL}/complaints/tailor`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const compData = await compRes.json();

            setStats({
                products: prodData.success ? prodData.products.length : 0,
                complaints: compData.success ? compData.complaints.length : 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tailor Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Overview of your tailoring workstation.</p>
                    </div>
                    <Link
                        to="/TailorShopConfig"
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 shadow-md transition flex items-center gap-2"
                    >
                        ⚙️ My Shop Config
                    </Link>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">My Products</h3>
                        <p className="text-4xl font-black text-indigo-600">{stats.products}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Complaints</h3>
                        <p className="text-4xl font-black text-red-500">{stats.complaints}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Status</h3>
                        <p className="text-lg font-bold text-green-600">✅ Active</p>
                    </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Recent Products</h2>
                    </div>
                    {recentProducts.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentProducts.map((p) => (
                                <div key={p._id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {p.images && p.images.length > 0 ? (
                                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">{p.name}</h4>
                                        <p className="text-xs text-gray-500">{p.category}</p>
                                    </div>
                                    <p className="font-bold text-indigo-600 shrink-0">৳{p.price}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">No products yet.</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TailorDashboard;
