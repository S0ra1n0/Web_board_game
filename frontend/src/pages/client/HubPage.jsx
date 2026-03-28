import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GameMatrix from '../../components/hub/GameMatrix';
import GameControls from '../../components/hub/GameControls';
import { getCaroArt, getTicTacToeArt, getMemoryArt, getDrawArt } from '../../utils/pixelArt';
import { gameService } from '../../services/gameService';
import { usePhysicalControls } from '../../hooks/games/engine/usePhysicalControls';

// Fallback art mapping if backend id matches
const ART_MAP = {
    'CARO': getCaroArt,
    'TICTACTOE': getTicTacToeArt,
    'MEMORY': getMemoryArt,
    'DRAW': getDrawArt
};

const HubPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [games, setGames] = useState([]);
    const [gameIndex, setGameIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [saveFoundModal, setSaveFoundModal] = useState(null);
    const [hintModal, setHintModal] = useState(null);
    const [saveMetaMap, setSaveMetaMap] = useState({}); // mapped by game.id

    useEffect(() => {
        if (!token) return;
        const fetchHubData = async () => {
            try {
                const dbGames = await gameService.getAllGames();
                // Merge db metadata with frontend pixel arts
                const merged = dbGames.map(g => ({
                    ...g,
                    render: ART_MAP[g.id] || getDrawArt // fallback
                }));
                // Sort by ID or whatever, or just keep as is
                setGames(merged);
                
                // Fetch saved games meta
                const meta = {};
                for (const g of dbGames) {
                    try {
                        const save = await gameService.loadProgress(g.id);
                        if (save && save.savedAt) {
                            meta[g.id] = save.savedAt;
                        }
                    } catch (e) {
                         // ignore 404
                    }
                }
                setSaveMetaMap(meta);
            } catch (err) {
                console.error('Failed to load hub data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHubData();
    }, [token]);

    const activeGame = games[gameIndex];

    const handleLeft = () => {
        if (saveFoundModal || hintModal) return;
        if (games.length === 0) return;
        setGameIndex(prev => (prev === 0 ? games.length - 1 : prev - 1));
    };

    const handleRight = () => {
        if (saveFoundModal || hintModal) return;
        if (games.length === 0) return;
        setGameIndex(prev => (prev === games.length - 1 ? 0 : prev + 1));
    };

    const handleEnter = () => {
        if (saveFoundModal || hintModal || !activeGame) return;
        
        // Block unavailable ones if you want, but assume all from backend are available unless flagged
        if (activeGame.enabled === false) {
            return;
        }

        if (saveMetaMap[activeGame.id]) {
            setSaveFoundModal({
                gameId: activeGame.id,
                onLoad: () => {
                    navigate(`/games/${activeGame.id}?load=true`);
                },
                onCreateNew: async () => {
                    await gameService.deleteProgress(activeGame.id);
                    navigate(`/games/${activeGame.id}`);
                },
                onCancel: () => setSaveFoundModal(null)
            });
            return;
        }

        navigate(`/games/${activeGame.id}`);
    };

    const handleBack = () => {
        // Log out or back to profile? Usually back does nothing here
    };

    const handleHint = () => {
        if (saveFoundModal || hintModal || !activeGame) return;
        setHintModal({
            title: `Welcome to Web Board Game Hub`,
            description: `USE LEFT / RIGHT ARROWS to browse games.\nPRESS ENTER to select a game.\nPRESS HINT or H to close this dialog.`,
            onClose: () => setHintModal(null)
        });
    };

    usePhysicalControls({
        onLeft: handleLeft,
        onRight: handleRight,
        onEnter: handleEnter,
        onBack: handleBack,
        onHint: handleHint
    }, true);

    if (loading) {
        return <div className="video-stage-caption">LOADING HUB...</div>;
    }

    if (games.length === 0) {
        return <div className="video-stage-caption">NO GAMES FOUND</div>;
    }

    const currentSaveText = saveMetaMap[activeGame.id]
        ? new Date(saveMetaMap[activeGame.id]).toLocaleString()
        : 'No save';

    // Ensure we don't crash if activeGame.enabled doesn't exist. Fallback to boolean check
    const isAvailable = activeGame.enabled !== false; 

    return (
        <div className="video-hub-shell">
            <div className="video-stage">
                <GameMatrix
                    gridPixels={activeGame.render()}
                    showSideIndicators={true}
                />

                <GameControls 
                    onLeft={handleLeft}
                    onRight={handleRight}
                    onEnter={handleEnter}
                    onBack={handleBack}
                    onHint={handleHint}
                    showDirectionalPad={false}
                />

                <div className="video-stage-caption">SELECT GAME (LEFT/RIGHT -{">"} ENTER)</div>

                <div className="video-stage-meta">
                    <span className="video-meta-chip">{activeGame.name || activeGame.title}</span>
                    <span className={`video-meta-chip ${isAvailable ? 'video-meta-chip-success' : 'video-meta-chip-danger'}`}>
                        {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                    <span className="video-meta-chip">SAVE: {currentSaveText}</span>
                </div>
            </div>

            {/* MODALS */}
            {saveFoundModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'var(--modal-overlay-bg)', backdropFilter: 'blur(8px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                    }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Existing Progress Found</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>A saved session exists for this game.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={saveFoundModal.onLoad} className="control-btn enter-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>Load Saved Game</button>
                            <button onClick={saveFoundModal.onCreateNew} className="control-btn action-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>Start New Game (Delete Save)</button>
                            <button onClick={saveFoundModal.onCancel} className="control-btn nav-btn" style={{padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem'}}>Cancel</button>
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
                    <div className="glass-panel" style={{ 
                        textAlign: 'center', background: 'var(--bg-primary)', 
                        minWidth: '450px', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                    }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{hintModal.title}</h2>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'left', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                            {hintModal.description}
                        </div>
                        <button onClick={hintModal.onClose} className="control-btn nav-btn" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}}>Close Guide</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HubPage;
