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
    const [exitConfirmModal, setExitConfirmModal] = useState(null);
    const [saveFoundModal, setSaveFoundModal] = useState(null);
    const [sideSelectionModal, setSideSelectionModal] = useState(null);
    const [hintModal, setHintModal] = useState(null);
    const [progressMetadata, setProgressMetadata] = useState({}); // { GAME_ID: updated_at }

    // Stats fetched from database
    const [stats, setStats] = useState({ 
        CARO: { wins: 0 }, 
        TICTACTOE: { wins: 0 }, 
        MEMORY: { highScore: 0 } 
    });

    useEffect(() => {
        if (!token) return;
        const fetchUserData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('/api/users/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats({
                        CARO: { wins: data.caro_wins },
                        TICTACTOE: { wins: data.tictactoe_wins },
                        MEMORY: { highScore: data.memory_highscore }
                    });
                }

                // Fetch Game Progress Metadata (Timestamps)
                // We'll just fetch all saves for the user
                GAMES.forEach(async (game) => {
                    const res = await fetch(`/api/users/load-game/${game.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setProgressMetadata(prev => ({
                            ...prev,
                            [game.id]: data.updated_at
                        }));
                    }
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
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

    const handleSave = async () => {
        const gameId = GAMES[gameIndex].id;
        let gameState = null;
        
        if (mode === 'PLAYING_TICTACTOE') {
            gameState = ticTacToeGame.getState();
        }

        if (!gameState) return;

        try {
            const res = await fetch('/api/users/save-game', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ game_id: gameId, game_state: gameState })
            });
            if (res.ok) {
                const data = await res.json();
                setProgressMetadata(prev => ({
                    ...prev,
                    [gameId]: data.updated_at
                }));
                alert('Game progress saved!');
            }
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    };

    const handleLoad = async () => {
        const gameId = GAMES[gameIndex].id;
        try {
            const res = await fetch(`/api/users/load-game/${gameId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (mode === `PLAYING_${gameId}`) {
                    if (gameId === 'TICTACTOE') ticTacToeGame.loadState(data.game_state);
                } else {
                    // If loading from menu, enter the game first
                    setMode(`PLAYING_${gameId}`);
                    setTimeout(() => {
                        if (gameId === 'TICTACTOE') ticTacToeGame.loadState(data.game_state);
                    }, 100);
                }
                // Delete save data after loading to prevent "Undo Cheating"
                await deleteProgress(gameId);
            } else {
                alert('No saved progress found for this game.');
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
    };

    const deleteProgress = async (gameId) => {
        try {
            await fetch(`/api/users/delete-game/${gameId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProgressMetadata(prev => {
                const NewMeta = { ...prev };
                delete NewMeta[gameId];
                return NewMeta;
            });
        } catch (error) {
            console.error('Failed to delete progress:', error);
        }
    };

    // Call game hooks unconditionally (React rules), handle interaction conditionally
    const handleGameOver = (winner) => {
        const gameId = GAMES[gameIndex].id;
        const isWin = winner === ticTacToeGame.playerSide;
        
        // 1. Show modal IMMEDIATELY (no awaits before this)
        const resultText = winner === 'DRAW' ? 'Draw' : isWin ? 'Victory!' : 'Defeat';
        
        setGameOverModal({
            title: resultText,
            statsText: `Loading stats...`, // Update this shortly after
            onPlayAgain: () => {
                setGameOverModal(null);
                triggerSideSelection(gameId);
            },
            onQuit: () => {
                setGameOverModal(null);
                setMode('MENU');
            }
        });

        // 2. Perform background tasks (delete progress, save stats)
        deleteProgress(gameId); 

        if (isWin) {
            saveStats('TICTACTOE', 'win', 1, true).then(latestStats => {
                // Update the already open modal with latest stats
                setGameOverModal(prev => prev ? {
                    ...prev,
                    statsText: `Total Wins: ${latestStats.TICTACTOE.wins}`,
                    onPlayAgain: () => {
                        setStats(latestStats);
                        setGameOverModal(null);
                        triggerSideSelection(gameId);
                    },
                    onQuit: () => {
                        setStats(latestStats);
                        setGameOverModal(null);
                        setMode('MENU');
                    }
                } : null);
            });
        } else {
            setGameOverModal(prev => prev ? {
                ...prev,
                statsText: `Total Wins: ${stats.TICTACTOE.wins}`
            } : null);
        }
    };

    const ticTacToeGame = useTicTacToe({ onGameOver: handleGameOver });

    const handleLeft = () => {
        if (gameOverModal || exitConfirmModal || saveFoundModal || sideSelectionModal || hintModal) return;
        if (mode === 'MENU') setGameIndex(prev => (prev === 0 ? GAMES.length - 1 : prev - 1));
        else if (mode === 'PLAYING_TICTACTOE') ticTacToeGame.handleLeft();
    };

    const handleRight = () => {
        if (gameOverModal || exitConfirmModal || saveFoundModal || sideSelectionModal || hintModal) return;
        if (mode === 'MENU') setGameIndex(prev => (prev === GAMES.length - 1 ? 0 : prev + 1));
        else if (mode === 'PLAYING_TICTACTOE') ticTacToeGame.handleRight();
    };

    // Helper to start the game after side selection
    const startNewGame = (gameId, side) => {
        setMode(`PLAYING_${gameId}`);
        if (gameId === 'TICTACTOE') {
            ticTacToeGame.reset(side);
        }
        setSideSelectionModal(null);
    };

    const triggerSideSelection = (gameId) => {
        setSideSelectionModal({
            onSelect: (side) => startNewGame(gameId, side),
            onCancel: () => setSideSelectionModal(null)
        });
    };

    const handleEnter = () => {
        if (gameOverModal || exitConfirmModal || saveFoundModal || sideSelectionModal || hintModal) return;
        if (mode === 'MENU') {
            const gameId = GAMES[gameIndex].id;
            if (!GAMES[gameIndex].available) return;

            // Check if there's a save for this game
            if (progressMetadata[gameId]) {
                setSaveFoundModal({
                    gameId,
                    onLoad: () => {
                        handleLoad();
                        setSaveFoundModal(null);
                    },
                    onCreateNew: async () => {
                        await deleteProgress(gameId);
                        setSaveFoundModal(null);
                        triggerSideSelection(gameId);
                    },
                    onCancel: () => setSaveFoundModal(null)
                });
                return;
            }

            triggerSideSelection(gameId);
        }
        else if (mode === 'PLAYING_TICTACTOE') ticTacToeGame.handleEnter();
    };

    const handleBack = () => {
        if (gameOverModal || exitConfirmModal || saveFoundModal || sideSelectionModal || hintModal) return;
        if (mode !== 'MENU') {
            // Only prompt to save if moves were actually made in this session
            if (!ticTacToeGame.isDirty) {
                setMode('MENU');
                return;
            }

            setExitConfirmModal({
                title: 'Save progress and exit?',
                desc: 'If you select Discard, your current session will be lost permanently.',
                onSave: async () => {
                    await handleSave();
                    setExitConfirmModal(null);
                    setMode('MENU');
                },
                onDiscard: async () => {
                    const gameId = GAMES[gameIndex].id;
                    await deleteProgress(gameId);
                    setExitConfirmModal(null);
                    setMode('MENU');
                },
                onCancel: () => setExitConfirmModal(null)
            });
        }
    };

    const handleHint = () => {
        if (gameOverModal || exitConfirmModal || saveFoundModal || sideSelectionModal || hintModal) return;
        
        const description = `Welcome to the Retro Game Hub!

HOW TO PLAY:
- Select a game using LEFT / RIGHT arrows.
- Press ENTER to start or confirm your move.
- If existing progress is found, you can LOAD it or start a NEW game.
- NEW GAME: Choose to play as X (First Move) or O (Second Move).

WIN / LOSS CONDITIONS:
- WIN: Align 3 of your symbols in a row, column, or diagonal.
- DRAW: The grid is full with no winner.
- LOSS: The AI completes a line before you do.

SYSTEM FEATURES:
- SAVE: Use the BACK button mid-game to save your progress.
- LOAD: Load your last session from the sidebar or upon entry.
- RANKINGS: Your wins are automatically added to the global leaderboard!

CONTROLS:
- LEFT / RIGHT: Navigate
- ENTER: Confirm Action
- BACK: Exit / Save
- HINT: Toggle this guide`;
        
        setHintModal({
            title: `Game Hub - Official Guide`,
            description,
            onClose: () => setHintModal(null)
        });
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

            <StatsSidebar 
                activeGame={GAMES[gameIndex]} 
                userStats={stats} 
                lastSaveTime={progressMetadata[GAMES[gameIndex].id] ? new Date(progressMetadata[GAMES[gameIndex].id]).toLocaleString() : 'None'}
                onSave={handleSave}
                onLoad={handleLoad}
            />

            {gameOverModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', 
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '3rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
                        transform: 'scale(1.05)'
                    }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{gameOverModal.title}</h2>
                        <h3 style={{ fontSize: '1.5rem', margin: '1rem 0', color: 'var(--accent-primary)' }}>{gameOverModal.statsText}</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem' }}>
                            <button onClick={gameOverModal.onPlayAgain} className="control-btn enter-btn" style={{flex: 1, padding: '1rem', fontSize: '1.1rem'}}>Play Again</button>
                            <button onClick={gameOverModal.onQuit} className="control-btn action-btn" style={{flex: 1, padding: '1rem', fontSize: '1.1rem'}}>Quit</button>
                        </div>
                    </div>
                </div>
            )}

            {exitConfirmModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', 
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                    }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{exitConfirmModal.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{exitConfirmModal.desc}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={exitConfirmModal.onSave} className="control-btn enter-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>Save and Exit</button>
                            <button onClick={exitConfirmModal.onDiscard} className="control-btn action-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>Exit & Discard Progress</button>
                            <button onClick={exitConfirmModal.onCancel} className="control-btn nav-btn" style={{padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem'}}>Keep Playing</button>
                        </div>
                    </div>
                </div>
            )}

            {saveFoundModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', 
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                    }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Existing Progress Found</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>A saved session exists for this game. Starting a new game will delete the current save.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={saveFoundModal.onLoad} className="control-btn enter-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>Load Saved Game</button>
                            <button onClick={saveFoundModal.onCreateNew} className="control-btn action-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>Start New Game (Delete Save)</button>
                            <button onClick={saveFoundModal.onCancel} className="control-btn nav-btn" style={{padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem'}}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {sideSelectionModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', 
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                    }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Pick Your Side</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>X goes first, O goes second.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => sideSelectionModal.onSelect('X')} className="control-btn enter-btn" style={{flex: 1, padding: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold'}}>PLAY AS X</button>
                            <button onClick={() => sideSelectionModal.onSelect('O')} className="control-btn action-btn" style={{flex: 1, padding: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold'}}>PLAY AS O</button>
                        </div>
                        <button onClick={sideSelectionModal.onCancel} className="control-btn nav-btn" style={{width: '100%', padding: '0.75rem', fontSize: '0.9rem', marginTop: '1.5rem'}}>Cancel</button>
                    </div>
                </div>
            )}

            {hintModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', 
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                    }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{hintModal.title}</h2>
                        <div style={{ 
                            color: 'var(--text-secondary)', 
                            marginBottom: '2rem', 
                            textAlign: 'left',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.6'
                        }}>
                            {hintModal.description}
                        </div>
                        <button onClick={hintModal.onClose} className="control-btn nav-btn" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}}>Close Guide</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHome;

