import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GameMatrix from '../../components/hub/GameMatrix';
import GameControls from '../../components/hub/GameControls';
import { gameService } from '../../services/gameService';
import { usePhysicalControls } from '../../hooks/games/engine/usePhysicalControls';
import { useTicTacToe } from '../../hooks/useTicTacToe'; // the only one available for now

// A registry of game hooks for Member 4 to plug their games into.
const GAME_HOOKS_REGISTRY = {
    'TICTACTOE': useTicTacToe,
    // 'CARO': useCaro5Game,
    // ...
};

const GRID_SIZE = 20;

const GamePage = () => {
    const { id } = useParams(); // game ID
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const [gameMeta, setGameMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // UI Modals
    const [sideSelectionModal, setSideSelectionModal] = useState(null);
    const [exitConfirmModal, setExitConfirmModal] = useState(null);
    const [gameOverModal, setGameOverModal] = useState(null);
    const [hintModal, setHintModal] = useState(null);

    // Global "Playing" State
    const [isPlaying, setIsPlaying] = useState(false);

    // Common Game Over callback
    const handleGameOver = async (resultFlag, currentScore = 0, currentDuration = 0) => {
        setIsPlaying(false);

        // Submits session data to ranking
        try {
            await gameService.submitSession(id, currentScore, currentDuration);
            // Delete save if game ends naturally
            await gameService.deleteProgress(id);
        } catch (e) {
            console.error('Failed to submit session on gameover', e);
        }

        setGameOverModal({
            title: resultFlag === 'DRAW' ? 'Draw' : resultFlag === 'WIN' ? 'Victory!' : 'Defeat',
            statsText: `Score: ${currentScore} | Time: ${currentDuration}s`,
            onPlayAgain: () => {
                setGameOverModal(null);
                triggerSideSelection();
            },
            onQuit: () => {
                navigate('/hub');
            }
        });
    };

    // Instantiate game hook dynamically
    const useActiveGameHook = GAME_HOOKS_REGISTRY[id];
    
    // If hook is missing, provide a fallback mock hook to prevent crash
    const gameInstance = useActiveGameHook 
        ? useActiveGameHook({ onGameOver: handleGameOver }) 
        : {
            gridPixels: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('#222')),
            handleLeft: () => {}, handleRight: () => {}, handleEnter: () => {},
            handleUp: () => {}, handleDown: () => {},
            reset: () => {}, getState: () => ({}), loadState: () => {}, isDirty: false
        };

    const triggerSideSelection = () => {
        setSideSelectionModal({
            onSelect: (side) => {
                gameInstance.reset(side);
                setIsPlaying(true);
                setSideSelectionModal(null);
            },
            onCancel: () => {
                navigate('/hub');
            }
        });
    };

    useEffect(() => {
        if (!token) return;
        const initGame = async () => {
            try {
                const meta = await gameService.getGameById(id);
                setGameMeta(meta);

                const queryParams = new URLSearchParams(location.search);
                const shouldLoad = queryParams.get('load') === 'true';

                if (shouldLoad) {
                    const save = await gameService.loadProgress(id);
                    if (save && save.state) {
                        gameInstance.loadState(save.state);
                        await gameService.deleteProgress(id);
                        setIsPlaying(true);
                    } else {
                        triggerSideSelection();
                    }
                } else {
                    triggerSideSelection();
                }
            } catch (err) {
                console.error('Failed to init game', err);
                navigate('/hub'); // fallback
            } finally {
                setLoading(false);
            }
        };
        initGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, token, location.search]); // Run once mostly

    // Physical Controls Mapping
    const handleLeft = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleLeft();
    };

    const handleRight = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleRight();
    };

    const handleUp = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying && gameInstance.handleUp) gameInstance.handleUp();
    };

    const handleDown = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying && gameInstance.handleDown) gameInstance.handleDown();
    };

    const handleEnter = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleEnter();
    };

    const handleBack = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        
        if (!gameInstance.isDirty) {
            navigate('/hub');
            return;
        }

        setExitConfirmModal({
            title: 'Save progress and exit?',
            desc: 'If you select Discard, your current session will be lost permanently.',
            onSave: async () => {
                const state = gameInstance.getState();
                await gameService.saveProgress(id, state);
                navigate('/hub');
            },
            onDiscard: async () => {
                await gameService.deleteProgress(id);
                navigate('/hub');
            },
            onCancel: () => setExitConfirmModal(null)
        });
    };

    const handleHint = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        setHintModal({
            title: `${gameMeta?.name || 'Game'} Guide`,
            description: `USE DIRECTIONAL ARROWS to navigate.\nPRESS ENTER to confirm.\nPRESS BACK or ESC to Pause/Save.\n\nScore Type: ${gameMeta?.score_type}\nBoard Size: ${gameMeta?.board_size}`,
            onClose: () => setHintModal(null)
        });
    };

    usePhysicalControls({
        onLeft: handleLeft,
        onRight: handleRight,
        onUp: handleUp,
        onDown: handleDown,
        onEnter: handleEnter,
        onBack: handleBack,
        onHint: handleHint
    }, true);

    if (loading || !gameMeta) {
        return <div className="video-stage-caption">LOADING GAME ASSETS...</div>;
    }

    if (!GAME_HOOKS_REGISTRY[id]) {
        return (
            <div className="video-hub-shell">
                <div className="video-stage-caption" style={{color: 'red'}}>
                    NOT IMPLEMENTED YET. WAITING FOR MEMBER 4.
                </div>
                <button onClick={() => navigate('/hub')} className="control-btn nav-btn">BACK TO HUB</button>
            </div>
        );
    }

    return (
        <div className="video-hub-shell">
            <div className="video-stage">
                <GameMatrix
                    gridPixels={gameInstance.gridPixels}
                    showSideIndicators={false}
                />

                <GameControls 
                    onLeft={handleLeft}
                    onRight={handleRight}
                    onUp={handleUp}
                    onDown={handleDown}
                    onEnter={handleEnter}
                    onBack={handleBack}
                    onHint={handleHint}
                    showDirectionalPad={true}
                />

                <div className="video-stage-caption">MOVE (ARROWS) - CONFIRM (ENTER) - PAUSE (BACK)</div>
                <div className="video-stage-meta">
                    <span className="video-meta-chip">{gameMeta.name}</span>
                </div>
            </div>

            {/* MODALS */}
            {sideSelectionModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', backdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ textAlign: 'center', background: 'var(--bg-primary)', padding: '2.5rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Pick Your Side</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button onClick={() => sideSelectionModal.onSelect('X')} className="control-btn enter-btn" style={{padding: '1.5rem', fontSize: '1.5rem'}}>PLAY AS X</button>
                            <button onClick={() => sideSelectionModal.onSelect('O')} className="control-btn action-btn" style={{padding: '1.5rem', fontSize: '1.5rem'}}>PLAY AS O</button>
                        </div>
                        <button onClick={sideSelectionModal.onCancel} className="control-btn nav-btn" style={{width: '100%', marginTop: '1.5rem'}}>Cancel</button>
                    </div>
                </div>
            )}

            {exitConfirmModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', backdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ textAlign: 'center', background: 'var(--bg-primary)', padding: '2.5rem', borderRadius: '24px' }}>
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

            {gameOverModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', backdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ textAlign: 'center', background: 'var(--bg-primary)', padding: '3rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{gameOverModal.title}</h2>
                        <h3 style={{ fontSize: '1.5rem', margin: '1rem 0', color: 'var(--accent-primary)' }}>{gameOverModal.statsText}</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem' }}>
                            <button onClick={gameOverModal.onPlayAgain} className="control-btn enter-btn" style={{flex: 1, padding: '1rem', fontSize: '1.1rem'}}>Play Again</button>
                            <button onClick={gameOverModal.onQuit} className="control-btn action-btn" style={{flex: 1, padding: '1rem', fontSize: '1.1rem'}}>Quit</button>
                        </div>
                    </div>
                </div>
            )}

            {hintModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', backdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ textAlign: 'center', background: 'var(--bg-primary)', padding: '2.5rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{hintModal.title}</h2>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'left', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                            {hintModal.description}
                        </div>
                        <button onClick={hintModal.onClose} className="control-btn nav-btn" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GamePage;
