import { useEffect, useRef, useState } from 'react';
import { COLORS, createGrid, formatDuration } from './gameUtils';

const BOARD_SIZE = 10;
const CELL_SIZE = 2;

const createBoard = () => Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

const hasLine = (board, row, col, targetLength) => {
    const symbol = board[row][col];

    if (!symbol) {
        return false;
    }

    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ];

    return directions.some(([rowStep, colStep]) => {
        let total = 1;

        for (const direction of [-1, 1]) {
            let nextRow = row + rowStep * direction;
            let nextCol = col + colStep * direction;

            while (
                nextRow >= 0 &&
                nextRow < BOARD_SIZE &&
                nextCol >= 0 &&
                nextCol < BOARD_SIZE &&
                board[nextRow][nextCol] === symbol
            ) {
                total += 1;
                nextRow += rowStep * direction;
                nextCol += colStep * direction;
            }
        }

        return total >= targetLength;
    });
};

export const useCaroBaseGame = ({ onGameOver, targetLength, title }) => {
    const [board, setBoard] = useState(createBoard());
    const [cursor, setCursor] = useState({ row: 4, col: 4 });
    const [playerSide, setPlayerSide] = useState('X');
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const startedAtRef = useRef(Date.now());
    const onGameOverRef = useRef(onGameOver);

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useEffect(() => {
        if (!isDirty || winner) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isDirty, winner]);

    useEffect(() => {
        if (!winner) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            const result = winner === 'DRAW' ? 'DRAW' : winner === playerSide ? 'WIN' : 'DEFEAT';
            const score = result === 'WIN' ? 150 : result === 'DRAW' ? 75 : 0;
            onGameOverRef.current(result, score, elapsedSeconds);
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [elapsedSeconds, playerSide, winner]);

    const getAvailableMoves = (currentBoard) => {
        const moves = [];

        currentBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === null) {
                    moves.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        return moves;
    };

    const evaluateBoard = (currentBoard, latestMove) => {
        if (latestMove && hasLine(currentBoard, latestMove.row, latestMove.col, targetLength)) {
            return currentBoard[latestMove.row][latestMove.col];
        }

        return getAvailableMoves(currentBoard).length ? null : 'DRAW';
    };

    const triggerAiMove = (currentBoard, aiSide) => {
        window.setTimeout(() => {
            const availableMoves = getAvailableMoves(currentBoard);

            if (!availableMoves.length || evaluateBoard(currentBoard)) {
                return;
            }

            const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            const nextBoard = currentBoard.map((row) => [...row]);
            nextBoard[move.row][move.col] = aiSide;
            setBoard(nextBoard);

            const result = evaluateBoard(nextBoard, move);

            if (result) {
                setWinner(result);
                return;
            }

            setIsPlayerTurn(true);
        }, 350);
    };

    const moveCursor = (rowStep, colStep) => {
        if (!isPlayerTurn || winner) {
            return;
        }

        setCursor((current) => ({
            row: (current.row + rowStep + BOARD_SIZE) % BOARD_SIZE,
            col: (current.col + colStep + BOARD_SIZE) % BOARD_SIZE,
        }));
    };

    const handleEnter = () => {
        if (!isPlayerTurn || winner || board[cursor.row][cursor.col] !== null) {
            return;
        }

        const nextBoard = board.map((row) => [...row]);
        nextBoard[cursor.row][cursor.col] = playerSide;
        setBoard(nextBoard);
        setIsDirty(true);
        setIsPlayerTurn(false);

        const result = evaluateBoard(nextBoard, cursor);

        if (result) {
            setWinner(result);
            return;
        }

        triggerAiMove(nextBoard, playerSide === 'X' ? 'O' : 'X');
    };

    const renderGrid = () => {
        const grid = createGrid(COLORS.background);

        for (let row = 0; row < BOARD_SIZE; row += 1) {
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                const top = row * CELL_SIZE;
                const left = col * CELL_SIZE;
                const value = board[row][col];
                const baseColor = value === 'X' ? COLORS.player : value === 'O' ? COLORS.ai : COLORS.boardMuted;

                for (let innerRow = 0; innerRow < CELL_SIZE; innerRow += 1) {
                    for (let innerCol = 0; innerCol < CELL_SIZE; innerCol += 1) {
                        grid[top + innerRow][left + innerCol] = baseColor;
                    }
                }

                if (cursor.row === row && cursor.col === col && isPlayerTurn && !winner && value === null) {
                    grid[top][left] = COLORS.cursor;
                    grid[top][left + 1] = COLORS.cursor;
                    grid[top + 1][left] = COLORS.cursor;
                    grid[top + 1][left + 1] = COLORS.cursor;
                }
            }
        }

        return grid;
    };

    const reset = (preferredSide = 'X') => {
        setBoard(createBoard());
        setCursor({ row: 4, col: 4 });
        setPlayerSide(preferredSide);
        setWinner(null);
        setIsDirty(false);
        setElapsedSeconds(0);
        startedAtRef.current = Date.now();

        if (preferredSide === 'X') {
            setIsPlayerTurn(true);
            return;
        }

        setIsPlayerTurn(false);
        triggerAiMove(createBoard(), 'X');
    };

    const getState = () => ({
        board,
        cursor,
        playerSide,
        isPlayerTurn,
        elapsedSeconds,
    });

    const loadState = (state) => {
        if (!state) {
            return;
        }

        setBoard(state.board || createBoard());
        setCursor(state.cursor || { row: 4, col: 4 });
        setPlayerSide(state.playerSide || 'X');
        setIsPlayerTurn(state.isPlayerTurn !== false);
        setElapsedSeconds(state.elapsedSeconds || 0);
        setWinner(null);
        setIsDirty(true);
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
        requiresSideSelection: true,
        instructions: `${title} uses the full d-pad. Move the cursor, press Enter to place a stone, and connect ${targetLength} in a row before the computer does.`,
        statusText: winner
            ? winner === 'DRAW'
                ? 'The board is full and the round is tied.'
                : winner === playerSide
                    ? `You connected ${targetLength}.`
                    : `The computer connected ${targetLength} first.`
            : isPlayerTurn
                ? 'Pick an open tile to place your next stone.'
                : 'Computer is selecting a reply move.',
        metaChips: [
            `GOAL ${targetLength}`,
            `TIME ${formatDuration(elapsedSeconds)}`,
            winner ? `RESULT ${winner}` : isPlayerTurn ? 'TURN YOU' : 'TURN CPU',
        ],
    };
};
