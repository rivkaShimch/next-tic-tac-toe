import React, { useEffect, useState } from 'react';
import {
    Box, Button, Card, CardContent, TextField, Typography, Stack, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import GameStatus from './GameStatus';
import Board from './Board';
import ConfettiDisplay from './ConfettiDisplay';
import { gameService } from '../services/gameService';

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
    const [isGameStarted, setIsGameStarted] = useState(false)

    
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
                setWidth(window.innerWidth)
                setHeight(window.document.documentElement.scrollHeight)
            }

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        })
    }, [])
    useEffect(() => {
        if (gameStatus !== "ongoing"){
            setRestartButton(false)
            setIsGameStarted(false)
        }
    }, [gameStatus])


    const fetchGameState = async () => {
        try {
            const data = await gameService.fetchGameState(playerEmail);
            updateGameState(data);
        } catch (err) {
            setError('Failed to fetch game state');
        }
    };

    const handleCellClick = async (index: number) => {
        if (!playerEmail || !isEmailValid || board[index] || !isPlayerTurn || gameStatus !== 'ongoing') {
            return;
        }

        // Update player's move locally
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);

        const row = Math.floor(index / 3);
        const column = index % 3;

        try {
            const data = await gameService.makeMove(playerEmail, row, column, hardGame);

            if (data.botMove) {
                const botIndex = data.botMove.row * 3 + data.botMove.column;
                newBoard[botIndex] = 'O';
                setIsPlayerTurn(true);
            }

            setGameStatus(data.status);
        } catch (err) {
            setError('Failed to make move');
        }
    };

    const handleRestartGame = async () => {
        try {
            const data = await gameService.restartGame(playerEmail);
            updateGameState(data);
        } catch (err) {
            setError('Failed to restart the game');
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
        setIsGameStarted(true)
        
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

    return (
        <Box className="tic-tac-toe-container">
        <ConfettiDisplay
            gameStatus={gameStatus}
            width={width}
            height={height}
        />
        <Card elevation={3}>
            <CardContent>
                <Typography variant="h4" className="game-title">
                    Tic Tac Toe
                </Typography>

                <div className="controls-container">
                    <div className="game-controls">
                        <TextField
                            className="email-field"
                            type="email"
                            label="Email"
                            variant="outlined"
                            value={playerEmail}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            error={!!error}
                            helperText={error}
                        />
                        
                        <ToggleButtonGroup
                            value={hardGame}
                            exclusive
                            onChange={(_, value) => value !== null ? setHardGame(value) : ""}
                            aria-label="difficulty level"
                        >
                            <ToggleButton value={false}>Easy</ToggleButton>
                            <ToggleButton value={true}>Hard</ToggleButton>
                        </ToggleButtonGroup>

                        <Button
                            variant="contained"
                            className="start-button"
                            onClick={() => restartButton ? handleRestartGame() : startNewGame()}
                        >
                            {restartButton ? "Restart" : "Start Game"}
                        </Button>
                    </div>
                </div>

                <div className="game-status">
                    <GameStatus gameStatus={gameStatus} isPlayerTurn={isPlayerTurn} />
                </div>

                <Board
                    board={board}
                    isPlayerTurn={isPlayerTurn}
                    handleCellClick={handleCellClick}
                    isGameStarted={isGameStarted}
                />
            </CardContent>
        </Card>
    </Box>
    );
};

export default TicTacToe;