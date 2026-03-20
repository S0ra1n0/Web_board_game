import { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const COLOR_LINE = 'var(--text-secondary)'; 
const COLOR_X = '#ef4444'; // Red
const COLOR_O = '#3b82f6'; // Blue
const COLOR_CURSOR = 'rgba(255, 255, 255, 0.15)'; 

export const useTicTacToe = ({ onGameOver }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [cursorIdx, setCursorIdx] = useState(0);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [playerSide, setPlayerSide] = useState('X'); // 'X' or 'O'
    const [isDirty, setIsDirty] = useState(false);

    // Lateral movement
    const handleLeft = () => {
        if (!isPlayerTurn || winner) return;
        setCursorIdx(prev => (prev === 0 ? 8 : prev - 1));
    };

    const handleRight = () => {
        if (!isPlayerTurn || winner) return;
        setCursorIdx(prev => (prev === 8 ? 0 : prev + 1));
    };

    const onGameOverRef = useRef(onGameOver);
    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        if (!squares.includes(null)) return 'DRAW';
        return null;
    };

    useEffect(() => {
        const foundWinner = checkWinner(board);
        if (foundWinner) {
            setWinner(foundWinner);
            const timer = setTimeout(() => {
                onGameOverRef.current(foundWinner);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [board]);

    const triggerAiMove = (currentBoard, overrideAiSymbol) => {
        const aiSymbol = overrideAiSymbol || (playerSide === 'X' ? 'O' : 'X');
        setTimeout(() => {
            const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            if (available.length > 0 && !checkWinner(currentBoard)) {
                const aiMove = available[Math.floor(Math.random() * available.length)];
                const nextBoard = [...currentBoard];
                nextBoard[aiMove] = aiSymbol;
                setBoard(nextBoard);
                setIsPlayerTurn(true);
            }
        }, 600);
    };

    const handleEnter = () => {
        if (!isPlayerTurn || board[cursorIdx] !== null || winner) return;

        const newBoard = [...board];
        newBoard[cursorIdx] = playerSide;
        setBoard(newBoard);
        setIsPlayerTurn(false);
        setIsDirty(true);

        const currentWinner = checkWinner(newBoard);
        if (!currentWinner) {
            triggerAiMove(newBoard);
        }
    };

    const renderGrid = () => {
        const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

        for (let i = 0; i < GRID_SIZE; i++) {
            grid[6][i] = COLOR_LINE; grid[13][i] = COLOR_LINE;
            grid[i][6] = COLOR_LINE; grid[i][13] = COLOR_LINE;
        }

        const cRowStr = Math.floor(cursorIdx / 3) * 7;
        const cColStr = (cursorIdx % 3) * 7;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
               grid[cRowStr + r][cColStr + c] = COLOR_CURSOR;
            }
        }

        board.forEach((val, idx) => {
            const rowStart = Math.floor(idx / 3) * 7;
            const colStart = (idx % 3) * 7;
            if (val === 'X') {
                for(let i=1; i<=4; i++) {
                    grid[rowStart + i][colStart + i] = COLOR_X;
                    grid[rowStart + i][colStart + 5 - i] = COLOR_X;
                }
            } else if (val === 'O') {
                grid[rowStart+1][colStart+2]=COLOR_O; grid[rowStart+1][colStart+3]=COLOR_O;
                grid[rowStart+2][colStart+1]=COLOR_O; grid[rowStart+2][colStart+4]=COLOR_O;
                grid[rowStart+3][colStart+1]=COLOR_O; grid[rowStart+3][colStart+4]=COLOR_O;
                grid[rowStart+4][colStart+2]=COLOR_O; grid[rowStart+4][colStart+3]=COLOR_O;
            }
        });

        return grid;
    };

    const reset = (preferredSide = 'X') => {
        setBoard(Array(9).fill(null));
        setCursorIdx(0);
        setWinner(null);
        setPlayerSide(preferredSide);
        setIsDirty(false);

        if (preferredSide === 'X') {
            setIsPlayerTurn(true);
        } else {
            setIsPlayerTurn(false);
            // If player is O, AI must be X. Pass 'X' explicitly to avoid stale state
            triggerAiMove(Array(9).fill(null), 'X');
        }
    };

    const getState = () => ({
        board,
        cursorIdx,
        isPlayerTurn,
        playerSide
    });

    const loadState = (state) => {
        if (!state) return;
        setBoard(state.board);
        setCursorIdx(state.cursorIdx);
        setIsPlayerTurn(state.isPlayerTurn);
        setPlayerSide(state.playerSide || 'X');
        setIsDirty(false); // Loading doesn't count as "making a move" in the current session
        
        if (!state.isPlayerTurn && !checkWinner(state.board)) {
            triggerAiMove(state.board);
        }
    };

    return {
        gridPixels: renderGrid(),
        handleLeft,
        handleRight,
        handleEnter,
        reset,
        getState,
        loadState,
        isDirty,
        playerSide
    };
};
