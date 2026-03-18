import React from 'react';

const GameControls = ({ onLeft, onRight, onEnter, onBack, onHint }) => {
    return (
        <div className="game-controls glass-panel">
            <button onClick={onLeft} className="control-btn nav-btn">◀ Left</button>
            <button onClick={onRight} className="control-btn nav-btn">Right ▶</button>
            <button onClick={onEnter} className="control-btn enter-btn">ENTER</button>
            <button onClick={onBack} className="control-btn action-btn">BACK</button>
            <button onClick={onHint} className="control-btn action-btn">HINT</button>
        </div>
    );
};

export default GameControls;
