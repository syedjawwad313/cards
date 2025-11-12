import { Card, Suit, Rank } from '../types';
import { CARD_SUITS, CARD_RANKS } from '../constants';

/**
 * Creates a standard 52-card deck.
 * @returns An array of Card objects representing a new deck.
 */
export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of CARD_SUITS) {
    for (const rankStr in CARD_RANKS) {
      if (CARD_RANKS.hasOwnProperty(rankStr)) {
        deck.push({
          suit: suit,
          rank: rankStr as Rank,
          value: CARD_RANKS[rankStr],
        });
      }
    }
  }
  return deck;
};

/**
 * Shuffles a deck of cards using the Fisher-Yates (Knuth) algorithm.
 * @param deck The deck of cards to shuffle.
 * @returns A new array representing the shuffled deck.
 */
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]; // Swap elements
  }
  return shuffledDeck;
};
