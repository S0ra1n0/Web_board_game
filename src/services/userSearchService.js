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

exports.searchUsers = async ({ currentUserId, query, page = 1, pageSize = 6 }) => {
    const normalizedQuery = String(query || '').trim();
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safePageSize = Math.min(12, Math.max(1, Number.parseInt(pageSize, 10) || 6));

    const baseQuery = db('users')
        .leftJoin('profiles', 'profiles.user_id', 'users.id')
        .whereNot('users.id', currentUserId);

    if (normalizedQuery) {
        const searchTerm = `%${normalizedQuery}%`;
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
    const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
    const currentPage = Math.min(safePage, totalPages);

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
        .limit(safePageSize)
        .offset((currentPage - 1) * safePageSize);

    return {
        items: users.map(mapSearchResult),
        pagination: {
            page: currentPage,
            pageSize: safePageSize,
            totalItems,
            totalPages,
        },
    };
};
