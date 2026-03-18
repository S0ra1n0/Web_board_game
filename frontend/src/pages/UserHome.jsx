import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialSidebar from '../components/hub/SocialSidebar';
import StatsSidebar from '../components/hub/StatsSidebar';
import GameMatrix from '../components/hub/GameMatrix';
import GameControls from '../components/hub/GameControls';
import { getCaroArt, getTicTacToeArt, getMemoryArt, getDrawArt } from '../utils/pixelArt';
import { useTicTacToe } from '../hooks/useTicTacToe';

const GRID_SIZE = 20;

const GAMES = [
    { id: 'CARO', title: 'Caro 5', render: getCaroArt, available: false },
    { id: 'TICTACTOE', title: 'Tic-Tac-Toe', render: getTicTacToeArt, available: true },
    { id: 'MEMORY', title: 'Memory Match', render: getMemoryArt, available: false },
    { id: 'DRAW', title: 'Free Drawing Board', render: getDrawArt, available: false }
];

const UserHome = () => {
    const { user, token } = useAuth();
    const [mode, setMode] = useState('MENU');
    const [gameIndex, setGameIndex] = useState(0);
    const [gameOverModal, setGameOverModal] = useState(null);

    // Stats fetched from database
    const [stats, setStats] = useState({ 
        CARO: { wins: 0 }, 
        TICTACTOE: { wins: 0 }, 
        MEMORY: { highScore: 0 } 
    });

    useEffect(() => {
        if (!token) return;
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/users/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        CARO: { wins: data.caro_wins },
                        TICTACTOE: { wins: data.tictactoe_wins },
                        MEMORY: { highScore: data.memory_highscore }
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, [token]);

    const saveStats = async (gameId, statType, value, updateUILater = false) => {
        // Optimistic UI update calculation
        const newStats = { ...stats };
        if (gameId === 'TICTACTOE' && statType === 'win') newStats.TICTACTOE.wins += value;
        if (gameId === 'CARO' && statType === 'win') newStats.CARO.wins += value;
        if (gameId === 'MEMORY' && statType === 'highscore') {
            newStats.MEMORY.highScore = Math.max(newStats.MEMORY.highScore, value);
        }
        
        if (!updateUILater) {
            setStats(newStats);
        }

        // API call
        try {
            await fetch('/api/users/stats', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ game_id: gameId, stat_type: statType, value })
            });
        } catch (error) {
            console.error('Failed to save stats:', error);
        }
        return newStats;
    };

    // Call game hooks unconditionally (React rules), handle interaction conditionally
    const handleGameOver = async (winner) => {
        let resultText = winner === 'DRAW' ? 'Draw' : winner === 'X' ? 'Victory!' : 'Defeat';
        let latestStats = stats;
        
        if (winner === 'X') {
            latestStats = await saveStats('TICTACTOE', 'win', 1, true); // true = defer UI update
        }

        setGameOverModal({
            title: resultText,
            statsText: `Total Wins: ${latestStats.TICTACTOE.wins}`,
            onPlayAgain: () => {
                if (winner === 'X') setStats(latestStats); // update leaderboard now
                setGameOverModal(null);
                ticTacToeGame.reset();
            },
            onQuit: () => {
                if (winner === 'X') setStats(latestStats); // update leaderboard now
                setGameOverModal(null);
                setMode('MENU');
            }
        });
    };

    const ticTacToeGame = useTicTacToe({ onGameOver: handleGameOver });

    const handleLeft = () => {
        if (gameOverModal) return;
        if (mode === 'MENU') setGameIndex(prev => (prev === 0 ? GAMES.length - 1 : prev - 1));
        else if (mode === 'PLAYING_TICTACTOE') ticTacToeGame.handleLeft();
    };

    const handleRight = () => {
        if (gameOverModal) return;
        if (mode === 'MENU') setGameIndex(prev => (prev === GAMES.length - 1 ? 0 : prev + 1));
        else if (mode === 'PLAYING_TICTACTOE') ticTacToeGame.handleRight();
    };

    const handleEnter = () => {
        if (gameOverModal) return;
        if (mode === 'MENU') {
            if (!GAMES[gameIndex].available) return;
            setMode(`PLAYING_${GAMES[gameIndex].id}`);
            if (GAMES[gameIndex].id === 'TICTACTOE') {
                ticTacToeGame.reset();
            }
        }
        else if (mode === 'PLAYING_TICTACTOE') ticTacToeGame.handleEnter();
    };

    const handleBack = () => {
        if (gameOverModal) return;
        if (mode !== 'MENU') {
            const confirmLeave = window.confirm('Are you sure you want to leave the active game?');
            if(confirmLeave) setMode('MENU');
        }
    };

    const handleHint = () => {
        if (gameOverModal) return;
        alert(mode === 'MENU' ? `How to play: ${GAMES[gameIndex].title}` : `In-game Hint/Instructions!`);
    };

    // Determine what to show on the matrix
    let currentGridPixels;
    if (mode === 'MENU') {
        currentGridPixels = GAMES[gameIndex].render();
    } else if (mode === 'PLAYING_TICTACTOE') {
        currentGridPixels = ticTacToeGame.gridPixels;
    } else {
        currentGridPixels = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    }

    return (
        <div className="hub-layout">
            <SocialSidebar />

            <div className="hub-center-console" style={{ position: 'relative' }}>
                <h1 className="console-title">{mode === 'MENU' ? GAMES[gameIndex].title : `Playing ${GAMES[gameIndex].title}`}</h1>
                
                {mode === 'MENU' && (
                    <div style={{ color: GAMES[gameIndex].available ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
                        {GAMES[gameIndex].available ? 'Available' : 'Unavailable'}
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <GameMatrix gridPixels={currentGridPixels} />
                    
                    {gameOverModal && (
                        <div className="glass-panel" style={{ 
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            zIndex: 10, textAlign: 'center', background: 'var(--bg-primary)', minWidth: '300px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}>
                            <h2 style={{ fontSize: '2rem' }}>{gameOverModal.title}</h2>
                            <h3 style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>{gameOverModal.statsText}</h3>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button onClick={gameOverModal.onPlayAgain} className="control-btn enter-btn" style={{flex: 1}}>Play Again</button>
                                <button onClick={gameOverModal.onQuit} className="control-btn action-btn" style={{flex: 1}}>Quit</button>
                            </div>
                        </div>
                    )}
                </div>

                <GameControls 
                    onLeft={handleLeft}
                    onRight={handleRight}
                    onEnter={handleEnter}
                    onBack={handleBack}
                    onHint={handleHint}
                />
                
                {mode === 'MENU' && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>Use <strong>LEFT / RIGHT</strong> to select a game.</p>
                        <p>Press <strong>ENTER</strong> to start playing.</p>
                    </div>
                )}
            </div>

            <StatsSidebar activeGame={GAMES[gameIndex]} userStats={stats} />
        </div>
    );
};

export default UserHome;

