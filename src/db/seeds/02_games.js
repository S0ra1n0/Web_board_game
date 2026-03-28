/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    await knex('games').del();
    await knex('games').insert([
        {
            name: 'Tic-Tac-Toe', description: 'Simple 3x3 grid game.', min_players: 1, max_players: 2,
            instructions: 'Get 3 in a row to win.', board_size: 3, default_timer: 30, score_type: 'wins'
        },
        {
            name: 'Caro 5', description: 'Classic Caro game with 5-in-a-row to win.', min_players: 1, max_players: 2,
            instructions: 'First to get 5 in a row wins.', board_size: 20, default_timer: 60, score_type: 'wins'
        },
        {
            name: 'Caro 4', description: 'Caro game with 4-in-a-row to win.', min_players: 1, max_players: 2,
            instructions: 'First to get 4 in a row wins.', board_size: 20, default_timer: 60, score_type: 'wins'
        },
        {
            name: 'Snake', description: 'Classic Snake game.', min_players: 1, max_players: 1,
            instructions: 'Eat food to grow. Avoid walls and yourself.', board_size: 20, default_timer: 0, score_type: 'score'
        },
        {
            name: 'Match-3', description: 'Match 3 similar blocks.', min_players: 1, max_players: 1,
            instructions: 'Swap blocks to match 3 or more.', board_size: 10, default_timer: 120, score_type: 'score'
        },
        {
            name: 'Memory', description: 'Card matching game.', min_players: 1, max_players: 1,
            instructions: 'Find all matching pairs of cards.', board_size: 6, default_timer: 180, score_type: 'time'
        },
        {
            name: 'Free Draw', description: 'Draw on the matrix.', min_players: 1, max_players: 1,
            instructions: 'Use controls to draw colored pixels.', board_size: 20, default_timer: 0, score_type: 'none'
        }
    ]);
};
