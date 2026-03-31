import { useEffect, useRef, useState } from 'react';
import { COLORS, createGrid, fillRect, formatDuration } from './gameUtils';

const BOARD_SIZE = 6;
const CELL_SIZE = 3;
const BOARD_ORIGIN = 1;
const TOTAL_TIME = 90;

const createRandomTile = () => Math.floor(Math.random() * COLORS.match3.length);

const createBoard = () => {
    const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

    for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            let nextValue = createRandomTile();

            while (
                (col >= 2 && board[row][col - 1] === nextValue && board[row][col - 2] === nextValue) ||
                (row >= 2 && board[row - 1][col] === nextValue && board[row - 2][col] === nextValue)
            ) {
                nextValue = createRandomTile();
            }

            board[row][col] = nextValue;
        }
    }

    return board;
};

const collectMatches = (board) => {
    const matches = new Set();

    for (let row = 0; row < BOARD_SIZE; row += 1) {
        let runLength = 1;

        for (let col = 1; col <= BOARD_SIZE; col += 1) {
            if (col < BOARD_SIZE && board[row][col] === board[row][col - 1]) {
                runLength += 1;
                continue;
            }

            if (runLength >= 3) {
                for (let offset = 0; offset < runLength; offset += 1) {
                    matches.add(`${row}-${col - 1 - offset}`);
                }
            }

            runLength = 1;
        }
    }

    for (let col = 0; col < BOARD_SIZE; col += 1) {
        let runLength = 1;

        for (let row = 1; row <= BOARD_SIZE; row += 1) {
            if (row < BOARD_SIZE && board[row][col] === board[row - 1][col]) {
                runLength += 1;
                continue;
            }

            if (runLength >= 3) {
                for (let offset = 0; offset < runLength; offset += 1) {
                    matches.add(`${row - 1 - offset}-${col}`);
                }
            }

            runLength = 1;
        }
    }

    return [...matches].map((key) => key.split('-').map(Number));
};

const applyGravity = (board) => {
    const nextBoard = board.map((row) => [...row]);

    for (let col = 0; col < BOARD_SIZE; col += 1) {
        const nextColumn = [];

        for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
            if (nextBoard[row][col] !== null) {
                nextColumn.push(nextBoard[row][col]);
            }
        }

        while (nextColumn.length < BOARD_SIZE) {
            nextColumn.push(createRandomTile());
        }

        for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
            nextBoard[row][col] = nextColumn[BOARD_SIZE - 1 - row];
        }
    }

    return nextBoard;
};

const resolveBoard = (board) => {
    let nextBoard = board.map((row) => [...row]);
    let totalMatches = 0;
    let matches = collectMatches(nextBoard);

    while (matches.length) {
        totalMatches += matches.length;
        matches.forEach(([row, col]) => {
            nextBoard[row][col] = null;
        });

        nextBoard = applyGravity(nextBoard);
        matches = collectMatches(nextBoard);
    }

    return {
        board: nextBoard,
        scoreGain: totalMatches * 15,
    };
};

const areAdjacent = (first, second) =>
    Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1;

