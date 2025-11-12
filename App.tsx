import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Guess } from './types';
import { createDeck, shuffleDeck } from './services/cardService';
import { INITIAL_SCORE, DEFAULT_MESSAGE, WIN_MESSAGE, LOSE_MESSAGE, EMPTY_DECK_MESSAGE } from './constants';
import { CardDisplay } from './components/CardDisplay';

const App: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [nextCard, setNextCard] = useState<Card | null>(null);
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedHighScore = localStorage.getItem('higherOrLowerHighScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [revealingNextCard, setRevealingNextCard] = useState<boolean>(false);

  // Use useRef to track if the component is mounted, to prevent state updates on unmounted component
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const initializeGame = useCallback(() => {
    const newDeck = shuffleDeck(createDeck());
    const firstCard = newDeck.pop();
    if (firstCard) {
      if (mountedRef.current) {
        setDeck(newDeck);
        setCurrentCard(firstCard);
        setNextCard(null);
        setScore(INITIAL_SCORE);
        setMessage(DEFAULT_MESSAGE);
        setGameOver(false);
        setRevealingNextCard(false);
      }
    } else {
      if (mountedRef.current) {
        setMessage("Error: Could not create initial deck.");
        setGameOver(true);
      }
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('higherOrLowerHighScore', score.toString());
    }
  }, [score, highScore]);

  const drawNextCard = useCallback(() => {
    if (deck.length === 0) {
      if (mountedRef.current) {
        setMessage(EMPTY_DECK_MESSAGE);
        setGameOver(true);
        setRevealingNextCard(false); // Ensure this is false so cards don't stay hidden
        setCurrentCard(null); // Clear current card
        setNextCard(null); // Clear next card
      }
      return null;
    }
    const card = deck.pop();
    if (mountedRef.current) {
      setDeck([...deck]); // Update deck state
    }
    return card;
  }, [deck]);

  const handleGuess = useCallback(async (guess: Guess) => {
    if (gameOver || revealingNextCard || !currentCard) return;

    setRevealingNextCard(true);
    setMessage("Drawing next card...");

    // Simulate a brief delay for suspense
    await new Promise(resolve => setTimeout(resolve, 800));

    const drawnCard = drawNextCard();

    if (!drawnCard) {
      // Game over due to empty deck, handled by drawNextCard
      if (mountedRef.current) {
        setRevealingNextCard(false);
      }
      return;
    }

    if (mountedRef.current) {
      setNextCard(drawnCard);
    }

    // Short delay to show the drawn card before message/update
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!currentCard || !drawnCard) { // Should not happen if game is not over
      if (mountedRef.current) {
        setMessage("An error occurred. Please restart.");
        setGameOver(true);
        setRevealingNextCard(false);
      }
      return;
    }

    let correct = false;
    if (guess === 'higher') {
      correct = drawnCard.value > currentCard.value;
    } else { // guess === 'lower'
      correct = drawnCard.value < currentCard.value;
    }

    if (correct) {
      if (mountedRef.current) {
        setScore(prevScore => prevScore + 1);
        setMessage(WIN_MESSAGE);
      }
      // Prepare for next round
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (mountedRef.current && deck.length > 0) {
        setCurrentCard(drawnCard);
        setNextCard(null); // Hide next card for the new guess
        setMessage(DEFAULT_MESSAGE);
        setRevealingNextCard(false);
      } else if (mountedRef.current) {
        // Deck ran out after a correct guess
        setMessage(EMPTY_DECK_MESSAGE);
        setGameOver(true);
        setRevealingNextCard(false);
        setCurrentCard(null);
        setNextCard(null);
      }
    } else {
      if (mountedRef.current) {
        setMessage(LOSE_MESSAGE);
        setGameOver(true);
        setRevealingNextCard(false);
      }
    }
  }, [gameOver, currentCard, revealingNextCard, drawNextCard, deck.length]);

  const handlePlayAgain = useCallback(() => {
    if (mountedRef.current) {
      initializeGame();
    }
  }, [initializeGame]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-700 to-purple-900 text-white min-h-screen w-full rounded-lg shadow-2xl max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg text-center">
        Higher or Lower
      </h1>

      <div className="flex flex-col sm:flex-row justify-around items-center w-full max-w-md mb-8 space-y-4 sm:space-y-0">
        <div className="text-xl sm:text-2xl font-semibold bg-white bg-opacity-10 py-2 px-4 rounded-full shadow-md">
          Score: <span className="text-yellow-200">{score}</span>
        </div>
        <div className="text-xl sm:text-2xl font-semibold bg-white bg-opacity-10 py-2 px-4 rounded-full shadow-md">
          High Score: <span className="text-green-300">{highScore}</span>
        </div>
      </div>

      <p className="text-lg sm:text-xl font-medium mb-8 text-center min-h-[4rem] flex items-center justify-center">
        {message}
      </p>

      <div className="flex items-center justify-center space-x-8 mb-10 w-full">
        <CardDisplay card={currentCard} />
        <span className="text-4xl font-bold">vs</span>
        <CardDisplay card={nextCard} isHidden={!revealingNextCard && !gameOver} />
      </div>

      <div className="flex space-x-4 mb-6 sticky bottom-0 bg-transparent p-4 w-full justify-center">
        {!gameOver ? (
          <>
            <button
              onClick={() => handleGuess('higher')}
              disabled={revealingNextCard || !currentCard}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Higher
            </button>
            <button
              onClick={() => handleGuess('lower')}
              disabled={revealingNextCard || !currentCard}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Lower
            </button>
          </>
        ) : (
          <button
            onClick={handlePlayAgain}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Play Again
          </button>
        )}
      </div>

      <div className="text-sm mt-4 text-gray-300">
        Cards remaining: {deck.length}
      </div>
    </div>
  );
};

export default App;
