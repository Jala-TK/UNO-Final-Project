import React, { useState, useEffect, useRef } from 'react';
import { getAPIClientNoCache } from '@/services/axios';
import { AxiosError } from 'axios';
import styles from './Hand.module.css';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import Card from '@/components/game/Card';
import ColorSelector from '@/components/game/color-selector'; // Importe o ColorSelector

interface HandPlayerProps {
  gameId: number;
  className: string;
}

const apiClient = getAPIClientNoCache();

const fetchCardsData = async (gameId: number) => {
  const result = await apiClient.post(`/api/game/hand?timestamp=${new Date().getTime()}`, { game_id: gameId });
  return result.data.hand;
};
const ITEMS_PER_PAGE = 10;

const HandPlayer: React.FC<HandPlayerProps> = ({ gameId, className }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageError, setMessageError] = useState<string>('');
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [visibleCards, setVisibleCards] = useState(cards.slice(0, ITEMS_PER_PAGE));

  useEffect(() => {
    if (cards.length > 0) {
      setVisibleCards(cards.slice(0, ITEMS_PER_PAGE));
    }
  }, [cards]);
  const rotateCards = (direction: 'left' | 'right') => {
    setVisibleCards((prevCards) => {
      const cardsArray = [...cards];
      const currentVisibleIndices = cardsArray.slice(cardsArray.indexOf(prevCards[0]), cardsArray.indexOf(prevCards[0]) + ITEMS_PER_PAGE);
      let newVisibleCards: Card[];

      if (direction === 'left') {
        // Remove a primeira carta e adiciona a próxima da lista
        newVisibleCards = [...prevCards.slice(1), cardsArray[(cardsArray.indexOf(prevCards[prevCards.length - 1]) + 1) % cardsArray.length]];
      } else {
        // Remove a última carta e adiciona a carta anterior da lista
        newVisibleCards = [cardsArray[(cardsArray.indexOf(prevCards[0]) - 1 + cardsArray.length) % cardsArray.length], ...prevCards.slice(0, -1)];
      }

      return newVisibleCards;
    });
  };


  useEffect(() => {
    const loadCardsData = async () => {
      try {
        const data = await fetchCardsData(gameId);
        setCards(data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    loadCardsData();
  }, [gameId]);

  const handleError = (error: unknown) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      if (error.response?.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = 'Aconteceu um erro: ' + error.message;
      }
    } else {
      errorMessage = error as string || 'Erro desconhecido';
    }

    setMessageError(errorMessage);
  };

  const handleCardClick = async (card: Card, gameId: number) => {
    // TODO: Adicionar verificação de player atual
    setSelectedCard(card);
    if (card.color === 'wild') {
      setShowColorSelector(true);
    } else {
      await apiClient.post(`/api/cards/play?timestamp=${new Date().getTime()}`, {
        game_id: gameId,
        card_id: card.id,
      });
    }
  };

  const handleSelectColor = async (selectedColor: string) => {
    if (selectedCard) {
      setShowColorSelector(false);
      await apiClient.post(`/api/cards/play?timestamp=${new Date().getTime()}`, {
        game_id: gameId,
        card_id: selectedCard.id,
        color: selectedColor,
      });
    }
  };

  const handleDoubleClick = async (card: Card) => {
    try {
      await handleCardClick(card, gameId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCloseDialog = () => {
    setMessageError('');
  };

  if (loading) return <div>Loading...</div>;

  if (!cards.length) return <div>No cards in hand</div>;

  return (
    <div className={className}>
      <Dialog open={messageError.length > 0} onClose={handleCloseDialog}>
        <DialogContent className={styles.dialogConfirmation}>
          {messageError}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button onClick={handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
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
