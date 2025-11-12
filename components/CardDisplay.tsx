import React from 'react';
import { Card, Suit } from '../types';

interface CardDisplayProps {
  card: Card | null;
  isHidden?: boolean;
}

const getSuitColorClass = (suit: Suit) => {
  return suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-600' : 'text-gray-800';
};

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, isHidden = false }) => {
  if (isHidden || !card) {
    return (
      <div className="relative w-32 h-44 sm:w-40 sm:h-56 bg-gray-700 border-4 border-gray-800 rounded-lg shadow-lg flex items-center justify-center text-white text-3xl sm:text-4xl font-bold transition-all duration-300 transform hover:scale-105">
        <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-7xl font-sans opacity-20">?</span>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-md p-2 flex flex-col justify-between">
          <div className="flex justify-start items-start text-white text-base sm:text-lg">
            <span className="opacity-70">TOP</span>
          </div>
          <div className="flex justify-center items-center text-white text-5xl sm:text-7xl">
            <span className="opacity-70">?</span>
          </div>
          <div className="flex justify-end items-end text-white text-base sm:text-lg transform rotate-180">
            <span className="opacity-70">TOP</span>
          </div>
        </div>
      </div>
    );
  }

  const suitColorClass = getSuitColorClass(card.suit);

  return (
    <div className="relative w-32 h-44 sm:w-40 sm:h-56 bg-white border-4 border-gray-300 rounded-lg shadow-xl p-2 flex flex-col justify-between transition-all duration-300 transform hover:scale-105">
      {/* Top Left Rank and Suit */}
      <div className="flex flex-col items-start leading-none">
        <span className={`text-xl sm:text-2xl font-bold ${suitColorClass}`}>{card.rank}</span>
        <span className={`text-xl sm:text-2xl ${suitColorClass}`}>{card.suit}</span>
      </div>

      {/* Center Large Suit */}
      <div className="flex justify-center items-center flex-grow">
        <span className={`text-5xl sm:text-7xl ${suitColorClass}`}>{card.suit}</span>
      </div>

      {/* Bottom Right Rank and Suit (rotated) */}
      <div className="flex flex-col items-end leading-none transform rotate-180">
        <span className={`text-xl sm:text-2xl font-bold ${suitColorClass}`}>{card.rank}</span>
        <span className={`text-xl sm:text-2xl ${suitColorClass}`}>{card.suit}</span>
      </div>
    </div>
  );
};
