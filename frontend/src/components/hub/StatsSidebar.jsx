import React, { useState } from 'react';

const BOARDS = [
    { id: 'CARO', title: 'Caro 5', label: 'Wins' },
    { id: 'TICTACTOE', title: 'Tic-Tac-Toe', label: 'Wins' },
    { id: 'MEMORY', title: 'Memory Match', label: 'High Score' }
];

const StatsSidebar = ({ activeGame }) => {
    const [boardIndex, setBoardIndex] = useState(0);

    const handlePrevBoard = () => setBoardIndex(prev => (prev === 0 ? BOARDS.length - 1 : prev - 1));
    const handleNextBoard = () => setBoardIndex(prev => (prev === BOARDS.length - 1 ? 0 : prev + 1));

    const currentBoard = BOARDS[boardIndex];

    const renderRankings = () => {
        return (
            <div className="placeholder-list" style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p>1. PlayerOne - 150 {currentBoard.label}</p>
                <p>2. PlayerTwo - 120 {currentBoard.label}</p>
                <p>3. You - 10 {currentBoard.label}</p>
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

