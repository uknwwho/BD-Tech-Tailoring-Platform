import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate!

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize the navigate hook

    // Grab the logged-in user from the browser
    const user = JSON.parse(localStorage.getItem('tailortech_user'));

    // ==========================================
    // THE LOGOUT FUNCTION
    // ==========================================
    const handleLogout = () => {
        // 1. Clear the secure tokens
        localStorage.removeItem('tailortech_token');
        localStorage.removeItem('tailortech_user');

        // 2. Kick them back to the login page
        navigate('/login');
    };

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

            {/* Admin Info & Logout Area */}
            <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
                <div>
                    <div className="text-sm font-bold text-gray-800">
                        {user ? user.name : 'Unknown Admin'}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5 font-semibold">
                        {user ? user.role : 'ADMIN'}
                    </div>
                </div>

                {/* The new Logout Button! */}
                <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition px-2 py-1 rounded hover:bg-red-50"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