export const useMatch3Game = ({ onGameOver }) => {
    const [board, setBoard] = useState(createBoard());
    const [cursor, setCursor] = useState({ row: 0, col: 0 });
    const [selectedCell, setSelectedCell] = useState(null);
    const [score, setScore] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME);
    const [isDirty, setIsDirty] = useState(false);
    const [statusText, setStatusText] = useState('Create swaps that form groups of three or more.');
    const [hasEnded, setHasEnded] = useState(false);
    const onGameOverRef = useRef(onGameOver);

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useEffect(() => {
        if (hasEnded) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setSecondsLeft((current) => {
                if (current <= 1) {
                    window.clearInterval(timerId);
                    setHasEnded(true);
                    onGameOverRef.current(score > 0 ? 'WIN' : 'DEFEAT', score, TOTAL_TIME);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [hasEnded, score]);

    const moveCursor = (rowStep, colStep) => {
        if (hasEnded) {
            return;
        }

        setCursor((current) => ({
            row: (current.row + rowStep + BOARD_SIZE) % BOARD_SIZE,
            col: (current.col + colStep + BOARD_SIZE) % BOARD_SIZE,
        }));
    };

    const handleEnter = () => {
        if (hasEnded) {
            return;
        }

        if (!selectedCell) {
            setSelectedCell(cursor);
            setStatusText('Select an adjacent tile to attempt a swap.');
            return;
        }

        if (selectedCell.row === cursor.row && selectedCell.col === cursor.col) {
            setSelectedCell(null);
            setStatusText('Selection cleared.');
            return;
        }

        if (!areAdjacent(selectedCell, cursor)) {
            setSelectedCell(cursor);
            setStatusText('Tiles must be adjacent. New source tile selected.');
            return;
        }

        const nextBoard = board.map((row) => [...row]);
        [nextBoard[selectedCell.row][selectedCell.col], nextBoard[cursor.row][cursor.col]] = [
            nextBoard[cursor.row][cursor.col],
            nextBoard[selectedCell.row][selectedCell.col],
        ];

        const matches = collectMatches(nextBoard);

        if (!matches.length) {
            setSelectedCell(null);
            setStatusText('No match formed. Swap reverted.');
            return;
        }

        const resolved = resolveBoard(nextBoard);
        setBoard(resolved.board);
        setScore((current) => current + resolved.scoreGain);
        setSelectedCell(null);
        setIsDirty(true);
        setStatusText(`Combo scored for ${resolved.scoreGain} points.`);
    };

    const renderGrid = () => {
        const grid = createGrid(COLORS.background);

        for (let row = 0; row < BOARD_SIZE; row += 1) {
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                const top = BOARD_ORIGIN + row * CELL_SIZE;
                const left = BOARD_ORIGIN + col * CELL_SIZE;
                fillRect(grid, top, left, CELL_SIZE - 1, CELL_SIZE - 1, COLORS.match3[board[row][col]]);

                if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
                    fillRect(grid, top, left, CELL_SIZE - 1, 1, COLORS.neutral);
                    fillRect(grid, top, left, 1, CELL_SIZE - 1, COLORS.neutral);
                } else if (cursor.row === row && cursor.col === col) {
                    fillRect(grid, top, left, CELL_SIZE - 1, 1, COLORS.cursor);
                    fillRect(grid, top, left, 1, CELL_SIZE - 1, COLORS.cursor);
                }
            }
        }

        return grid;
    };

    const reset = () => {
        setBoard(createBoard());
        setCursor({ row: 0, col: 0 });
        setSelectedCell(null);
        setScore(0);
        setSecondsLeft(TOTAL_TIME);
        setIsDirty(false);
        setHasEnded(false);
        setStatusText('Create swaps that form groups of three or more.');
    };

    const getState = () => ({
        board,
        cursor,
        selectedCell,
        score,
        secondsLeft,
    });

    const loadState = (state) => {
        if (!state) {
            return;
        }

        setBoard(state.board || createBoard());
        setCursor(state.cursor || { row: 0, col: 0 });
        setSelectedCell(state.selectedCell || null);
        setScore(state.score || 0);
        setSecondsLeft(state.secondsLeft || TOTAL_TIME);
        setIsDirty(true);
        setHasEnded(false);
        setStatusText('Saved puzzle state restored.');
    };

    return {
        gridPixels: renderGrid(),
        handleLeft: () => moveCursor(0, -1),
        handleRight: () => moveCursor(0, 1),
        handleUp: () => moveCursor(-1, 0),
        handleDown: () => moveCursor(1, 0),
        handleEnter,
        reset,
        getState,
        loadState,
        isDirty,
        requiresSideSelection: false,
        instructions:
            'Use the d-pad to position the cursor. Press Enter once to select a tile and again on an adjacent tile to swap. Make lines of three or more before time runs out.',
        statusText,
        metaChips: [
            `SCORE ${score}`,
            `LEFT ${formatDuration(secondsLeft)}`,
            selectedCell ? 'STATE SWAP' : 'STATE MOVE',
        ],
    };
};
