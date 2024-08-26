"use client";

import React, { useState } from 'react';
import { getAPIClient } from '@/services/axios';
import { AxiosError } from 'axios';
import styles from './Game.module.css';
import Navbar from '@/components/navbar/navbar';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Card from '@/components/game/Card';
import Player from '@/components/game/player';

interface GameProps {
  game_id: number;
  current_player: string;
  direction: string;
  top_card: string;
  hands: {
    [playerName: string]: Card[];
  };
  turnHistory: any[];
}

async function fetchGameData(gameId: number | null): Promise<GameProps | null> {
  const apiClient = getAPIClient();

  const result = await apiClient.post('/api/game/statusGeral', { game_id: gameId })

  return result.data;
}

const GamePage: React.FC<{ params: { game_id: string } }> = ({ params }) => {
  const gameId = Number(params.game_id);

  const game = fetchGameData(gameId).catch((error: AxiosError) => { return null });
  const [messageError, setMessageError] = useState('');

  const handleError = (error: unknown) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      if (error.response?.data.error) {
        errorMessage = error.response.data.error;
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

  if (!game) return (<div>No game data available</div>)

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Dialog open={false} onClose={handleCloseDialog}>
        <DialogContent className={styles.dialogConfirmation}>
          {messageError}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button onClick={handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>

      <div>
        <Player playerId={0} className={styles.player/* Container */} /> {/* TODO: Update to use player response */}
      </div>
      <Table gameId={gameId ?? 0} className={styles.tableGame} />
      <HandPlayer gameId={gameId ?? 0} className={styles.handContainer} />
    </div>
  );
};

export default GamePage;
