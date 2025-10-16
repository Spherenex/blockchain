import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAllowed, redirectTo = '/' }) => {
    if (!isAllowed) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;