import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Auth from './pages/Auth';
import CMSDashboard from './pages/CMSDashboard'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/AdminDashboard'
import TailorShopConfig from './pages/TailorShopConfig'

const App = () => {
  const location = useLocation();
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.includes('CMSDashboard') || location.pathname.includes('AdminDashboard');

  return (
    <div className="w-full min-h-screen">
      {!isAdminRoute && <Navbar />}

      <div className={!isAdminRoute ? 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : 'w-full h-full'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/CMSDashboard" element={<CMSDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/TailorShopConfig" element={<TailorShopConfig />} />
        </Routes>
      </div>
    </div>
  )
}

export default App