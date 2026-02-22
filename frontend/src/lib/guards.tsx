
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../app/providers';

export const RequireAuth = () => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
};

export const RequireRole = ({ roles }: { roles: string[] }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    if (!user || !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
    return <Outlet />;
};
