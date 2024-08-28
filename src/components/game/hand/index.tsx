"use client";

import React, { useState, useEffect } from 'react';
import { getAPIClientNoCache } from '@/services/axios';
import { AxiosError } from 'axios';
import styles from './Hand.module.css';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import Card from '@/components/game/Card';

interface HandPlayerProps {
  gameId: number;
  className: string;
}
const apiClient = getAPIClientNoCache();

const fetchCardsData = async (gameId: number) => {
  const result = await apiClient.post(`/api/game/hand?timestamp=${new Date().getTime()}`, { game_id: gameId });
  return result.data.hand;
};

const handleCardClick = async (cardId: number, gameId: number) => {
  await apiClient.post(`/api/cards/play?timestamp=${new Date().getTime()}`, { game_id: gameId, card_id: cardId });
};

const HandPlayer: React.FC<HandPlayerProps> = ({ gameId, className }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageError, setMessageError] = useState<string>('');

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

  const handleDoubleClick = async (cardId: number) => {
    try {
      await handleCardClick(cardId, gameId);
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
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <img
              className={styles.imageCard}
              alt={card.description}
              src={card.image}
              onDoubleClick={() => handleDoubleClick(card.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandPlayer;
