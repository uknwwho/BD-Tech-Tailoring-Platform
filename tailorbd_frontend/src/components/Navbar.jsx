import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between py-4 border-b border-gray-200 mb-8'>


            <NavLink to="/CMSDashboard" className="text-2xl font-bold text-gray-900">
                <p>CMSDashboard</p>
            </NavLink>

        </div>
    )
}

export default Navbar
