import { config } from '../config/config';

interface GameData {
    board: any[];
    status: string;
    currentTurn: string;
    botMove?: {
        row: number;
        column: number;
    };
}

export const gameService = {
    fetchGameState: async (playerEmail: string): Promise<GameData> => {
        const response = await fetch(`${config.API_BASE_URL}/api/game?playerEmail=${playerEmail}`);
        if (!response.ok) {
            throw new Error('Failed to fetch game state');
        }
        return response.json();
    },

    makeMove: async (playerEmail: string, row: number, column: number, hard: boolean): Promise<GameData> => {
        const response = await fetch(
            `${config.API_BASE_URL}/api/gameplay?playerEmail=${encodeURIComponent(playerEmail)}&hard=${encodeURIComponent(hard)}`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, column }),
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to make move');
        }
        return response.json();
    },

    restartGame: async (playerEmail: string): Promise<GameData> => {
        const response = await fetch(`${config.API_BASE_URL}/api/restart?playerEmail=${playerEmail}`);
        if (!response.ok) {
            throw new Error('Failed to restart the game');
        }
        return response.json();
    }
};