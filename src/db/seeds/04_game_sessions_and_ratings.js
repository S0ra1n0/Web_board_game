/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('game_sessions').del();
  await knex('ratings').del();

  // Get active users and games
  const users = await knex('users').select('id');
  const games = await knex('games').select('id', 'name');

  if (users.length === 0 || games.length === 0) {
      console.warn('Skipping seeds: No users or games found.');
      return;
  }

  const sessions = [];
  const ratings = [];

  // Generate random data
  for (const game of games) {
      for (const user of users) {
          // Add 2-3 random sessions for each game-user combo
          for (let i = 0; i < 3; i++) {
              sessions.push({
                  game_id: game.id,
                  user_id: user.id,
                  score: Math.floor(Math.random() * 1000) + 100, // random score 100-1100
                  duration: Math.floor(Math.random() * 300) + 30, // 30s to 330s
                  played_at: knex.fn.now()
              });
          }

          // Add a rating randomly (50% chance)
          if (Math.random() > 0.5) {
              ratings.push({
                  user_id: user.id,
                  game_id: game.id,
                  rating: Math.floor(Math.random() * 3) + 3, // Rating 3 to 5
                  comment: `Great game! Really enjoyed playing ${game.name}.`,
              });
          }
      }
  }

  if (sessions.length > 0) {
      await knex('game_sessions').insert(sessions);
  }
  
  if (ratings.length > 0) {
      // Catch unique constraint violations just in case
      await knex('ratings').insert(ratings).onConflict(['user_id', 'game_id']).ignore();
  }
};
