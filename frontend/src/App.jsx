import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sun, Moon } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useAuth();
    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
    );
};

const ProtectedRoute = ({ children, role }) => {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" />;
    if (role && user && user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />;
    }
    return children;
};

const MainApp = () => {
    return (
        <Router>
            <header>
                <ThemeToggle />
            </header>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute role="user">
                            <UserHome />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminHome />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

const App = () => (
    <AuthProvider>
        <MainApp />
    </AuthProvider>
);

export default App;
