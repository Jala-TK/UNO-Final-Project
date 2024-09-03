/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import styles from './Hand.module.css';
import { Card, CardPlayable } from '@/types/types';
import ColorSelector from '@/components/game/color-selector';
import { handleError } from '@/utils/handleError';
import { playCard, playWildCard } from '@/services/cardService';
import { useMessage } from '@/context/MessageContext';

interface HandPlayerProps {
  gameId: number;
  currentPlayer: boolean;
  cards: Card[];
  className: string;
  playableCards: CardPlayable[] | [];
}

const ITEMS_PER_PAGE = 10;

const HandPlayer: React.FC<HandPlayerProps> = ({ currentPlayer, gameId, cards, className, playableCards }) => {
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [visibleCards, setVisibleCards] = useState<Card[]>([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    if (cards && cards.length > 0) {
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
        if (play.data.cardDrawn) setMessage(play.data.message);
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
        if (play.data.cardDrawn) setMessage(play.data.message);
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

  const isPlayable = (card: Card, playableCards: CardPlayable[]): boolean => {
    return playableCards.some(playableCard => playableCard.id === card.id);
  };


  if (!cards || !cards.length) return <div>No cards in hand</div>;

  return (
    <div className={className}>
      <div className={styles.handPlayer}>
        <button
          className={cards.length > ITEMS_PER_PAGE ? `${styles.carouselButton} ${styles.prevButton}` : styles.invisibleArrow}
          onClick={() => rotateCards('left')}
          disabled={cards.length <= ITEMS_PER_PAGE}
        >
          ‹
        </button>
        <div className={styles.cardsContainer}>
          {visibleCards.map((card) => (
            <div key={card.id} className={styles.card}>
              <img
                className={`${styles.imageCard} ${playableCards ? (isPlayable(card, playableCards) ? styles.playableCard : '') : ''}`}
                alt={card.description}
                src={card.image}
                onClick={() => handleDoubleClick(card)}
              />
            </div>
          ))}
        </div>
        <button
          className={cards.length > ITEMS_PER_PAGE ? `${styles.carouselButton} ${styles.nextButton}` : styles.invisibleArrow}

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
