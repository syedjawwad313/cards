import { Rank, Suit } from './types';

export const CARD_SUITS: Suit[] = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];

export const CARD_RANKS: { [key: string]: number } = {
  [Rank.Two]: 2,
  [Rank.Three]: 3,
  [Rank.Four]: 4,
  [Rank.Five]: 5,
  [Rank.Six]: 6,
  [Rank.Seven]: 7,
  [Rank.Eight]: 8,
  [Rank.Nine]: 9,
  [Rank.Ten]: 10,
  [Rank.Jack]: 11,
  [Rank.Queen]: 12,
  [Rank.King]: 13,
  [Rank.Ace]: 14,
};

export const INITIAL_SCORE = 0;
export const DEFAULT_MESSAGE = "Guess Higher or Lower!";
export const WIN_MESSAGE = "Correct! Keep going!";
export const LOSE_MESSAGE = "Wrong guess! Game Over.";
export const EMPTY_DECK_MESSAGE = "No more cards! Deck shuffled for a new game.";
