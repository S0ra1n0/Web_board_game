import { useEffect, useRef, useState } from 'react';
import { COLORS, createGrid, fillRect, formatDuration, shuffle } from './gameUtils';

const BOARD_SIZE = 4;
const CELL_SIZE = 4;
const BOARD_ORIGIN = 2;

const createDeck = () => {
    const baseValues = shuffle([...Array(8).keys(), ...Array(8).keys()]);
    return Array.from({ length: BOARD_SIZE }, (_, row) =>
        Array.from({ length: BOARD_SIZE }, (_, col) => baseValues[row * BOARD_SIZE + col])
    );
};

export const useMemoryGame = ({ onGameOver }) => {
    const [deck, setDeck] = useState(createDeck());
    const [revealed, setRevealed] = useState([]);
    const [matched, setMatched] = useState([]);
    const [cursor, setCursor] = useState({ row: 0, col: 0 });
    const [moves, setMoves] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isDirty, setIsDirty] = useState(false);
    const [statusText, setStatusText] = useState('Reveal two cards and remember their colors.');
    const [isResolving, setIsResolving] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);
    const startedAtRef = useRef(Date.now());
    const onGameOverRef = useRef(onGameOver);

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useEffect(() => {
        if (hasEnded) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [hasEnded]);

    useEffect(() => {
        if (hasEnded || matched.length !== BOARD_SIZE * BOARD_SIZE || !matched.length) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setHasEnded(true);
            const score = Math.max(1000 - moves * 25 - elapsedSeconds * 5, 100);
            onGameOverRef.current('WIN', score, elapsedSeconds);
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [elapsedSeconds, hasEnded, matched.length, moves]);

    const moveCursor = (rowStep, colStep) => {
        if (isResolving) {
            return;
        }

        setCursor((current) => ({
            row: (current.row + rowStep + BOARD_SIZE) % BOARD_SIZE,
            col: (current.col + colStep + BOARD_SIZE) % BOARD_SIZE,
        }));
    };

    const handleEnter = () => {
        if (isResolving) {
            return;
        }

        const key = `${cursor.row}-${cursor.col}`;

        if (matched.includes(key) || revealed.includes(key)) {
            return;
        }

        const nextRevealed = [...revealed, key];
        setRevealed(nextRevealed);
        setMoves((current) => current + 1);
        setIsDirty(true);

        if (nextRevealed.length % 2 === 1) {
            setStatusText('Select one more card to check for a match.');
            return;
        }

        const [firstKey, secondKey] = nextRevealed.slice(-2);
        const [firstRow, firstCol] = firstKey.split('-').map(Number);
        const [secondRow, secondCol] = secondKey.split('-').map(Number);

        if (deck[firstRow][firstCol] === deck[secondRow][secondCol]) {
            setMatched((current) => [...current, firstKey, secondKey]);
            setStatusText('Pair matched. Keep going.');
            return;
        }

        setIsResolving(true);
        setStatusText('Mismatch. Cards will flip back.');

        window.setTimeout(() => {
            setRevealed((current) => current.filter((item) => item !== firstKey && item !== secondKey));
            setIsResolving(false);
            setStatusText('Try a different pair.');
        }, 650);
    };

    const renderGrid = () => {
        const grid = createGrid(COLORS.background);

        for (let row = 0; row < BOARD_SIZE; row += 1) {
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                const top = BOARD_ORIGIN + row * CELL_SIZE;
                const left = BOARD_ORIGIN + col * CELL_SIZE;
                const key = `${row}-${col}`;
                const value = deck[row][col];
                const isVisible = revealed.includes(key) || matched.includes(key);
                fillRect(grid, top, left, CELL_SIZE - 1, CELL_SIZE - 1, isVisible ? COLORS.memory[value] : COLORS.boardMuted);

                if (cursor.row === row && cursor.col === col) {
                    fillRect(grid, top, left, CELL_SIZE - 1, 1, COLORS.cursor);
                    fillRect(grid, top, left, 1, CELL_SIZE - 1, COLORS.cursor);
                }
            }
        }

        return grid;
    };

    const reset = () => {
        setDeck(createDeck());
        setRevealed([]);
        setMatched([]);
        setCursor({ row: 0, col: 0 });
        setMoves(0);
        setElapsedSeconds(0);
        setIsDirty(false);
        setStatusText('Reveal two cards and remember their colors.');
        setIsResolving(false);
        setHasEnded(false);
        startedAtRef.current = Date.now();
    };

    const getState = () => ({
        deck,
        revealed,
        matched,
        cursor,
        moves,
        elapsedSeconds,
    });

    const loadState = (state) => {
        if (!state) {
            return;
        }

        setDeck(state.deck || createDeck());
        setRevealed(state.revealed || []);
        setMatched(state.matched || []);
        setCursor(state.cursor || { row: 0, col: 0 });
        setMoves(state.moves || 0);
        setElapsedSeconds(state.elapsedSeconds || 0);
        setIsDirty(true);
        setStatusText('Saved memory board restored.');
        setIsResolving(false);
        setHasEnded(false);
        startedAtRef.current = Date.now() - ((state.elapsedSeconds || 0) * 1000);
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
            'Move around the deck with the d-pad and press Enter to flip a card. Find all matching color pairs to finish the board.',
        statusText,
        metaChips: [
            `PAIRS ${matched.length / 2}/8`,
            `MOVES ${moves}`,
            `TIME ${formatDuration(elapsedSeconds)}`,
        ],
    };
};
