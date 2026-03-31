import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GameMatrix from '../../components/hub/GameMatrix';
import GameControls from '../../components/hub/GameControls';
import { gameService } from '../../services/gameService';
import { usePhysicalControls } from '../../hooks/games/engine/usePhysicalControls';
import { normalizeGameKey } from '../../hooks/games/gameUtils';
import { useTicTacToeGame } from '../../hooks/games/useTicTacToeGame';
import { useCaro5Game } from '../../hooks/games/useCaro5Game';
import { useCaro4Game } from '../../hooks/games/useCaro4Game';
import { useSnakeGame } from '../../hooks/games/useSnakeGame';
import { useMatch3Game } from '../../hooks/games/useMatch3Game';
import { useMemoryGame } from '../../hooks/games/useMemoryGame';
import { useDrawGame } from '../../hooks/games/useDrawGame';

const resolveGameKey = (gameMeta, routeId) => normalizeGameKey(gameMeta?.name || routeId);

const GameRuntimeShell = ({ gameMeta, gameId, useGameHook }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sideSelectionModal, setSideSelectionModal] = useState(null);
    const [exitConfirmModal, setExitConfirmModal] = useState(null);
    const [gameOverModal, setGameOverModal] = useState(null);
    const [hintModal, setHintModal] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleGameOver = async (resultFlag, currentScore = 0, currentDuration = 0) => {
        setIsPlaying(false);

        try {
            await gameService.submitSession(gameId, currentScore, currentDuration);
            await gameService.deleteProgress(gameId);
        } catch (error) {
            console.error('Failed to submit session on game over', error);
        }

        setGameOverModal({
            title: resultFlag === 'DRAW' ? 'Draw' : resultFlag === 'WIN' ? 'Victory!' : 'Defeat',
            statsText: `Score: ${currentScore} | Time: ${currentDuration}s`,
            onPlayAgain: () => {
                setGameOverModal(null);
                startFreshRound();
            },
            onQuit: () => navigate('/hub'),
        });
    };

    const gameInstance = useGameHook({ onGameOver: handleGameOver, gameMeta });

    const startFreshRound = () => {
        if (!gameInstance.requiresSideSelection) {
            gameInstance.reset();
            setIsPlaying(true);
            return;
        }

        setSideSelectionModal({
            onSelect: (side) => {
                gameInstance.reset(side);
                setIsPlaying(true);
                setSideSelectionModal(null);
            },
            onCancel: () => navigate('/hub'),
        });
    };

    useEffect(() => {
        const initGame = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const shouldLoad = queryParams.get('load') === 'true';

                if (shouldLoad) {
                    try {
                        const save = await gameService.loadProgress(gameId);

                        if (save && save.state) {
                            gameInstance.loadState(save.state);
                            await gameService.deleteProgress(gameId);
                            setIsPlaying(true);
                            return;
                        }
                    } catch (error) {
                        if (error.status !== 404) {
                            throw error;
                        }
                    }

                    if (!gameInstance.isDirty) {
                        startFreshRound();
                    }
                } else {
                    startFreshRound();
                }
            } catch (error) {
                console.error('Failed to initialize game runtime', error);
                navigate('/hub');
            }
        };

        initGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameId, location.search]);

    const handleLeft = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleLeft?.();
    };

    const handleRight = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleRight?.();
    };

    const handleUp = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleUp?.();
    };

    const handleDown = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) gameInstance.handleDown?.();
    };

    const handleEnter = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;
        if (isPlaying) {
            gameInstance.handleEnter?.();
        }
    };

    const handleBack = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;

        if (!gameInstance.isDirty) {
            navigate('/hub');
            return;
        }

        setExitConfirmModal({
            title: 'Save progress and exit?',
            desc: 'If you discard now, the current run will be lost.',
            onSave: async () => {
                await gameService.saveProgress(gameId, gameInstance.getState());
                navigate('/hub');
            },
            onDiscard: async () => {
                await gameService.deleteProgress(gameId);
                navigate('/hub');
            },
            onCancel: () => setExitConfirmModal(null),
        });
    };

    const handleHint = () => {
        if (gameOverModal || exitConfirmModal || sideSelectionModal || hintModal) return;

        setHintModal({
            title: `${gameMeta?.name || 'Game'} Guide`,
            description:
                `${gameInstance.instructions}\n\n` +
                `Score Type: ${gameMeta?.score_type}\n` +
                `Board Size: ${gameMeta?.board_size}\n` +
                `Default Timer: ${gameMeta?.default_timer || 0}s`,
            onClose: () => setHintModal(null),
        });
    };

    usePhysicalControls(
        {
            onLeft: handleLeft,
            onRight: handleRight,
            onUp: handleUp,
            onDown: handleDown,
            onEnter: handleEnter,
            onBack: handleBack,
            onHint: handleHint,
        },
        true
    );

    return (
        <div className="video-hub-shell">
            <div className="video-stage">
                <GameMatrix gridPixels={gameInstance.gridPixels} showSideIndicators={false} />

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

                <div className="video-stage-caption">
                    {isPlaying ? gameInstance.statusText : 'START A ROUND OR LOAD A SAVE TO PLAY'}
                </div>
                <div className="video-stage-meta">
                    <span className="video-meta-chip">{gameMeta.name}</span>
                    {(gameInstance.metaChips || []).map((chip) => (
                        <span key={chip} className="video-meta-chip">{chip}</span>
                    ))}
                </div>
            </div>

            {sideSelectionModal && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <div className="glass-panel" style={modalCardStyle}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Pick Your Side</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => sideSelectionModal.onSelect('X')}
                                className="control-btn enter-btn"
                                style={largeButtonStyle}
                            >
                                PLAY AS X
                            </button>
                            <button
                                onClick={() => sideSelectionModal.onSelect('O')}
                                className="control-btn action-btn"
                                style={largeButtonStyle}
                            >
                                PLAY AS O
                            </button>
                        </div>
                        <button onClick={sideSelectionModal.onCancel} className="control-btn nav-btn" style={fullWidthButtonStyle}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {exitConfirmModal && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <div className="glass-panel" style={modalCardStyle}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{exitConfirmModal.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{exitConfirmModal.desc}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={exitConfirmModal.onSave} className="control-btn enter-btn" style={stackButtonStyle}>
                                Save and Exit
                            </button>
                            <button onClick={exitConfirmModal.onDiscard} className="control-btn action-btn" style={stackButtonStyle}>
                                Exit and Discard Progress
                            </button>
                            <button onClick={exitConfirmModal.onCancel} className="control-btn nav-btn" style={smallButtonStyle}>
                                Keep Playing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {gameOverModal && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <div className="glass-panel" style={{ ...modalCardStyle, padding: '3rem' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{gameOverModal.title}</h2>
                        <h3 style={{ fontSize: '1.5rem', margin: '1rem 0', color: 'var(--accent-primary)' }}>
                            {gameOverModal.statsText}
                        </h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem' }}>
                            <button onClick={gameOverModal.onPlayAgain} className="control-btn enter-btn" style={flexButtonStyle}>
                                Play Again
                            </button>
                            <button onClick={gameOverModal.onQuit} className="control-btn action-btn" style={flexButtonStyle}>
                                Quit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {hintModal && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <div className="glass-panel" style={modalCardStyle}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{hintModal.title}</h2>
                        <div
                            style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '2rem',
                                textAlign: 'left',
                                whiteSpace: 'pre-line',
                                lineHeight: '1.6',
                            }}
                        >
                            {hintModal.description}
                        </div>
                        <button onClick={hintModal.onClose} className="control-btn nav-btn" style={fullWidthButtonStyle}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--modal-overlay-bg)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalCardStyle = {
    textAlign: 'center',
    background: 'var(--bg-primary)',
    padding: '2.5rem',
    borderRadius: '24px',
};

const largeButtonStyle = {
    padding: '1.5rem',
    fontSize: '1.5rem',
};

const stackButtonStyle = {
    padding: '1rem',
    fontSize: '1.1rem',
};

const smallButtonStyle = {
    padding: '0.75rem',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
};

const fullWidthButtonStyle = {
    width: '100%',
    marginTop: '1.5rem',
    padding: '1rem',
    fontSize: '1.1rem',
};

const flexButtonStyle = {
    flex: 1,
    padding: '1rem',
    fontSize: '1.1rem',
};

const TicTacToeRuntime = (props) => <GameRuntimeShell {...props} useGameHook={useTicTacToeGame} />;
const Caro5Runtime = (props) => <GameRuntimeShell {...props} useGameHook={useCaro5Game} />;
const Caro4Runtime = (props) => <GameRuntimeShell {...props} useGameHook={useCaro4Game} />;
const SnakeRuntime = (props) => <GameRuntimeShell {...props} useGameHook={useSnakeGame} />;
const Match3Runtime = (props) => <GameRuntimeShell {...props} useGameHook={useMatch3Game} />;
const MemoryRuntime = (props) => <GameRuntimeShell {...props} useGameHook={useMemoryGame} />;
const DrawRuntime = (props) => <GameRuntimeShell {...props} useGameHook={useDrawGame} />;

const GAME_RUNTIME_COMPONENTS = {
    TICTACTOE: TicTacToeRuntime,
    CARO5: Caro5Runtime,
    CARO4: Caro4Runtime,
    SNAKE: SnakeRuntime,
    MATCH3: Match3Runtime,
    MEMORY: MemoryRuntime,
    FREEDRAW: DrawRuntime,
};

const GamePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [gameMeta, setGameMeta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchMeta = async () => {
            try {
                const meta = await gameService.getGameById(id);
                setGameMeta(meta);
            } catch (error) {
                console.error('Failed to fetch game metadata', error);
                navigate('/hub');
            } finally {
                setLoading(false);
            }
        };

        fetchMeta();
    }, [id, navigate, token]);

    const gameKey = useMemo(() => resolveGameKey(gameMeta, id), [gameMeta, id]);
    const RuntimeComponent = GAME_RUNTIME_COMPONENTS[gameKey];

    if (loading || !gameMeta) {
        return <div className="video-stage-caption">LOADING GAME ASSETS...</div>;
    }

    if (!RuntimeComponent) {
        return (
            <div className="video-hub-shell">
                <div className="video-stage-caption" style={{ color: 'red' }}>
                    GAME HOOK MISSING FOR {gameMeta.name}
                </div>
                <button onClick={() => navigate('/hub')} className="control-btn nav-btn">BACK TO HUB</button>
            </div>
        );
    }

    return <RuntimeComponent key={`${gameKey}-${id}`} gameMeta={gameMeta} gameId={id} />;
};

export default GamePage;
