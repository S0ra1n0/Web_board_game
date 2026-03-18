const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    // Hash passwords
    const admin1Hash = await bcrypt.hash('admin123', 12);
    const user1Hash = await bcrypt.hash('user123', 12);

    // Deletes ALL existing entries
    await knex('users').del();

    await knex('users').insert([
        {
            username: 'admin1',
            email: 'admin1@example.com',
            password_hash: admin1Hash,
            role: 'admin'
        },
        {
            username: 'user1',
            email: 'user1@example.com',
            password_hash: user1Hash,
            role: 'user'
        }
    ]);
};
