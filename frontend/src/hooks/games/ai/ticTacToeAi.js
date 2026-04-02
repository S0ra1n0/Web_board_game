const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const CENTER_INDEX = 4;
const CORNER_INDEXES = [0, 2, 6, 8];
const EDGE_INDEXES = [1, 3, 5, 7];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const getAvailableMoves = (board) =>
    board
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null);

const checkWinner = (board) => {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes(null) ? null : 'DRAW';
};

const applyMove = (board, index, side) => {
    const nextBoard = [...board];
    nextBoard[index] = side;
    return nextBoard;
};

const findImmediateMove = (board, side) => {
    const availableMoves = getAvailableMoves(board);

    for (const index of availableMoves) {
        const nextBoard = applyMove(board, index, side);

        if (checkWinner(nextBoard) === side) {
            return index;
        }
    }

    return null;
};

const pickPreferredMove = (board, indexes) => {
    const candidates = indexes.filter((index) => board[index] === null);
    return candidates.length ? pickRandom(candidates) : null;
};

const getMediumMove = (board, aiSide, playerSide) => {
    const winningMove = findImmediateMove(board, aiSide);
    if (winningMove !== null) {
        return winningMove;
    }

    const blockingMove = findImmediateMove(board, playerSide);
    if (blockingMove !== null) {
        return blockingMove;
    }

    if (board[CENTER_INDEX] === null) {
        return CENTER_INDEX;
    }

    const cornerMove = pickPreferredMove(board, CORNER_INDEXES);
    if (cornerMove !== null) {
        return cornerMove;
    }

    const edgeMove = pickPreferredMove(board, EDGE_INDEXES);
    if (edgeMove !== null) {
        return edgeMove;
    }

    const availableMoves = getAvailableMoves(board);
    return availableMoves.length ? pickRandom(availableMoves) : null;
};

const minimax = (board, currentSide, aiSide, playerSide, depth) => {
    const winner = checkWinner(board);

    if (winner === aiSide) {
        return { score: 10 - depth };
    }

    if (winner === playerSide) {
        return { score: depth - 10 };
    }

    if (winner === 'DRAW') {
        return { score: 0 };
    }

    const availableMoves = getAvailableMoves(board);
    const isMaximizing = currentSide === aiSide;
    let bestMove = {
        index: null,
        score: isMaximizing ? -Infinity : Infinity,
    };

    for (const index of availableMoves) {
        const nextBoard = applyMove(board, index, currentSide);
        const nextSide = currentSide === aiSide ? playerSide : aiSide;
        const result = minimax(nextBoard, nextSide, aiSide, playerSide, depth + 1);
        const candidate = {
            index,
            score: result.score,
        };

        if (
            (isMaximizing && candidate.score > bestMove.score) ||
            (!isMaximizing && candidate.score < bestMove.score)
        ) {
            bestMove = candidate;
        }
    }

    return bestMove;
};

export const getTicTacToeAiMove = ({ board, aiSide, playerSide, difficulty = 'medium' }) => {
    const availableMoves = getAvailableMoves(board);

    if (!availableMoves.length) {
        return null;
    }

    if (difficulty === 'easy') {
        return pickRandom(availableMoves);
    }

    if (difficulty === 'hard') {
        return minimax(board, aiSide, aiSide, playerSide, 0).index;
    }

    return getMediumMove(board, aiSide, playerSide);
};
