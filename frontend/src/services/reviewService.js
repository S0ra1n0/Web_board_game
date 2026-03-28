import { apiRequest } from './http';

export const reviewService = {
    getReviews: async (gameId, page = 1, pageSize = 10) => {
        return await apiRequest(`/games/${gameId}/reviews?page=${page}&pageSize=${pageSize}`);
    },

    addReview: async (gameId, rating, comment) => {
        return await apiRequest(`/games/${gameId}/reviews`, {
            method: 'POST',
            body: { rating, comment }
        });
    }
};
