import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    // Check if someone is logged in by looking in the browser's memory
    const user = JSON.parse(localStorage.getItem('tailortech_user'));

    // The Logout Function
    const handleLogout = () => {
        // 1. Destroy the tokens
        localStorage.removeItem('tailortech_token');
        localStorage.removeItem('tailortech_user');
        // 2. Kick them back to the login page
        navigate('/login');
    };

    return (
        <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8 relative px-4'>

            {/* Left Side: Admin Link (Only visible if the user is an admin!) */}
            <div className="flex items-center w-1/3">
                {user?.role === 'admin' && (
                    <NavLink to="/AdminDashboard" className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition">
                        <p>Admin</p>
                    </NavLink>
                )}
            </div>

            {/* Center: Brand Logo */}
            <div className="w-1/3 flex justify-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                    TailorTech.
                </Link>
            </div>

            {/* Right Side: Smart Auth Logic */}
            <div className="flex items-center justify-end w-1/3 gap-4">
                {user ? (
                    // If Logged In: Show Profile and Logout
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full font-medium hover:bg-red-100 transition text-sm shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    // If Not Logged In: Show Sign In
                    <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm text-sm">
                        Sign In
                    </Link>
                )}
            </div>

        </div>
    );
};

export default Navbar;



















// import React from 'react';
// import { NavLink, Link } from 'react-router-dom';

// const Navbar = () => {
//     return (
//         // Added 'relative' here so the absolute centered logo stays inside the navbar!
//         <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8 relative'>

//             {/* Left Side: Admin Link */}
//             <div className="flex items-center">
//                 <NavLink
//                     to="/AdminDashboard"
//                     className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition ml-4"
//                 >
//                     <p>Admin</p>
//                 </NavLink>
//             </div>

//             {/* Center: Brand Logo/Name (Absolutely centered) */}
//             <Link
//                 to="/"
//                 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-indigo-600 tracking-tight"
//             >
//                 TailorTech.
//             </Link>

//             {/* Right Side: Sign In Button */}
//             <div className="flex items-center mr-4">
//                 <Link
//                     to="/login"
//                     className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm text-sm"
//                 >
//                     Sign In
//                 </Link>
//             </div>

//         </div>
//     );
// };

// export default Navbar;
