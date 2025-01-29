import { Box, Paper, Stack, Typography } from "@mui/material";

type CellValue = 'X' | 'O' | null;
type BoardValue = CellValue[];

interface BoardPropsType {
    board:BoardValue,
    isPlayerTurn:boolean,
    handleCellClick:(index:number)=>void
}

const Board = ({ board, isPlayerTurn, handleCellClick }:BoardPropsType) => {
    return (<Box
        sx={{
            mb: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
        }}
    >
        {[0, 1, 2].map((row) => (
            <Stack
                key={row}
                direction="row"
                spacing={1}
            >
                {[0, 1, 2].map((col) => {
                    const index = row * 3 + col;
                    return (
                        <Paper
                            key={index}
                            sx={{
                                flex: 1,
                                aspectRatio: '1/1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: !board[index] && isPlayerTurn ? 'pointer' : 'default',
                                backgroundColor: 'background.paper',
                                '&:hover': {
                                    backgroundColor: !board[index] && isPlayerTurn ? 'action.hover' : 'background.paper'
                                }
                            }}
                            elevation={1}
                            onClick={() => handleCellClick(index)}
                        >
                            <Typography variant="h3">
                                {board[index]}
                            </Typography>
                        </Paper>
                    );
                })}
            </Stack>
        ))}
    </Box>)
}

export default Board