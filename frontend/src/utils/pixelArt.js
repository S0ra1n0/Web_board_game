const GRID_SIZE = 20;

const FONT = {
    A: ['0110', '1001', '1111', '1001', '1001'],
    C: ['0111', '1000', '1000', '1000', '0111'],
    D: ['1110', '1001', '1001', '1001', '1110'],
    E: ['1111', '1110', '1100', '1110', '1111'],
    I: ['1111', '0010', '0010', '0010', '1111'],
    M: ['1001', '1111', '1111', '1001', '1001'],
    O: ['0110', '1001', '1001', '1001', '0110'],
    R: ['1110', '1001', '1110', '1010', '1001'],
    T: ['1111', '0010', '0010', '0010', '0010'],
    W: ['1001', '1001', '1111', '1111', '1001'],
};

const createEmptyGrid = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

const drawLetter = (grid, letter, startRow, startCol, color) => {
    const pattern = FONT[letter];
    if (!pattern) return;

    pattern.forEach((rowBits, rowIndex) => {
        [...rowBits].forEach((bit, colIndex) => {
            if (bit === '1' && grid[startRow + rowIndex] && grid[startRow + rowIndex][startCol + colIndex] !== undefined) {
                grid[startRow + rowIndex][startCol + colIndex] = color;
            }
        });
    });
};

const drawWord = (grid, word, startRow, color) => {
    const letterWidth = 4;
    const spacing = 1;
    const totalWidth = word.length * letterWidth + (word.length - 1) * spacing;
    const startCol = Math.floor((GRID_SIZE - totalWidth) / 2);

    [...word].forEach((letter, index) => {
        drawLetter(grid, letter, startRow, startCol + index * (letterWidth + spacing), color);
    });
};

const drawArrow = (grid, startRow, startCol, color) => {
    const pixels = [
        [0, 0], [1, 1], [2, 2], [1, 3], [0, 4],
        [1, 1], [1, 2], [1, 3],
    ];

    pixels.forEach(([rowOffset, colOffset]) => {
        const row = startRow + rowOffset;
        const col = startCol + colOffset;
        if (grid[row] && grid[row][col] !== undefined) {
            grid[row][col] = color;
        }
    });
};

const drawAccentDots = (grid, color) => {
    const dots = [
        [12, 4], [13, 5], [12, 6], [13, 7],
        [12, 12], [13, 13], [12, 14], [13, 15],
    ];

    dots.forEach(([row, col]) => {
        grid[row][col] = color;
    });
};

const buildMenuArt = (label, accentColor) => {
    const grid = createEmptyGrid();
    const titleColor = '#ef4444';

    drawWord(grid, label, 5, titleColor);
    drawAccentDots(grid, '#93c5fd');
    drawArrow(grid, 8, 15, accentColor);

    return grid;
};

export const getCaroArt = () => buildMenuArt('CARO', '#facc15');

export const getTicTacToeArt = () => buildMenuArt('TTT', '#60a5fa');

export const getMemoryArt = () => buildMenuArt('MEM', '#c084fc');

export const getDrawArt = () => buildMenuArt('DRAW', '#f59e0b');
