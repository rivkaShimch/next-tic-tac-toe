// import { CheckCircle, Cancel, EmojiEvents } from "@mui/icons-material";
import { Alert, Typography } from "@mui/material";

interface StatusPropsType {
    gameStatus: string
    isPlayerTurn: boolean
}
const GameStatus = ({ gameStatus, isPlayerTurn }: StatusPropsType) => {
    switch (gameStatus) {
        case "ongoing":
            return (
                <>
                    <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                        The game is ongoing! Good luck 🎮
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {isPlayerTurn ? "Your turn" : "Bot is thinking..."}
                    </Typography>
                </>
            );
        case "win":
            return (
                <>
                    <Alert
                        severity="success"
                        // icon={<EmojiEvents fontSize="large" />}
                        sx={{ animation: "fadeIn 1s" }}
                    >
                        You won! 🎉 Congratulations!
                    </Alert>
                    <Typography variant="h6" color="primary">
                        Game Over!
                    </Typography>
                </>

            );
        case "lose":
            return (
                <>
                    <Alert
                        severity="error"
                        // icon={<Cancel fontSize="large" />}
                        sx={{ animation: "fadeIn 1s" }}
                    >
                        You lost 😢 Try again!
                    </Alert>
                    <Typography variant="h6" color="primary">
                        Game Over!
                    </Typography>
                </>
            );
        case "draw":
            return (
                <>
                    <Alert
                        severity="info"
                        // icon={<CheckCircle fontSize="large" />}
                        sx={{ animation: "fadeIn 1s" }}
                    >
                        It's a draw! 🤝 Well played.
                    </Alert>
                    <Typography variant="h6" color="primary">
                        Game Over!
                    </Typography>
                </>
            );
        default:
            return null;
    }
}

export default GameStatus