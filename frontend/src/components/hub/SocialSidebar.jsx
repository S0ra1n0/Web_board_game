import React from 'react';
import { useAuth } from '../../context/AuthContext';

const SocialSidebar = () => {
    const { user, logout } = useAuth();
    
    return (
        <div className="hub-sidebar left-sidebar">
            <div className="profile-section glass-panel">
                <h3>{user?.username}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Rank: Beginner</p>
                <button onClick={logout} className="control-btn nav-btn" style={{ width: '100%', padding: '0.5rem' }}>Logout</button>
            </div>
            
            <div className="friends-section glass-panel" style={{ flex: 1 }}>
                <h4>Friends & Chat</h4>
                <div className="placeholder-list" style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p>No friends online.</p>
                </div>
            </div>
        </div>
    );
};

export default SocialSidebar;
