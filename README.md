# Tic Tac Toe Game

## Technologies Used

- React 18
- TypeScript
- Material-UI (MUI)
- React-Confetti

## Installation

1. Install dependencies:

npm install

2. Start the development server:

npm start

## Project Structure

```
src/
├── components/
│   ├── Board.tsx
│   ├── GameStatus.tsx
│   ├── ConfettiDisplay.tsx
│   └── TicTacToe.tsx
├── services/
│   └── gameService.ts
├── config/
│   └── config.ts
├── styles/
│   └── global.css
└── ...
```

## Features in Detail

### Game Modes
- **Easy Mode**: The bot makes random valid moves
- **Hard Mode**: The bot uses advanced strategy to play optimally

### Player Tracking
- Games are associated with player email addresses
- Game state is persisted between sessions

### UI Features
- Real-time game status updates
- Visual feedback for valid/invalid moves
- Confetti animation on victory
- Responsive design for all screen sizes

## API Integration

The game communicates with a backend server for:
- Game state management
- AI move calculation
- Game progress tracking

## Configuration

The application can be configured through environment variables:

```env
REACT_APP_API_BASE_URL - Backend API URL (default: http://localhost:3002)
```

## Known Issues

- Confetti animation might not work properly on some mobile browsers