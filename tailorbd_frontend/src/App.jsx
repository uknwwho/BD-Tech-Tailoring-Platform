import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Auth from './pages/Auth';
import CMSDashboard from './pages/CMSDashboard'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/AdminDashboard'
import TailorShopConfig from './pages/TailorShopConfig'
import TailorDashboard from './pages/TailorDashboard';
import TailorListPage from './pages/TailorListPage';
import TailorDetailPage from './pages/TailorDetailPage';
import MyComplaints from './pages/MyComplaints';
import TailorProducts from './pages/TailorProducts';
import TailorComplaints from './pages/TailorComplaints';
import TailorProfile from './pages/TailorProfile';
import AdminUsers from './pages/AdminUsers';
import AdminComplaints from './pages/AdminComplaints';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import MyOrders from './pages/MyOrders';
import TailorOrders from './pages/TailorOrders';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  const location = useLocation();
  // Check if current route is an admin route
  // const isAdminRoute = location.pathname.includes('CMSDashboard') || location.pathname.includes('AdminDashboard');

  const hideNavbar = location.pathname === '/login' ||
    location.pathname.includes('CMSDashboard') ||
    location.pathname.includes('AdminDashboard') ||
    location.pathname.includes('AdminUsers') ||
    location.pathname.includes('AdminProducts') ||
    location.pathname.includes('AdminComplaints') ||
    location.pathname.includes('AdminOrders') ||
    location.pathname.includes('TailorDashboard') ||
    location.pathname.includes('TailorProducts') ||
    location.pathname.includes('TailorComplaints') ||
    location.pathname.includes('TailorOrders') ||
    location.pathname.includes('TailorProfileEdit');


  //   return (
  //     <div className="w-full min-h-screen">
  //       {!hideNavbar && <Navbar />}

  //       <div className={!hideNavbar ? 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : 'w-full h-full'}>
  //         <Routes>
  //           <Route path="/" element={<Home />} />
  //           <Route path="/login" element={<Auth />} />
  //           <Route path="/CMSDashboard" element={<CMSDashboard />} />
  //           <Route path="/AdminDashboard" element={<AdminDashboard />} />
  //           <Route path="/TailorShopConfig" element={<TailorShopConfig />} />
  //         </Routes>
  //       </div>
  //     </div>
  //   )
  // }

  // export default App


  return (
    <div className="w-full min-h-screen">
      {!hideNavbar && <Navbar />}

      <div className={!hideNavbar ? 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : 'w-full h-full'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/tailors" element={<TailorListPage />} />
          <Route path="/tailors/:id" element={<TailorDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Customer Routes */}
          <Route path="/my-complaints" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyComplaints />
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyOrders />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/CMSDashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CMSDashboard />
            </ProtectedRoute>
          } />
          <Route path="/AdminDashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/AdminUsers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/AdminComplaints" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminComplaints />
            </ProtectedRoute>
          } />
          <Route path="/AdminOrders" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/AdminProducts" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProducts />
            </ProtectedRoute>
          } />

          {/* Tailor Routes */}

          <Route path="/TailorShopConfig" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorShopConfig />
            </ProtectedRoute>
          } />

          <Route path="/TailorDashboard" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/TailorProducts" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorProducts />
            </ProtectedRoute>
          } />
          <Route path="/TailorComplaints" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorComplaints />
            </ProtectedRoute>
          } />
          <Route path="/TailorOrders" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorOrders />
            </ProtectedRoute>
          } />
          <Route path="/TailorProfileEdit" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App