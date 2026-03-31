import { useEffect, useRef, useState } from 'react';
import { COLORS, GRID_SIZE, createGrid, formatDuration, randomItem } from './gameUtils';

const STARTING_SNAKE = [
    { row: 10, col: 10 },
    { row: 10, col: 9 },
    { row: 10, col: 8 },
];

const DIRECTIONS = {
    UP: { row: -1, col: 0 },
    DOWN: { row: 1, col: 0 },
    LEFT: { row: 0, col: -1 },
    RIGHT: { row: 0, col: 1 },
};

const getRandomFood = (snake) => {
    const occupied = new Set(snake.map(({ row, col }) => `${row}-${col}`));
    const slots = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
        for (let col = 0; col < GRID_SIZE; col += 1) {
            if (!occupied.has(`${row}-${col}`)) {
                slots.push({ row, col });
            }
        }
    }

    return randomItem(slots);
};

export const useSnakeGame = ({ onGameOver }) => {
    const [snake, setSnake] = useState(STARTING_SNAKE);
    const [food, setFood] = useState({ row: 4, col: 4 });
    const [direction, setDirection] = useState('RIGHT');
    const [queuedDirection, setQueuedDirection] = useState('RIGHT');
    const [isRunning, setIsRunning] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [score, setScore] = useState(0);
    const [statusText, setStatusText] = useState('Snake is live. Use the d-pad to steer.');
    const [hasEnded, setHasEnded] = useState(false);
    const onGameOverRef = useRef(onGameOver);
    const startedAtRef = useRef(Date.now());

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useEffect(() => {
        if (!isRunning || hasEnded) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [hasEnded, isRunning]);

    useEffect(() => {
        if (!isRunning || hasEnded) {
            return undefined;
        }

        const tickId = window.setInterval(() => {
            setSnake((currentSnake) => {
                const velocity = DIRECTIONS[queuedDirection];
                const nextHead = {
                    row: currentSnake[0].row + velocity.row,
                    col: currentSnake[0].col + velocity.col,
                };

                const hitsWall =
                    nextHead.row < 0 ||
                    nextHead.row >= GRID_SIZE ||
                    nextHead.col < 0 ||
                    nextHead.col >= GRID_SIZE;
                const hitsSelf = currentSnake.some(({ row, col }) => row === nextHead.row && col === nextHead.col);

                if (hitsWall || hitsSelf) {
                    setIsRunning(false);
                    setHasEnded(true);
                    setStatusText('Collision detected. Game over.');
                    onGameOverRef.current('DEFEAT', score, elapsedSeconds);
                    return currentSnake;
                }

                setDirection(queuedDirection);
                setIsDirty(true);

                if (nextHead.row === food.row && nextHead.col === food.col) {
                    const nextSnake = [nextHead, ...currentSnake];
                    setScore((current) => current + 10);
                    setFood(getRandomFood(nextSnake));
                    setStatusText('Food collected. Keep moving.');
                    return nextSnake;
                }

                return [nextHead, ...currentSnake.slice(0, currentSnake.length - 1)];
            });
        }, 220);

        return () => window.clearInterval(tickId);
    }, [elapsedSeconds, food, hasEnded, isRunning, queuedDirection, score]);

    const setNextDirection = (nextDirection) => {
        if (hasEnded) {
            return;
        }

        const opposite = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
        };

        setQueuedDirection((current) => (opposite[current] === nextDirection ? current : nextDirection));
    };

    const handleEnter = () => {
        if (hasEnded) {
            return;
        }

        setIsRunning((current) => !current);
        setStatusText(isRunning ? 'Snake paused. Press Enter to continue.' : 'Snake resumed.');
    };

    const renderGrid = () => {
        const grid = createGrid(COLORS.background);

        snake.forEach(({ row, col }, index) => {
            grid[row][col] = index === 0 ? COLORS.success : '#16a34a';
        });

        if (food) {
            grid[food.row][food.col] = COLORS.danger;
        }

        return grid;
    };

    const reset = () => {
        const nextSnake = [...STARTING_SNAKE];
        setSnake(nextSnake);
        setFood(getRandomFood(nextSnake));
        setDirection('RIGHT');
        setQueuedDirection('RIGHT');
        setIsRunning(true);
        setIsDirty(false);
        setElapsedSeconds(0);
        setScore(0);
        setStatusText('Snake is live. Use the d-pad to steer.');
        setHasEnded(false);
        startedAtRef.current = Date.now();
    };

    const getState = () => ({
        snake,
        food,
        direction,
        queuedDirection,
        elapsedSeconds,
        score,
        isRunning,
    });

    const loadState = (state) => {
        if (!state) {
            return;
        }

        setSnake(state.snake || STARTING_SNAKE);
        setFood(state.food || getRandomFood(state.snake || STARTING_SNAKE));
        setDirection(state.direction || 'RIGHT');
        setQueuedDirection(state.queuedDirection || state.direction || 'RIGHT');
        setElapsedSeconds(state.elapsedSeconds || 0);
        setScore(state.score || 0);
        setIsRunning(state.isRunning !== false);
        setStatusText('Saved snake state restored.');
        setIsDirty(true);
        setHasEnded(false);
        startedAtRef.current = Date.now() - ((state.elapsedSeconds || 0) * 1000);
    };

    return {
        gridPixels: renderGrid(),
        handleLeft: () => setNextDirection('LEFT'),
        handleRight: () => setNextDirection('RIGHT'),
        handleUp: () => setNextDirection('UP'),
        handleDown: () => setNextDirection('DOWN'),
        handleEnter,
        reset,
        getState,
        loadState,
        isDirty,
        requiresSideSelection: false,
        instructions:
            'Snake starts immediately. Use the d-pad to steer, avoid walls and your own body, and press Enter to pause or resume.',
        statusText,
        metaChips: [
            `SCORE ${score}`,
            `TIME ${formatDuration(elapsedSeconds)}`,
            isRunning ? 'STATE LIVE' : hasEnded ? 'STATE OVER' : 'STATE PAUSED',
        ],
    };
};
