import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const API_URL = `${import.meta.env.VITE_API_URL}/auth/admin`;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            console.log("Admin Users Backend Response:", data); // ADD THIS LINE!
            if (data.success) setUsers(data.users);
            else console.error("Backend refused:", data.message); // AND THIS LINE!
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await fetch(`${API_URL}/toggle-status/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) fetchUsers();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const filteredUsers = users.filter(u => {
        if (filter === 'all') return true;
        return u.role === filter;
    });

    const getRoleBadge = (role) => {
        const styles = {
            'admin': 'bg-purple-50 text-purple-700 border-purple-200',
            'tailor': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'customer': 'bg-gray-50 text-gray-700 border-gray-200'
        };
        return `px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles[role] || ''}`;
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-500 mt-1">View and manage all platform users.</p>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {['all', 'customer', 'tailor', 'admin'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
                        >
                            {f === 'all' ? `All (${users.length})` : `${f}s (${users.filter(u => u.role === f).length})`}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-gray-100 rounded mb-3"></div>)}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Email</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Phone</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                        {u.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{u.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 font-mono">{u.email}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{u.phone}</td>
                                            <td className="py-4 px-6"><span className={getRoleBadge(u.role)}>{u.role}</span></td>
                                            <td className="py-4 px-6">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {u.isActive !== false ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-6 text-right">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => toggleStatus(u._id)}
                                                        className={`text-xs font-medium px-3 py-1 rounded-lg transition ${u.isActive !== false ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                                                    >
                                                        {u.isActive !== false ? 'Suspend' : 'Activate'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr><td colSpan="7" className="py-10 text-center text-gray-500">No users found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminUsers;
