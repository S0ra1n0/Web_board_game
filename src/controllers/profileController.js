const db = require('../db/db');

const PROFILE_FIELDS = [
    'users.id',
    'users.username',
    'users.email',
    'users.role',
    'users.profile_picture',
    'users.created_at',
    'profiles.display_name',
    'profiles.bio',
    'profiles.location',
    'profiles.favorite_game',
    'user_stats.tictactoe_wins',
    'user_stats.caro_wins',
    'user_stats.memory_highscore',
];

const normalizeText = (value, maxLength) => {
    if (value === undefined) return undefined;

    const trimmed = String(value).trim();
    if (!trimmed) return null;
    if (trimmed.length > maxLength) {
        const error = new Error(`Value exceeds maximum length of ${maxLength}`);
        error.statusCode = 400;
        throw error;
    }

    return trimmed;
};

const buildProfilePayload = (row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    profilePicture: row.profile_picture,
    createdAt: row.created_at,
    displayName: row.display_name || row.username,
    bio: row.bio || '',
    location: row.location || '',
    favoriteGame: row.favorite_game || '',
    stats: {
        tictactoeWins: row.tictactoe_wins || 0,
        caroWins: row.caro_wins || 0,
        memoryHighscore: row.memory_highscore || 0,
    },
});

const fetchProfileByUserId = async (userId) => {
    return db('users')
        .leftJoin('profiles', 'profiles.user_id', 'users.id')
        .leftJoin('user_stats', 'user_stats.user_id', 'users.id')
        .select(PROFILE_FIELDS)
        .where('users.id', userId)
        .first();
};

exports.getProfile = async (req, res) => {
    try {
        const profileRow = await fetchProfileByUserId(req.user.id);

        if (!profileRow) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            status: 'success',
            data: {
                user: buildProfilePayload(profileRow),
            },
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const username = normalizeText(req.body.username, 30);
        const displayName = normalizeText(req.body.displayName, 60);
        const bio = normalizeText(req.body.bio, 280);
        const location = normalizeText(req.body.location, 80);
        const favoriteGame = normalizeText(req.body.favoriteGame, 60);
        const profilePicture = normalizeText(req.body.profilePicture, 255);

        await db.transaction(async (trx) => {
            if (username && username !== req.user.username) {
                const existingUser = await trx('users')
                    .where({ username })
                    .whereNot({ id: req.user.id })
                    .first();

                if (existingUser) {
                    const error = new Error('Username already exists');
                    error.statusCode = 400;
                    throw error;
                }

                await trx('users')
                    .where({ id: req.user.id })
                    .update({
                        username,
                        updated_at: trx.fn.now(),
                    });
            }

            if (profilePicture !== undefined) {
                await trx('users')
                    .where({ id: req.user.id })
                    .update({
                        profile_picture: profilePicture,
                        updated_at: trx.fn.now(),
                    });
            }

            const profilePayload = {
                display_name: displayName,
                bio,
                location,
                favorite_game: favoriteGame,
                updated_at: trx.fn.now(),
            };

            const existingProfile = await trx('profiles')
                .where({ user_id: req.user.id })
                .first();

            if (existingProfile) {
                await trx('profiles')
                    .where({ user_id: req.user.id })
                    .update(profilePayload);
            } else {
                await trx('profiles').insert({
                    user_id: req.user.id,
                    ...profilePayload,
                    created_at: trx.fn.now(),
                });
            }
        });

        const updatedProfile = await fetchProfileByUserId(req.user.id);

        res.json({
            status: 'success',
            data: {
                user: buildProfilePayload(updatedProfile),
            },
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update profile' });
    }
};
