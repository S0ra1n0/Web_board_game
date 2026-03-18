const GRID_SIZE = 15;

const createEmptyGrid = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

// Caro 5: a 5-in-a-line (Green)
export const getCaroArt = () => {
    const grid = createEmptyGrid();
    const color = '#22c55e'; 
    for(let i=5; i<10; i++) {
        grid[i][i] = color;
    }
    return grid;
};

// Tic-Tac-Toe: a big X and O
export const getTicTacToeArt = () => {
    const grid = createEmptyGrid();
    const colorX = '#ef4444'; // red
    const colorO = '#3b82f6'; // blue
    
    // Draw X
    for (let i=2; i<=6; i++) {
        grid[i][i] = colorX;
        grid[i][8-i] = colorX;
    }
    
    // Draw O
    const oTop = 8;
    const oLeft = 8;
    for (let i=0; i<5; i++) {
        if (i===0 || i===4) {
            grid[oTop+i][oLeft+1] = colorO;
            grid[oTop+i][oLeft+2] = colorO;
            grid[oTop+i][oLeft+3] = colorO;
        } else {
            grid[oTop+i][oLeft] = colorO;
            grid[oTop+i][oLeft+4] = colorO;
        }
    }
    return grid;
};

// Memory: a question mark (Purple)
export const getMemoryArt = () => {
    const grid = createEmptyGrid();
    const c = '#a855f7'; 
    grid[3][6]=c; grid[3][7]=c; grid[3][8]=c;
    grid[4][5]=c; grid[4][9]=c;
    grid[5][9]=c;
    grid[6][8]=c;
    grid[7][7]=c;
    grid[8][7]=c;
    grid[10][7]=c; // dot
    return grid;
};

// Draw: a smiley face (Yellow)
export const getDrawArt = () => {
    const grid = createEmptyGrid();
    const c = '#eab308'; 
    grid[4][4]=c; grid[4][10]=c;
    grid[9][3]=c; grid[10][4]=c; 
    for(let i=5; i<=9; i++) grid[11][i]=c; 
    grid[10][10]=c; grid[9][11]=c;
    return grid;
};
