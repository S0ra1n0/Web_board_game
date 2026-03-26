const db = require('../db/db');

const mapSearchResult = (row) => ({
    id: row.id,
    username: row.username,
    role: row.role,
    profilePicture: row.profile_picture,
    displayName: row.display_name || row.username,
    bio: row.bio || '',
    location: row.location || '',
    favoriteGame: row.favorite_game || '',
    createdAt: row.created_at,
});

exports.searchUsers = async (req, res) => {
    try {
        const query = String(req.query.q || '').trim();
        const page = Math.max(1, Number.parseInt(req.query.page || '1', 10) || 1);
        const pageSize = Math.min(12, Math.max(1, Number.parseInt(req.query.pageSize || '6', 10) || 6));

        const baseQuery = db('users')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereNot('users.id', req.user.id);

        if (query) {
            const searchTerm = `%${query}%`;
            baseQuery.andWhere((builder) => {
                builder
                    .whereILike('users.username', searchTerm)
                    .orWhereILike('users.email', searchTerm)
                    .orWhereILike('profiles.display_name', searchTerm)
                    .orWhereILike('profiles.favorite_game', searchTerm)
                    .orWhereILike('profiles.location', searchTerm);
            });
        }

        const totalResult = await baseQuery
            .clone()
            .countDistinct('users.id as total')
            .first();

        const totalItems = Number.parseInt(totalResult?.total || '0', 10);
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const currentPage = Math.min(page, totalPages);

        const users = await baseQuery
            .clone()
            .select(
                'users.id',
                'users.username',
                'users.role',
                'users.profile_picture',
                'users.created_at',
                'profiles.display_name',
                'profiles.bio',
                'profiles.location',
                'profiles.favorite_game'
            )
            .orderBy('users.username', 'asc')
            .limit(pageSize)
            .offset((currentPage - 1) * pageSize);

        res.json({
            status: 'success',
            data: {
                items: users.map(mapSearchResult),
                pagination: {
                    page: currentPage,
                    pageSize,
                    totalItems,
                    totalPages,
                },
            },
        });
    } catch (error) {
        console.error('User search error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
};
