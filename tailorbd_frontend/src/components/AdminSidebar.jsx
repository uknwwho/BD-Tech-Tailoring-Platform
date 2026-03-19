import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    // Helper to highlight the active tab
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white border-r shadow-sm flex-col hidden md:flex h-screen sticky top-0">
            <Link to="/" className="block p-6 text-2xl font-bold text-indigo-600 tracking-tight hover:text-indigo-800 transition">
                TailorTech.
            </Link>
            <nav className="flex-1 mt-4">
                <Link
                    to="/AdminDashboard"
                    className={`block py-3 px-6 transition ${isActive('/AdminDashboard') ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/CMSDashboard"
                    className={`block py-3 px-6 transition ${isActive('/CMSDashboard') ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                    CMS & Banners
                </Link>
                <Link
                    to="#"
                    className={`block py-3 px-6 transition ${isActive('') ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                    Deliveries
                </Link>
                <Link
                    to="#"
                    className={`block py-3 px-6 transition ${isActive('') ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                    no name
                </Link>
            </nav>
            <div className="p-6 border-t bg-gray-50">
                <div className="text-sm font-bold text-gray-800">Admin User</div>
                <div className="text-xs text-gray-500">admin@bdtechtailor.com</div>
            </div>
        </aside>
    );
};

export default AdminSidebar;