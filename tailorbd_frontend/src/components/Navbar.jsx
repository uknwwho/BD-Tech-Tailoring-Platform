// import React from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const { getCartCount } = useCart();

//     // Check if someone is logged in by looking in the browser's memory
//     const user = JSON.parse(localStorage.getItem('tailortech_user'));

//     // The Logout Function
//     const handleLogout = () => {
//         // 1. Destroy the tokens
//         localStorage.removeItem('tailortech_token');
//         localStorage.removeItem('tailortech_user');
//         // 2. Kick them back to the login page
//         navigate('/login');
//     };

//     return (
//         <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8 relative px-4'>

//             {/* Left Side: Admin Link (Only visible if the user is an admin!) */}
//             <div className="flex items-center w-1/3">
//                 {user?.role === 'admin' && (
//                     <NavLink to="/AdminDashboard" className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition">
//                         <p>Admin</p>
//                     </NavLink>
//                 )}

//                 {/* Shows ONLY to Tailors */}
//                 {user?.role === 'tailor' && (
//                     <NavLink to="/TailorShopConfig" className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition">
//                         <p> My Shop Config</p>
//                     </NavLink>
//                 )}

//             </div>

//             {/* Center: Brand Logo */}
//             <div className="w-1/3 flex justify-center">
//                 <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
//                     TailorTech.
//                 </Link>
//             </div>

//             {/* Right Side: Smart Auth Logic */}
//             <div className="flex items-center justify-end w-1/3 gap-4">
//                 {user ? (
//                     // If Logged In: Show Profile and Logout
//                     <div className="flex items-center gap-3">
//                         <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
//                             <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
//                                 {user.name.charAt(0).toUpperCase()}
//                             </div>
//                             <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{user.name}</span>
//                         </div>
//                         <button
//                             onClick={handleLogout}
//                             className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full font-medium hover:bg-red-100 transition text-sm shadow-sm"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 ) : (
//                     // If Not Logged In: Show Sign In
//                     <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm text-sm">
//                         Sign In
//                     </Link>
//                 )}
//             </div>

//         </div>
//     );
// };

// export default Navbar;



















// // import React from 'react';
// // import { NavLink, Link } from 'react-router-dom';

// // const Navbar = () => {
// //     return (
// //         // Added 'relative' here so the absolute centered logo stays inside the navbar!
// //         <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8 relative'>

// //             {/* Left Side: Admin Link */}
// //             <div className="flex items-center">
// //                 <NavLink
// //                     to="/AdminDashboard"
// //                     className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition ml-4"
// //                 >
// //                     <p>Admin</p>
// //                 </NavLink>
// //             </div>

// //             {/* Center: Brand Logo/Name (Absolutely centered) */}
// //             <Link
// //                 to="/"
// //                 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-indigo-600 tracking-tight"
// //             >
// //                 TailorTech.
// //             </Link>

// //             {/* Right Side: Sign In Button */}
// //             <div className="flex items-center mr-4">
// //                 <Link
// //                     to="/login"
// //                     className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm text-sm"
// //                 >
// //                     Sign In
// //                 </Link>
// //             </div>

// //         </div>
// //     );
// // };

// // export default Navbar;

import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const user = JSON.parse(localStorage.getItem('tailortech_user'));

    const handleLogout = () => {
        localStorage.removeItem('tailortech_token');
        localStorage.removeItem('tailortech_user');
        navigate('/login');
    };

    return (
        <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8 relative px-4'>

            {/* Left Side: Role-specific links */}
            <div className="flex items-center w-1/3 gap-4">
                <NavLink to="/tailors" className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-600'}`}>
                    Tailors
                </NavLink>
                {user?.role === 'admin' && (
                    <NavLink to="/AdminDashboard" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition">
                        Admin Panel
                    </NavLink>
                )}

                {/* {user?.role === 'tailor' && (
                    <NavLink to="/TailorShopConfig" className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition">
                        <p> My Shop Config</p>
                    </NavLink>
                )} */}

                {user?.role === 'tailor' && (
                    <NavLink to="/TailorDashboard" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition">
                        Tailor Panel
                    </NavLink>
                )}
                {user?.role === 'customer' && (
                    <>
                        <NavLink to="/my-orders" className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-600'}`}>
                            My Orders
                        </NavLink>
                        <NavLink to="/my-complaints" className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-600'}`}>
                            Complaints
                        </NavLink>
                    </>
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
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{user.name}</span>
                            <span className="text-xs text-gray-400 capitalize">({user.role})</span>
                        </div>
                        {(user.role !== 'admin' && user.role !== 'tailor') && (
                            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                {getCartCount() > 0 && (
                                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full font-medium hover:bg-red-100 transition text-sm shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            {getCartCount() > 0 && (
                                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm text-sm">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
