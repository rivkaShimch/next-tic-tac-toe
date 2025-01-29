import React, { useEffect, useState } from 'react';
import {
    Box, Button, Card, CardContent, TextField, Typography, Stack, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import GameStatus from './GameStatus';
import Board from './Board';
import dynamic from 'next/dynamic';
const Confetti = dynamic(() => import('react-confetti'), {
    ssr: false,
})
const base_url = "http://localhost:3002"

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [playerEmail, setPlayerEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [gameStatus, setGameStatus] = useState('');
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [error, setError] = useState('');
    const [restartButton, setRestartButton] = useState(false)
    const [hardGame, setHardGame] = useState(false)
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('playerEmail');
        if (storedEmail) {
            setPlayerEmail(storedEmail);
            setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storedEmail));
        }
    }, []);

    useEffect(() => {
        window.addEventListener('resize', () => {
            const handleResize = () => {
                const heightWin = window.document.documentElement.scrollHeight - window.document.documentElement.clientHeight;
                console.log(window.innerHeight, heightWin);
                setWidth(window.innerWidth)
                setHeight(window.document.documentElement.scrollHeight)
            }

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        })
    }, [])
    useEffect(() => {
        if (gameStatus !== "ongoing")
            setRestartButton(false)
    }, [gameStatus])

    useEffect(() => {
        if (gameStatus === 'win') {
            setShowConfetti(true);
            // Stop confetti after 5 seconds
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [gameStatus]);

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
        let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
        setIsEmailValid(isValid);
        setPlayerEmail(newEmail)
        if (isValid) {
            localStorage.setItem('playerEmail', newEmail);
            setRestartButton(false)
            setBoard(Array(9).fill(null))
            setGameStatus('')
        }
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

        // Update player's move
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false)

        const row = Math.floor(index / 3);
        const column = index % 3; try {
            const response = await fetch(`${base_url}/api/gameplay?playerEmail=${encodeURIComponent(playerEmail)}&hard=${encodeURIComponent(hardGame)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, column }),
            });

            const data = await response.json();

            if (data.botMove) {
                const botIndex = data.botMove.row * 3 + data.botMove.column;
                newBoard[botIndex] = 'O';
                setIsPlayerTurn(true)
            }

            setGameStatus(data.status);
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
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 1, p: 1 }}>
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={1000}
                    gravity={0.1}
                />
            )}
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Tic Tac Toe
                    </Typography>

                    <Box sx={{ mb: 2 }}>
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
                            <ToggleButtonGroup
                                value={hardGame}
                                exclusive
                                onChange={(_, value) => value !== null ? setHardGame(value) : ""}
                                aria-label="difficulty level"
                            >
                                <ToggleButton value={false}>Easy</ToggleButton>
                                <ToggleButton value={true}>Hard</ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>

                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <GameStatus gameStatus={gameStatus} isPlayerTurn={isPlayerTurn} />
                    </Box>

                    <Board isPlayerTurn={isPlayerTurn} board={board} handleCellClick={handleCellClick} />


                </CardContent>
            </Card>
        </Box>
    );
};

export default TicTacToe;