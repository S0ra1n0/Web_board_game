/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('games').del();
    await knex('games').insert([
        {
            name: 'Caro 5',
            description: 'Classic Caro game with 5-in-a-row to win.',
            min_players: 1,
            max_players: 2,
            instructions: 'Players take turns placing their marks. First to get 5 in a row wins.'
        },
        {
            name: 'Tic-Tac-Toe',
            description: 'Simple 3x3 grid game.',
            min_players: 1,
            max_players: 2,
            instructions: 'Get 3 in a row to win.'
        }
    ]);
};
