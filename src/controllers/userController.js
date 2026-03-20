const db = require('../db/db');

exports.getProfile = async (req, res) => {
    res.json({
        status: 'success',
        data: { user: req.user }
    });
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db('users').select('id', 'username', 'email', 'role', 'created_at');
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await db('user_stats').where({ user_id: userId }).first();
        if (!stats) {
            return res.json({ tictactoe_wins: 0, caro_wins: 0, memory_highscore: 0 });
        }
        res.json({
            tictactoe_wins: stats.tictactoe_wins || 0,
            caro_wins: stats.caro_wins || 0,
            memory_highscore: stats.memory_highscore || 0
        });
    } catch (error) {
        console.error('Database error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
};

exports.updateUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_id, stat_type, value } = req.body;
        
        let updateQuery = '';
        const bindings = [userId, value || 1, value || 1]; 
        
        if (game_id === 'TICTACTOE' && stat_type === 'win') {
            updateQuery = `
                INSERT INTO user_stats (user_id, tictactoe_wins)
                VALUES (?, ?)
                ON CONFLICT (user_id) 
                DO UPDATE SET tictactoe_wins = user_stats.tictactoe_wins + ?
                RETURNING *;
            `;
        } else if (game_id === 'CARO' && stat_type === 'win') {
            updateQuery = `
                INSERT INTO user_stats (user_id, caro_wins)
                VALUES (?, ?)
                ON CONFLICT (user_id) 
                DO UPDATE SET caro_wins = user_stats.caro_wins + ?
                RETURNING *;
            `;
        } else if (game_id === 'MEMORY' && stat_type === 'highscore') {
            updateQuery = `
                INSERT INTO user_stats (user_id, memory_highscore)
                VALUES (?, ?)
                ON CONFLICT (user_id) 
                DO UPDATE SET memory_highscore = GREATEST(user_stats.memory_highscore, ?)
                RETURNING *;
            `;
        } else {
            return res.status(400).json({ error: 'Invalid update parameters' });
        }
        
        const result = await db.raw(updateQuery, bindings);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error updating stats:', error);
        res.status(500).json({ error: 'Failed to update user stats' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const { game_id } = req.params;
        const { filter } = req.query; // 'global' or 'friends'
        
        let orderByColumn = '';
        if (game_id === 'TICTACTOE') orderByColumn = 'tictactoe_wins';
        else if (game_id === 'CARO') orderByColumn = 'caro_wins';
        else if (game_id === 'MEMORY') orderByColumn = 'memory_highscore';
        else return res.status(400).json({ error: 'Invalid game_id' });

        if (filter === 'friends') {
            // Placeholder: since friends relationships aren't implemented in the DB yet,
            // we will just return the user's own score for the friends leaderboard.
            const leaderboard = await db('user_stats')
                .join('users', 'user_stats.user_id', '=', 'users.id')
                .select('users.username', `user_stats.${orderByColumn} as score`)
                .where('users.id', req.user.id)
                .where(`user_stats.${orderByColumn}`, '>', 0)
                .orderBy(`user_stats.${orderByColumn}`, 'desc')
                .limit(10);
            return res.json(leaderboard);
        }

        const leaderboard = await db('user_stats')
            .join('users', 'user_stats.user_id', '=', 'users.id')
            .select('users.username', `user_stats.${orderByColumn} as score`)
            .where(`user_stats.${orderByColumn}`, '>', 0)
            .orderBy(`user_stats.${orderByColumn}`, 'desc')
            .limit(10);
            
        res.json(leaderboard);
    } catch (error) {
        console.error('Database error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

exports.saveGameProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_id, game_state } = req.body;
        
        if (!game_id || !game_state) {
            return res.status(400).json({ error: 'Missing game_id or game_state' });
        }

        const upsertQuery = `
            INSERT INTO saved_games (user_id, game_id, game_state, updated_at)
            VALUES (?, ?, ?::json, NOW())
            ON CONFLICT (user_id, game_id)
            DO UPDATE SET game_state = EXCLUDED.game_state, updated_at = NOW()
            RETURNING *;
        `;
        
        const result = await db.raw(upsertQuery, [userId, game_id, JSON.stringify(game_state)]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error saving progress:', error);
        res.status(500).json({ error: 'Failed to save game progress' });
    }
};

exports.loadGameProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_id } = req.params;
        
        const progress = await db('saved_games')
            .where({ user_id: userId, game_id })
            .first();
            
        if (!progress) {
            return res.status(404).json({ message: 'No saved progress found' });
        }
        
        res.json(progress);
    } catch (error) {
        console.error('Database error loading progress:', error);
        res.status(500).json({ error: 'Failed to load game progress' });
    }
};

exports.deleteGameProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_id } = req.params;
        
        await db('saved_games')
            .where({ user_id: userId, game_id })
            .del();
            
        res.json({ message: 'Saved progress deleted successfully' });
    } catch (error) {
        console.error('Database error deleting progress:', error);
        res.status(500).json({ error: 'Failed to delete game progress' });
    }
};
