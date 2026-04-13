import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('tailortech_token');
    const userStr = localStorage.getItem('tailortech_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not authorized for this route
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
