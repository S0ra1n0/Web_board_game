const GRID_SIZE = 20;

const createEmptyGrid = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

// Caro 5: a 6-in-a-line to perfectly center on a 20x20 grid (center is 9.5)
export const getCaroArt = () => {
    const grid = createEmptyGrid();
    const color = '#22c55e'; 
    for(let i=7; i<=12; i++) {
        grid[i][i] = color;
    }
    return grid;
};

// Tic-Tac-Toe: Centered X on the left, O on the right
export const getTicTacToeArt = () => {
    const grid = createEmptyGrid();
    const colorX = '#ef4444'; // red
    const colorO = '#3b82f6'; // blue
    
    // Draw X (Rows 7..12, Cols 3..8)
    for (let offset=0; offset<=5; offset++) {
        grid[7+offset][3+offset] = colorX;
        grid[7+offset][8-offset] = colorX;
    }
    
    // Draw O (Rows 7..12, Cols 11..16)
    for (let offset=0; offset<=5; offset++) {
        if (offset===0 || offset===5) {
            grid[7+offset][12] = colorO;
            grid[7+offset][13] = colorO;
            grid[7+offset][14] = colorO;
            grid[7+offset][15] = colorO;
        } else {
            grid[7+offset][11] = colorO;
            grid[7+offset][16] = colorO;
        }
    }
    return grid;
};

// Memory: Embellished question mark without sparkles
export const getMemoryArt = () => {
    const grid = createEmptyGrid();
    const c = '#a855f7'; // Main purple
    
    // Top curve
    grid[4][8]=c; grid[4][9]=c; grid[4][10]=c; grid[4][11]=c;
    grid[5][7]=c; grid[5][8]=c; grid[5][11]=c; grid[5][12]=c;
    
    // Extend top left curve down left by 2 pixels
    grid[6][6]=c; grid[6][7]=c;
    
    // Right bulge
    grid[6][12]=c; grid[6][13]=c;
    grid[7][11]=c; grid[7][12]=c;
    
    // Diagonal down
    grid[8][10]=c; grid[8][11]=c;
    
    // Straight down stem
    grid[9][9]=c; grid[9][10]=c;
    grid[10][9]=c; grid[10][10]=c;
    grid[11][9]=c; grid[11][10]=c;
    
    // Dot portion
    grid[13][9]=c; grid[13][10]=c;
    grid[14][9]=c; grid[14][10]=c;
    
    return grid;
};

// Draw: Centered smiley face
export const getDrawArt = () => {
    const grid = createEmptyGrid();
    const c = '#eab308'; 
    grid[6][7]=c; grid[6][12]=c;
    grid[7][7]=c; grid[7][12]=c;
    
    grid[10][6]=c; grid[11][7]=c; 
    grid[12][8]=c; grid[12][9]=c; grid[12][10]=c; grid[12][11]=c; 
    grid[11][12]=c; grid[10][13]=c;
    return grid;
};

