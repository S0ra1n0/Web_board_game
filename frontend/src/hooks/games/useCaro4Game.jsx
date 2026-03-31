import { useCaroBaseGame } from './useCaroBaseGame';

export const useCaro4Game = ({ onGameOver }) =>
    useCaroBaseGame({
        onGameOver,
        targetLength: 4,
        title: 'Caro 4',
    });
