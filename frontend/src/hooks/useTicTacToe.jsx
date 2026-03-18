import { useState } from 'react';

const GRID_SIZE = 20;
const COLOR_LINE = 'var(--text-secondary)'; 
const COLOR_X = '#ef4444'; // Red
const COLOR_O = '#3b82f6'; // Blue
// Cursor color should be a subtle highlight indicating current square
const COLOR_CURSOR = 'rgba(255, 255, 255, 0.15)'; 

export const useTicTacToe = ({ onGameOver }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [cursorIdx, setCursorIdx] = useState(0);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);

    const handleLeft = () => {
        if (!isPlayerTurn) return;
        setCursorIdx(prev => (prev === 0 ? 8 : prev - 1));
    };

    const handleRight = () => {
        if (!isPlayerTurn) return;
        setCursorIdx(prev => (prev === 8 ? 0 : prev + 1));
    };

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6] // diagonals
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

    const handleEnter = () => {
        if (!isPlayerTurn || board[cursorIdx] !== null) return;

        const newBoard = [...board];
        newBoard[cursorIdx] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);

        const winner = checkWinner(newBoard);
        if (winner) {
            onGameOver(winner);
            return;
        }

        // AI Move (Random choice out of remaining cells)
        setTimeout(() => {
            const available = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            if (available.length > 0) {
                const aiMove = available[Math.floor(Math.random() * available.length)];
                newBoard[aiMove] = 'O';
                setBoard(newBoard);
                
                const aiWinner = checkWinner(newBoard);
                if (aiWinner) {
                    onGameOver(aiWinner);
                } else {
                    setIsPlayerTurn(true);
                }
            }
        }, 600);
    };

    // Render logic from 1D board to 20x20 pixel matrix
    const renderGrid = () => {
        const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

        // Draw 3x3 tic-tac-toe grid lines at row/col 6 and 13
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[6][i] = COLOR_LINE;
            grid[13][i] = COLOR_LINE;
            grid[i][6] = COLOR_LINE;
            grid[i][13] = COLOR_LINE;
        }

        // Draw cursor highlight (a 6x6 faint square behind the cell)
        const cRowStr = Math.floor(cursorIdx / 3) * 7;
        const cColStr = (cursorIdx % 3) * 7;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
               grid[cRowStr + r][cColStr + c] = COLOR_CURSOR;
            }
        }

        // Draw Xs and Os
        board.forEach((val, idx) => {
            const rowStart = Math.floor(idx / 3) * 7;
            const colStart = (idx % 3) * 7;
            
            if (val === 'X') {
                for(let i=1; i<=4; i++) {
                    grid[rowStart + i][colStart + i] = COLOR_X; // Diagonal \
                    grid[rowStart + i][colStart + 5 - i] = COLOR_X; // Diagonal /
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

    const reset = () => {
        setBoard(Array(9).fill(null));
        setCursorIdx(0);
        setIsPlayerTurn(true);
    };

    return {
        gridPixels: renderGrid(),
        handleLeft,
        handleRight,
        handleEnter,
        reset
    };
};
