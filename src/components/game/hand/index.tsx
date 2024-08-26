import type { NextPage } from 'next';
import styles from './Hand.module.css';
import React, { useState, useEffect } from 'react';
import { getAPIClient } from '@/services/axios';
import { AxiosError } from 'axios';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import Card from '@/components/game/Card';


interface HandPlayerProps {
  gameId: number;
  className: string
}

const HandPlayer: NextPage<HandPlayerProps> = ({ gameId, className }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageError, setMessageError] = useState('');
  const apiClient = getAPIClient();

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        if (gameId !== null) {
          const result = await apiClient.post('/api/game/hand', { game_id: gameId });

          setCards(result.data.hand);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardsData();
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

  const handleCardClick = async (cardId: number) => {
    try {
      const result = await apiClient.post('/api/cards/play', { game_id: gameId, card_id: cardId });

    } catch (error) {
      console.dir(error);
      handleError(error);
    }
  };

  const handleDoubleClick = (cardId: number) => {
    handleCardClick(cardId);
    // Add animation logic here
  };

  const handleCloseDialog = () => {
    setMessageError('');
  };

  if (loading) return <div>Loading...</div>;

  if (!cards) return <div>No cards in hand</div>;

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
      <div className={className}>
        <div className={styles.handPlayer}>
          {cards.map((card) => (
            <div key={card.id} className={styles.card}>
              <img className={styles.imageCard} alt={card.description} src={card.image} onDoubleClick={() => handleDoubleClick(card.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandPlayer;
