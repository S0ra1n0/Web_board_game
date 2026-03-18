import React from 'react';

const GameMatrix = ({ gridPixels }) => {
    // gridPixels is expected to be a 2D array of color strings, e.g., 20x20
    if (!gridPixels || gridPixels.length === 0) return null;

    return (
        <div className="game-matrix-container glass-panel">
            <div className="game-matrix">
                {gridPixels.map((row, rIdx) => (
                    <div key={rIdx} className="matrix-row">
                        {row.map((color, cIdx) => (
                            <div 
                                key={`${rIdx}-${cIdx}`} 
                                className="matrix-dot" 
                                style={{ 
                                    backgroundColor: color || 'var(--matrix-off)',
                                    boxShadow: color ? `0 0 8px ${color}` : 'none'
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameMatrix;
