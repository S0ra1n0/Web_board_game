const DIRECTIONS = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const isInsideBoard = (board, row, col) =>
    row >= 0 && row < board.length && col >= 0 && col < board.length;

const cloneBoard = (board) => board.map((row) => [...row]);

const applyMove = (board, move, side) => {
    const nextBoard = cloneBoard(board);
    nextBoard[move.row][move.col] = side;
    return nextBoard;
};

const hasLine = (board, row, col, targetLength) => {
    const symbol = board[row][col];

    if (!symbol) {
        return false;
    }

    return DIRECTIONS.some(([rowStep, colStep]) => {
        let total = 1;

        for (const direction of [-1, 1]) {
            let nextRow = row + rowStep * direction;
            let nextCol = col + colStep * direction;

            while (isInsideBoard(board, nextRow, nextCol) && board[nextRow][nextCol] === symbol) {
                total += 1;
                nextRow += rowStep * direction;
                nextCol += colStep * direction;
            }
        }

        return total >= targetLength;
    });
};

const getOccupiedCells = (board) => {
    const occupied = [];

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== null) {
                occupied.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    return occupied;
};

const getCandidateMoves = (board, radius = 1) => {
    const occupied = getOccupiedCells(board);

    if (occupied.length === 0) {
        const center = Math.floor(board.length / 2);
        return [{ row: center, col: center }];
    }

    const candidates = new Map();

    occupied.forEach(({ row, col }) => {
        for (let rowOffset = -radius; rowOffset <= radius; rowOffset += 1) {
            for (let colOffset = -radius; colOffset <= radius; colOffset += 1) {
                if (rowOffset === 0 && colOffset === 0) {
                    continue;
                }

                const nextRow = row + rowOffset;
                const nextCol = col + colOffset;

                if (!isInsideBoard(board, nextRow, nextCol) || board[nextRow][nextCol] !== null) {
                    continue;
                }

                const key = `${nextRow}:${nextCol}`;

                if (!candidates.has(key)) {
                    candidates.set(key, { row: nextRow, col: nextCol });
                }
            }
        }
    });

    return [...candidates.values()];
};

const findImmediateMove = (board, moves, side, targetLength) => {
    for (const move of moves) {
        const nextBoard = applyMove(board, move, side);

        if (hasLine(nextBoard, move.row, move.col, targetLength)) {
            return move;
        }
    }

    return null;
};

const scorePattern = (total, openEnds, targetLength) => {
    if (total >= targetLength) {
        return 100000;
    }

    if (total === targetLength - 1) {
        return openEnds === 2 ? 15000 : openEnds === 1 ? 5000 : 0;
    }

    if (total === targetLength - 2) {
        return openEnds === 2 ? 1200 : openEnds === 1 ? 250 : 0;
    }

    if (total === targetLength - 3) {
        return openEnds === 2 ? 120 : openEnds === 1 ? 25 : 0;
    }

    return total * total * 2 + openEnds;
};

const evaluateMoveForSide = (board, move, side, targetLength) => {
    let score = 0;

    DIRECTIONS.forEach(([rowStep, colStep]) => {
        let total = 1;
        let openEnds = 0;

        for (const direction of [-1, 1]) {
            let nextRow = move.row + rowStep * direction;
            let nextCol = move.col + colStep * direction;

            while (isInsideBoard(board, nextRow, nextCol) && board[nextRow][nextCol] === side) {
                total += 1;
                nextRow += rowStep * direction;
                nextCol += colStep * direction;
            }

            if (isInsideBoard(board, nextRow, nextCol) && board[nextRow][nextCol] === null) {
                openEnds += 1;
            }
        }

        score += scorePattern(total, openEnds, targetLength);
    });

    return score;
};

const getCenterBonus = (board, move) => {
    const center = (board.length - 1) / 2;
    const distance = Math.abs(move.row - center) + Math.abs(move.col - center);
    return Math.max(0, board.length - distance);
};

