// import React from 'react'
// import { NavLink } from 'react-router-dom'

// const Navbar = () => {
//     return (
//         <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8'>


//             <NavLink to="/AdminDashboard" className="text-2xl font-bold text-gray-900">
//                 <p>Admin</p>
//             </NavLink>

//         </div>
//     )
// }

// export default Navbar


import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8'>

            {/* Left Side: Brand Logo/Name anchors the flex layout */}
            <Link
                to="/"
                className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-indigo-600 tracking-tight"
            >
                TailorTech.
            </Link>

            <NavLink
                to="/AdminDashboard"
                className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition mr-8 md:mr-24 lg:mr-32"
            >
                <p>Admin</p>
            </NavLink>

        </div>
    )
}

export default Navbar