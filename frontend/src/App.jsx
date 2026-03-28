import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyResetPage from './pages/VerifyResetPage';
import VerifyRegisterPage from './pages/VerifyRegisterPage';
import AdminHome from './pages/AdminHome';
import PublicLayout from './layouts/PublicLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import HubPage from './pages/client/HubPage';
import GamePage from './pages/client/GamePage';
import ProfilePage from './pages/client/ProfilePage';
import UsersPage from './pages/client/UsersPage';

const LoadingScreen = () => (
    <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
            <h2>Loading</h2>
            <p>Restoring your session...</p>
        </div>
    </div>
);

const ProtectedRoute = ({ role }) => {
    const { token, user, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!token) return <Navigate to="/login" replace />;

    if (role && user && user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/hub'} replace />;
    }

    return <Outlet />;
};

const HomeRedirect = () => {
    const { token, user, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!token) return <Navigate to="/login" replace />;

    return <Navigate to={user?.role === 'admin' ? '/admin' : '/hub'} replace />;
};

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-reset/:token" element={<VerifyResetPage />} />
                    <Route path="/verify-register/:token" element={<VerifyRegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute role="user" />}>
                    <Route element={<ClientLayout />}>
                        <Route path="/hub" element={<HubPage />} />
                        <Route path="/games/:id" element={<GamePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/user" element={<Navigate to="/hub" replace />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute role="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminHome />} />
                    </Route>
                </Route>

                <Route path="/" element={<HomeRedirect />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