const rankMoves = ({
    board,
    moves,
    aiSide,
    playerSide,
    targetLength,
    attackWeight = 1,
    defenseWeight = 1,
}) =>
    moves
        .map((move) => {
            const attackScore = evaluateMoveForSide(board, move, aiSide, targetLength);
            const defenseScore = evaluateMoveForSide(board, move, playerSide, targetLength);
            const centerBonus = getCenterBonus(board, move);

            return {
                ...move,
                attackScore,
                defenseScore,
                centerBonus,
                score: attackScore * attackWeight + defenseScore * defenseWeight + centerBonus,
            };
        })
        .sort((first, second) => second.score - first.score);

const getOpponentReplyScore = ({ board, aiSide, playerSide, targetLength }) => {
    const replyMoves = getCandidateMoves(board, 2);

    if (!replyMoves.length) {
        return 0;
    }

    const winningReply = findImmediateMove(board, replyMoves, playerSide, targetLength);

    if (winningReply) {
        return 100000;
    }

    const [bestReply] = rankMoves({
        board,
        moves: replyMoves,
        aiSide: playerSide,
        playerSide: aiSide,
        targetLength,
        attackWeight: 1.25,
        defenseWeight: 1.05,
    });

    return bestReply?.score || 0;
};

const getEasyMove = (board) => {
    const candidateMoves = getCandidateMoves(board, 1);
    return candidateMoves.length ? pickRandom(candidateMoves) : null;
};

const getMediumMove = ({ board, aiSide, playerSide, targetLength }) => {
    const candidateMoves = getCandidateMoves(board, 2);

    const winningMove = findImmediateMove(board, candidateMoves, aiSide, targetLength);
    if (winningMove) {
        return winningMove;
    }

    const blockingMove = findImmediateMove(board, candidateMoves, playerSide, targetLength);
    if (blockingMove) {
        return blockingMove;
    }

    const rankedMoves = rankMoves({
        board,
        moves: candidateMoves,
        aiSide,
        playerSide,
        targetLength,
        attackWeight: 1.05,
        defenseWeight: 1.2,
    });

    const shortlist = rankedMoves.slice(0, Math.min(4, rankedMoves.length));
    return shortlist.length ? pickRandom(shortlist) : null;
};

const getHardMove = ({ board, aiSide, playerSide, targetLength }) => {
    const candidateMoves = getCandidateMoves(board, 2);

    const winningMove = findImmediateMove(board, candidateMoves, aiSide, targetLength);
    if (winningMove) {
        return winningMove;
    }

    const blockingMove = findImmediateMove(board, candidateMoves, playerSide, targetLength);
    if (blockingMove) {
        return blockingMove;
    }

    const rankedMoves = rankMoves({
        board,
        moves: candidateMoves,
        aiSide,
        playerSide,
        targetLength,
        attackWeight: 1.2,
        defenseWeight: 1.35,
    }).slice(0, 6);

    let bestMove = rankedMoves[0] || null;
    let bestScore = bestMove?.score ?? -Infinity;

    rankedMoves.forEach((move) => {
        const nextBoard = applyMove(board, move, aiSide);
        const opponentReplyScore = getOpponentReplyScore({
            board: nextBoard,
            aiSide,
            playerSide,
            targetLength,
        });
        const totalScore = move.score - opponentReplyScore * 0.9;

        if (totalScore > bestScore) {
            bestMove = move;
            bestScore = totalScore;
        }
    });

    return bestMove;
};

export const getCaroAiMove = ({ board, aiSide, playerSide, difficulty = 'medium', targetLength }) => {
    if (difficulty === 'easy') {
        return getEasyMove(board);
    }

    if (difficulty === 'hard') {
        return getHardMove({ board, aiSide, playerSide, targetLength });
    }

    return getMediumMove({ board, aiSide, playerSide, targetLength });
};
