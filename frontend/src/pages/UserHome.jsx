import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserHome = () => {
    const { user, logout } = useAuth();
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome, {user?.username}!</h1>
            <p>This is the <strong>User Home Page</strong>. You have successfully authenticated.</p>
            <button onClick={logout} style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', background: '#ccc', color: '#000' }}>
                Logout
            </button>
        </div>
    );
};

export default UserHome;
