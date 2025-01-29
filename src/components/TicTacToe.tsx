import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Paper,
    Stack,
} from '@mui/material';
import GameStatus from './GameStatus';
import Board from './Board';

const base_url = "http://localhost:3002"

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [playerEmail, setPlayerEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [gameStatus, setGameStatus] = useState('');
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [error, setError] = useState('');
    const [restartButton, setRestartButton] = useState(false)


    useEffect(()=>{
        if(gameStatus!=="ongoing")
            setRestartButton(false)
    },[gameStatus])

    const fetchGameState = async () => {
        try {
            const response = await fetch(`${base_url}/api/game?playerEmail=${playerEmail}`);
            const data = await response.json();
            updateGameState(data);
        } catch (err) {
            setError('Failed to fetch game state');
        }
    };

    const handleEmailChange = (newEmail: string) => {
        setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail));
        setPlayerEmail(newEmail)
    }

    const updateGameState = (gameData: { board: any[]; status: React.SetStateAction<string>; currentTurn: string; }) => {
        const newBoard = Array(9).fill(null);
        if (gameData.board) {
            gameData.board.forEach((row, i) => {
                row.forEach((cell: any, j: number) => {
                    newBoard[i * 3 + j] = cell;
                });
            });
        }
        setBoard(newBoard);
        setGameStatus(gameData.status);
        setIsPlayerTurn(gameData.currentTurn === 'player');
    };

    const handleCellClick = async (index: number) => {
        if (!playerEmail || !isEmailValid || board[index] || !isPlayerTurn || gameStatus !== 'ongoing') {
            return;
        }

        const row = Math.floor(index / 3);
        const column = index % 3;
        setIsPlayerTurn(false)
        try {
            const response = await fetch(`${base_url}/api/gameplay?playerEmail=${playerEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, column }),
            });

            const data = await response.json();

            // Update player's move
            const newBoard = [...board];
            newBoard[index] = 'X';
            setBoard(newBoard);

            // If bot made a move, update that too
            if (data.botMove) {
                const botIndex = data.botMove.row * 3 + data.botMove.column;
                newBoard[botIndex] = 'O';
                setIsPlayerTurn(true)
            }

            setGameStatus(data.status);
            //setIsPlayerTurn(data.currentTurn === 'player');
        } catch (err) {
            setError('Failed to make move');
        }
    };

    const startNewGame = async () => {
        if (!playerEmail) {
            setError('Please enter your email');
            return;
        }
        if (!isEmailValid) {
            setError('Please enter a valid email');
            return;
        }
        setError('');
        await fetchGameState();
        setRestartButton(true)
    };

    const handleRestartGame = async () => {
        try {
            const response = await fetch(`${base_url}/api/restart?playerEmail=${playerEmail}`);
            const data = await response.json();
            updateGameState(data);
        } catch (err) {
            setError('Failed to restart the game');
        }
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Tic Tac Toe
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={2}>

                            <Stack direction="row" spacing={2}>

                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    variant="outlined"
                                    value={playerEmail}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => restartButton ? handleRestartGame() : startNewGame()}
                                    sx={{ height: '56px' }}
                                >
                                    {restartButton ? "Restart" : "Start Game"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                    <Board isPlayerTurn={isPlayerTurn} board={board} handleCellClick={handleCellClick} />

                    <Box sx={{ textAlign: 'center' }}>
                        <GameStatus gameStatus={gameStatus} isPlayerTurn={isPlayerTurn} />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TicTacToe;