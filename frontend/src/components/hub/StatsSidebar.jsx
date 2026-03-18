import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const BOARDS = [
    { id: 'CARO', title: 'Caro 5', label: 'Wins' },
    { id: 'TICTACTOE', title: 'Tic-Tac-Toe', label: 'Wins' },
    { id: 'MEMORY', title: 'Memory Match', label: 'High Score' }
];

const StatsSidebar = ({ activeGame, userStats = {} }) => {
    const { user, token } = useAuth();
    const [boardIndex, setBoardIndex] = useState(0);
    const [filter, setFilter] = useState('global');
    const [leaderboard, setLeaderboard] = useState([]);

    const handlePrevBoard = () => setBoardIndex(prev => (prev === 0 ? BOARDS.length - 1 : prev - 1));
    const handleNextBoard = () => setBoardIndex(prev => (prev === BOARDS.length - 1 ? 0 : prev + 1));

    const currentBoard = BOARDS[boardIndex];

    useEffect(() => {
        if (!token) return;
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`/api/users/leaderboard/${currentBoard.id}?filter=${filter}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data);
                }
            } catch (err) {
                console.error('Failed to fetch leaderboard');
            }
        };
        fetchLeaderboard();
    }, [currentBoard.id, filter, token, userStats]); // re-fetch if userStats changes

    const renderRankings = () => {
        const statKey = currentBoard.id === 'MEMORY' ? 'highScore' : 'wins';
        const userStatValue = userStats[currentBoard.id]?.[statKey] || 0;

        return (
            <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button 
                        onClick={() => setFilter('global')}
                        className={`control-btn ${filter === 'global' ? 'enter-btn' : 'action-btn'}`}
                        style={{ flex: 1, padding: '0.25rem 0', fontSize: '0.8rem', borderRadius: '8px' }}
                    >Global</button>
                    <button 
                        onClick={() => setFilter('friends')}
                        className={`control-btn ${filter === 'friends' ? 'enter-btn' : 'action-btn'}`}
                        style={{ flex: 1, padding: '0.25rem 0', fontSize: '0.8rem', borderRadius: '8px' }}
                    >Friends</button>
                </div>
                
                <div className="placeholder-list" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {leaderboard.length === 0 ? (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', margin: '0.5rem 0' }}>No ranking data yet...</p>
                    ) : (
                        leaderboard.map((entry, idx) => (
                            <p key={idx} style={{ 
                                color: entry.username === user?.username ? 'var(--accent-primary)' : 'inherit', 
                                fontWeight: entry.username === user?.username ? 'bold' : 'normal' 
                            }}>
                                {idx + 1}. {entry.username} - {entry.score} {currentBoard.label}
                            </p>
                        ))
                    )}
                    
                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                    <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>You: {userStatValue} {currentBoard.label}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="hub-sidebar right-sidebar">
            <div className="stats-section glass-panel" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={handlePrevBoard} className="control-btn nav-btn" style={{ padding: '0.25rem 0.5rem' }}>◀</button>
                    <h4 style={{ margin: 0, textAlign: 'center', flex: 1, fontSize: '0.95rem' }}>{currentBoard.title}</h4>
                    <button onClick={handleNextBoard} className="control-btn nav-btn" style={{ padding: '0.25rem 0.5rem' }}>▶</button>
                </div>
                {renderRankings()}
            </div>
            
            <div className="config-section glass-panel">
                <h4>{activeGame?.title || 'Game'} Settings</h4>
                {activeGame?.id === 'MEMORY' ? (
                     <p style={{ color: 'var(--text-secondary)', margin: '1rem 0', fontSize: '0.9rem' }}>Timer: 1 mins</p>
                ) : activeGame?.id !== 'DRAW' ? (
                     <p style={{ color: 'var(--text-secondary)', margin: '1rem 0', fontSize: '0.9rem' }}>Versus: AI (Random)</p>
                ) : (
                     <p style={{ color: 'var(--text-secondary)', margin: '1rem 0', fontSize: '0.9rem' }}>Mode: FreePlay</p>
                )}
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="control-btn nav-btn" style={{ flex: 1, padding: '0.5rem' }}>Save</button>
                    <button className="control-btn nav-btn" style={{ flex: 1, padding: '0.5rem' }}>Load</button>
                </div>
            </div>
        </div>
    );
};

export default StatsSidebar;

