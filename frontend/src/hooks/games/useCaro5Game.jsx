import { useCaroBaseGame } from './useCaroBaseGame';

export const useCaro5Game = ({ onGameOver }) =>
    useCaroBaseGame({
        onGameOver,
        targetLength: 5,
        title: 'Caro 5',
    });
