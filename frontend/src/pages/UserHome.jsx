import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialSidebar from '../components/hub/SocialSidebar';
import StatsSidebar from '../components/hub/StatsSidebar';
import GameMatrix from '../components/hub/GameMatrix';
import GameControls from '../components/hub/GameControls';
import { getCaroArt, getTicTacToeArt, getMemoryArt, getDrawArt } from '../utils/pixelArt';

const GRID_SIZE = 15;

const GAMES = [
    { id: 'CARO', title: 'Vietnamese Caro (5-in-a-row)', render: getCaroArt },
    { id: 'TICTACTOE', title: 'Tic-Tac-Toe', render: getTicTacToeArt },
    { id: 'MEMORY', title: 'Memory Match', render: getMemoryArt },
    { id: 'DRAW', title: 'Free Drawing Board', render: getDrawArt }
];

const UserHome = () => {
    const { user } = useAuth();
    const [mode, setMode] = useState('MENU');
    const [gameIndex, setGameIndex] = useState(0);
    const [playingGrid, setPlayingGrid] = useState(
        Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
    );

    const handleLeft = () => {
        if (mode === 'MENU') {
            setGameIndex(prev => (prev === 0 ? GAMES.length - 1 : prev - 1));
        }
    };

    const handleRight = () => {
        if (mode === 'MENU') {
            setGameIndex(prev => (prev === GAMES.length - 1 ? 0 : prev + 1));
        }
    };

    const handleEnter = () => {
        if (mode === 'MENU') {
            setMode(`PLAYING_${GAMES[gameIndex].id}`);
            // Later: Initialize game state for this specific game
        }
    };

    const handleBack = () => {
        setMode('MENU');
    };

    const handleHint = () => {
        alert(`How to play: ${GAMES[gameIndex].title}`);
    };

    // Determine what to show on the matrix
    const currentGridPixels = mode === 'MENU' ? GAMES[gameIndex].render() : playingGrid;

    return (
        <div className="hub-layout">
            <SocialSidebar />

            <div className="hub-center-console">
                <h1 className="console-title">{mode === 'MENU' ? GAMES[gameIndex].title : `Playing ${GAMES[gameIndex].title}`}</h1>
                <GameMatrix gridPixels={currentGridPixels} />
                <GameControls 
                    onLeft={handleLeft}
                    onRight={handleRight}
                    onEnter={handleEnter}
                    onBack={handleBack}
                    onHint={handleHint}
                />
                
                {mode === 'MENU' && (
                    <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        <p>Use <strong>LEFT / RIGHT</strong> to select a game.</p>
                        <p>Press <strong>ENTER</strong> to start playing.</p>
                    </div>
                )}
            </div>

            <StatsSidebar />
        </div>
    );
};

export default UserHome;

