import { useState } from 'react';
import { COLORS, createGrid, fillRect } from './gameUtils';

const CANVAS_SIZE = 16;
const CANVAS_ORIGIN = { row: 4, col: 2 };

const createCanvas = () => Array.from({ length: CANVAS_SIZE }, () => Array(CANVAS_SIZE).fill(null));

export const useDrawGame = () => {
    const [pixels, setPixels] = useState(createCanvas());
    const [cursor, setCursor] = useState({ row: 0, col: 0 });
    const [mode, setMode] = useState('canvas');
    const [paletteCursor, setPaletteCursor] = useState(0);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [isDirty, setIsDirty] = useState(false);

    const renderGrid = () => {
        const grid = createGrid(COLORS.background);

        COLORS.palette.forEach((color, index) => {
            fillRect(grid, 0, 2 + index * 3, 2, 2, color);

            if (currentColorIndex === index) {
                grid[2][2 + index * 3] = COLORS.neutral;
                grid[2][3 + index * 3] = COLORS.neutral;
            }

            if (mode === 'palette' && paletteCursor === index) {
                grid[0][1 + index * 3] = COLORS.cursor;
                grid[1][1 + index * 3] = COLORS.cursor;
            }
        });

        for (let row = 0; row < CANVAS_SIZE; row += 1) {
            for (let col = 0; col < CANVAS_SIZE; col += 1) {
                grid[CANVAS_ORIGIN.row + row][CANVAS_ORIGIN.col + col] = pixels[row][col] || COLORS.boardMuted;
            }
        }

        if (mode === 'canvas') {
            grid[CANVAS_ORIGIN.row + cursor.row][CANVAS_ORIGIN.col + cursor.col] = COLORS.cursor;
        }

        return grid;
    };

    const handleLeft = () => {
        if (mode === 'palette') {
            setPaletteCursor((current) => (current === 0 ? COLORS.palette.length - 1 : current - 1));
            return;
        }

        setCursor((current) => ({
            ...current,
            col: current.col === 0 ? CANVAS_SIZE - 1 : current.col - 1,
        }));
    };

    const handleRight = () => {
        if (mode === 'palette') {
            setPaletteCursor((current) => (current === COLORS.palette.length - 1 ? 0 : current + 1));
            return;
        }

        setCursor((current) => ({
            ...current,
            col: current.col === CANVAS_SIZE - 1 ? 0 : current.col + 1,
        }));
    };

    const handleUp = () => {
        if (mode === 'palette') {
            return;
        }

        if (cursor.row === 0) {
            setMode('palette');
            return;
        }

        setCursor((current) => ({
            ...current,
            row: current.row - 1,
        }));
    };

    const handleDown = () => {
        if (mode === 'palette') {
            setMode('canvas');
            return;
        }

        setCursor((current) => ({
            ...current,
            row: current.row === CANVAS_SIZE - 1 ? 0 : current.row + 1,
        }));
    };

    const handleEnter = () => {
        if (mode === 'palette') {
            setCurrentColorIndex(paletteCursor);
            return;
        }

        setPixels((current) =>
            current.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                    if (rowIndex !== cursor.row || colIndex !== cursor.col) {
                        return value;
                    }

                    return value === COLORS.palette[currentColorIndex] ? null : COLORS.palette[currentColorIndex];
                })
            )
        );
        setIsDirty(true);
    };

    const reset = () => {
        setPixels(createCanvas());
        setCursor({ row: 0, col: 0 });
        setMode('canvas');
        setPaletteCursor(0);
        setCurrentColorIndex(0);
        setIsDirty(false);
    };

    const getState = () => ({
        pixels,
        cursor,
        mode,
        paletteCursor,
        currentColorIndex,
    });

    const loadState = (state) => {
        if (!state) {
            return;
        }

        setPixels(state.pixels || createCanvas());
        setCursor(state.cursor || { row: 0, col: 0 });
        setMode(state.mode || 'canvas');
        setPaletteCursor(state.paletteCursor || 0);
        setCurrentColorIndex(state.currentColorIndex || 0);
        setIsDirty(true);
    };

    return {
        gridPixels: renderGrid(),
        handleLeft,
        handleRight,
        handleUp,
        handleDown,
        handleEnter,
        reset,
        getState,
        loadState,
        isDirty,
        requiresSideSelection: false,
        instructions:
            'Use the d-pad to move the cursor around the canvas. Move upward from the top row to enter palette mode, choose a color with Enter, then come back down to paint pixels.',
        statusText: mode === 'palette' ? 'Palette mode active. Choose your paint color.' : 'Canvas mode active. Enter paints or erases the current pixel.',
        metaChips: [
            `COLOR ${currentColorIndex + 1}`,
            mode === 'palette' ? 'MODE PALETTE' : 'MODE CANVAS',
            isDirty ? 'STATE DIRTY' : 'STATE FRESH',
        ],
    };
};
