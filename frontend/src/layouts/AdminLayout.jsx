import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminNavigation from '../components/layout/AdminNavigation';
import ThemeToggle from '../components/layout/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="dashboard-shell">
            <div className="app-topbar glass-panel">
                <div className="brand-block">
                    <span className="brand-kicker">Admin Console</span>
                    <h1>System Control</h1>
                </div>

                <AdminNavigation />

                <div className="topbar-actions">
                    <div className="user-badge">
                        <strong>{user?.displayName || user?.username}</strong>
                        <span>{user?.email}</span>
                    </div>
                    <ThemeToggle />
                    <button type="button" className="control-btn action-btn topbar-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
