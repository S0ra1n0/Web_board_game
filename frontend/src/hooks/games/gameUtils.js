export const GRID_SIZE = 20;

export const COLORS = {
    background: '#020617',
    board: '#0f172a',
    boardMuted: '#1e293b',
    frame: '#334155',
    cursor: '#93c5fd',
    player: '#f97316',
    ai: '#38bdf8',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#facc15',
    neutral: '#cbd5e1',
    palette: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#a855f7'],
    match3: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8'],
    memory: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#a855f7', '#ec4899', '#14b8a6'],
};

export const createGrid = (fill = null) =>
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(fill));

export const fillRect = (grid, top, left, height, width, color) => {
    for (let row = top; row < top + height; row += 1) {
        for (let col = left; col < left + width; col += 1) {
            if (grid[row] && grid[row][col] !== undefined) {
                grid[row][col] = color;
            }
        }
    }
};

export const normalizeGameKey = (value = '') => value.toUpperCase().replace(/[^A-Z0-9]/g, '');

export const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

export const shuffle = (items) => {
    const next = [...items];

    for (let index = next.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }

    return next;
};

export const formatDuration = (seconds = 0) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};
