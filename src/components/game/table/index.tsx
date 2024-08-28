import type { NextPage } from 'next';
import styles from './Table.module.css';
import Pile from '../pile';
import React, { useState, useEffect } from 'react';
import { getAPIClientNoCache } from '@/services/axios';
import { AxiosError } from 'axios';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import Card from '@/components/game/Card';

interface TableProps {
  gameId: number;
  className: string
}

const Table: NextPage<TableProps> = ({ gameId, className }) => {
  const [topCard, setTopCard] = useState<Card>();
  const [loading, setLoading] = useState<boolean>(true);
  const [messageError, setMessageError] = useState('');
  const apiClient = getAPIClientNoCache();

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        if (gameId !== null) {
          const result = await apiClient.post(`/api/game/topCard?timestamp=${new Date().getTime()}`, { game_id: gameId });

          setTopCard(result.data.card);
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


  const handleCloseDialog = () => {
    setMessageError('');
  };

  if (loading) return <div>Loading...</div>;

  if (!topCard) return <div>No cards in hand</div>;

  return (
    <div className={className}>
      <div className={styles.tableContainer}>
        <Dialog open={messageError.length > 0} onClose={handleCloseDialog}>
          <DialogContent className={styles.dialogConfirmation}>
            {messageError}
          </DialogContent>
          <DialogActions className={styles.dialogConfirmation}>
            <Button onClick={handleCloseDialog}>Ok</Button>
          </DialogActions>
        </Dialog>
        <div className={styles.table}>
          <Pile topCard={topCard} className={styles.monte} />
        </div>
      </div>
    </div>
  );
};

export default Table;
