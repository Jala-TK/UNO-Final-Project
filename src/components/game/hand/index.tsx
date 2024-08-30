/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import styles from './Hand.module.css';
import { Card } from '@/types/types';
import ColorSelector from '@/components/game/color-selector';
import { handleError } from '@/utils/handleError';
import { playCard, playWildCard } from '@/services/cardService';
import { useMessage } from '@/context/MessageContext';

interface HandPlayerProps {
  gameId: number;
  currentPlayer: boolean;
  cards: Card[];
  className: string;
}

const ITEMS_PER_PAGE = 10;

const HandPlayer: React.FC<HandPlayerProps> = ({ currentPlayer, gameId, cards, className }) => {
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [visibleCards, setVisibleCards] = useState(cards.slice(0, ITEMS_PER_PAGE));
  const { setMessage } = useMessage();

  useEffect(() => {
    if (cards.length > 0) {
      setVisibleCards(cards.slice(0, ITEMS_PER_PAGE));
    }
  }, [cards]);
  const rotateCards = (direction: 'left' | 'right') => {
    setVisibleCards((prevCards) => {
      const cardsArray = [...cards];
      let newVisibleCards: Card[];

      if (direction === 'left') {
        newVisibleCards = [...prevCards.slice(1), cardsArray[(cardsArray.indexOf(prevCards[prevCards.length - 1]) + 1) % cardsArray.length]];
      } else {
        newVisibleCards = [cardsArray[(cardsArray.indexOf(prevCards[0]) - 1 + cardsArray.length) % cardsArray.length], ...prevCards.slice(0, -1)];
      }
      return newVisibleCards;
    });
  };



  const handleCardClick = async (card: Card, gameId: number) => {
    if (!currentPlayer) {
      return;
    }
    setSelectedCard(card);
    try {
      if (card.color === 'wild') {
        setShowColorSelector(true);
      } else {
        const play = await playCard(gameId, card.id);
        if (!play.success) setMessage(play.message);
      }
    } catch (error) {
      setMessage(handleError(error))
    }
  };

  const handleSelectColor = async (selectedColor: string) => {
    if (selectedCard) {
      setShowColorSelector(false);
      try {
        const play = await playWildCard(gameId, selectedCard.id, selectedColor);
        if (!play.success) setMessage(play.message);
      } catch (error) {
        setMessage(handleError(error))
      }
    }
  };

  const handleDoubleClick = async (card: Card) => {
    try {
      await handleCardClick(card, gameId);
    } catch (error) {
      setMessage(handleError(error))
    }
  };

  if (!cards.length) return <div>No cards in hand</div>;

  return (
    <div className={className}>
      <div className={styles.handPlayer}>
        <button
          className={`${styles.carouselButton} ${styles.prevButton}`}
          onClick={() => rotateCards('left')}
          disabled={cards.length <= ITEMS_PER_PAGE}
        >
          ‹
        </button>
        <div className={styles.cardsContainer}>
          {visibleCards.map((card) => (
            <div key={card.id} className={styles.card}>
              <img
                className={styles.imageCard}
                alt={card.description}
                src={card.image}
                onDoubleClick={() => handleDoubleClick(card)}
              />
            </div>
          ))}
        </div>
        <button
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={() => rotateCards('right')}
          disabled={cards.length <= ITEMS_PER_PAGE}
        >
          ›
        </button>
      </div>
      {showColorSelector && (
        <ColorSelector onSelectColor={handleSelectColor} />
      )}
    </div>
  );
};

export default HandPlayer;
