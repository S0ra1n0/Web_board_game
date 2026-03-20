import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch('/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.data.user);
                } else {
                    logout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUser(data.data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return data.data.user;
    };

    const register = async (username, email, password) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        return data.message || 'Verification email sent';
    };

    const verifyRegister = async (token) => {
        const res = await fetch('/api/auth/verify-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data; // contains message and username
    };

    const requestPasswordReset = async (email, newPassword) => {
        const res = await fetch('/api/auth/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.message;
    };

    const verifyPasswordReset = async (token) => {
        const res = await fetch('/api/auth/verify-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data; // contains message and username
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <AuthContext.Provider value={{ user, token, theme, toggleTheme, login, register, verifyRegister, requestPasswordReset, verifyPasswordReset, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
