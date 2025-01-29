import { useState, useEffect } from 'react';

interface ConfettiProps {
    gameStatus: string,
    width: number | undefined,
    height: number| undefined
}
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), {
    ssr: false,
})

const ConfettiDisplay = ({ gameStatus, width, height }:ConfettiProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (gameStatus === 'win') {
      // Reset the component by changing the key
      setKey(prevKey => prevKey + 1);
      setShowConfetti(true);
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 7000);
      
      return () => {
        clearTimeout(timer);
        setShowConfetti(false);
      };
    }

  }, [gameStatus]);

  return showConfetti ? (
    <Confetti
      key={key}
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={1000}
      gravity={0.1}
    />
  ) : null;
};

export default ConfettiDisplay;