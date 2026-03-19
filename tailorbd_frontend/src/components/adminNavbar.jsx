import React from 'react'

const adminNavbar = () => {
    return (
        <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8'>


            <NavLink to="/CMSDashboard" className="text-2xl font-bold text-gray-900">
                <p>Homepage</p>
                <p>Logout</p>
            </NavLink>

        </div>
    )
}

export default adminNavbar
