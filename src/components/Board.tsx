import { Box, Paper, Stack, Typography, keyframes } from "@mui/material";

type CellValue = 'X' | 'O' | null;
type BoardValue = CellValue[];

interface BoardPropsType {
    board: BoardValue;
    isPlayerTurn: boolean;
    handleCellClick: (index: number) => void;
    isGameStarted: boolean;
}

const Board = ({ board, isPlayerTurn, handleCellClick, isGameStarted }: BoardPropsType) => {
    const handleClick = (index: number) => {
        if (!isGameStarted) {
            return;
        }
        handleCellClick(index);
    };

    return (
        <div className={`game-board ${!isGameStarted ? 'game-board--inactive' : ''}`}>
            {!isGameStarted && (
                <div className="board-overlay">
                    <Typography variant="body1" color="primary">
                        Click Start Game to play
                    </Typography>
                </div>
            )}
            
            {[0, 1, 2].map((row) => (
                <div key={row} className="board-row">
                    {[0, 1, 2].map((col) => {
                        const index = row * 3 + col;
                        const isActive = !board[index] && isPlayerTurn && isGameStarted;
                        
                        return (
                            <Paper
                                key={index}
                                className={`board-cell ${isActive ? 'board-cell--active' : 'board-cell--inactive'}`}
                                elevation={1}
                                onClick={() => handleClick(index)}
                            >
                                <Typography variant="h3">
                                    {board[index]}
                                </Typography>
                            </Paper>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Board;