import { apiRequest } from './http';

export const gameService = {
    getAllGames: async () => {
        return await apiRequest('/games');
    },
    
    getGameById: async (id) => {
        return await apiRequest(`/games/${id}`);
    },

    saveProgress: async (gameId, state) => {
        return await apiRequest(`/games/${gameId}/save`, {
            method: 'POST',
            body: { state }
        });
    },

    loadProgress: async (gameId) => {
        return await apiRequest(`/games/${gameId}/save`);
    },

    deleteProgress: async (gameId) => {
        return await apiRequest(`/games/${gameId}/save`, {
            method: 'DELETE'
        });
    },

    submitSession: async (gameId, score, duration) => {
        return await apiRequest(`/games/${gameId}/session`, {
            method: 'POST',
            body: { score, duration }
        });
    }
};
