import React from 'react';

const StatsSidebar = () => {
    return (
        <div className="hub-sidebar right-sidebar">
            <div className="stats-section glass-panel" style={{ flex: 1 }}>
                <h4>Global Rankings</h4>
                <div className="placeholder-list" style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p>1. PlayerOne - 1500 ELO</p>
                    <p>2. PlayerTwo - 1450 ELO</p>
                    <p>3. PlayerThree - 1400 ELO</p>
                </div>
            </div>
            
            <div className="config-section glass-panel">
                <h4>Game Settings</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '1rem 0', fontSize: '0.9rem' }}>Timer: 5 mins</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="control-btn nav-btn" style={{ flex: 1, padding: '0.5rem' }}>Save</button>
                    <button className="control-btn nav-btn" style={{ flex: 1, padding: '0.5rem' }}>Load</button>
                </div>
            </div>
        </div>
    );
};

export default StatsSidebar;
