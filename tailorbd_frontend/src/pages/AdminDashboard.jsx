// import React from 'react'
// import AdminSidebar from '../components/AdminSidebar';

// const AdminDashboard = () => {
//     return (
//         <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">

//             <AdminSidebar />

//         </div>
//     );
// };

// export default AdminDashboard


import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const [tailors, setTailors] = useState([]);
    const [stats, setStats] = useState({ users: 0, tailors: 0, products: 0, complaints: 0 });
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', role: 'tailor' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tailorRes, userRes, productRes, complaintRes] = await Promise.all([
                fetch(`${API_URL}/auth/admin/tailors`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/auth/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/products`),
                fetch(`${API_URL}/complaints/all`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const tailorData = await tailorRes.json();
            const userData = await userRes.json();
            const productData = await productRes.json();
            const complaintData = await complaintRes.json();

            if (tailorData.success) setTailors(tailorData.tailors);

            setStats({
                users: userData.success ? userData.users.filter(u => u.role === 'customer').length : 0,
                tailors: tailorData.success ? tailorData.tailors.length : 0,
                products: productData.success ? productData.pagination?.total || productData.products?.length || 0 : 0,
                complaints: complaintData.success ? complaintData.complaints.length : 0
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${API_URL}/auth/admin/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setMessage(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} created successfully!`);
                setFormData({ fullName: '', email: '', password: '', phone: '', role: 'tailor' });
                fetchData();
            } else {
                setMessage("Error: " + data.message);
            }
        } catch (error) {
            setMessage("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTailor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tailor? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/auth/admin/delete-user/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMessage("User deleted successfully.");
                fetchData();
            } else {
                setMessage("Error: " + data.message);
            }
        } catch (error) {
            setMessage("Failed to delete user.");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Platform overview and tailor management.</p>
                    </div>
                </header>

                {/* Analytics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customers</p>
                        <p className="text-3xl font-black text-indigo-600">{stats.users}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tailors</p>
                        <p className="text-3xl font-black text-purple-600">{stats.tailors}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Products</p>
                        <p className="text-3xl font-black text-green-600">{stats.products}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Complaints</p>
                        <p className="text-3xl font-black text-red-500">{stats.complaints}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Create Tailor Form */}
                    <div className="xl:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-6">Register New User</h2>

                            {message && (
                                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} required onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition" placeholder="Tailor Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} required onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Password</label>
                                    <input type="password" name="password" value={formData.password} required onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} required onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition" placeholder="01XXXXXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Account Role</label>
                                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition bg-white">
                                        <option value="tailor">Tailor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={loading} className={`w-full bg-indigo-600 text-white font-bold py-3 rounded-xl transition shadow-md ${loading ? 'opacity-50' : 'hover:bg-indigo-700'}`}>
                                    {loading ? 'Creating...' : `Register ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tailors List */}
                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Current Tailors</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Email</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Phone</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tailors.map((tailor) => (
                                            <tr key={tailor._id} className="hover:bg-indigo-50/30 transition">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                            {tailor.fullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{tailor.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600 font-mono">{tailor.email}</td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{tailor.phone}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${tailor.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                        {tailor.isActive !== false ? 'Active' : 'Suspended'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-400">{new Date(tailor.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => handleDeleteTailor(tailor._id)}
                                                        className="text-red-500 hover:text-red-700 transition font-bold text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {tailors.length === 0 && (
                                            <tr><td colSpan="5" className="py-10 text-center text-gray-500">No tailors found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
