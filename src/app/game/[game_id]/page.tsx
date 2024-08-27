"use client";

import React, { useState, useEffect } from 'react';
import { getAPIClient } from '@/services/axios';
import { AxiosError } from 'axios';
import styles from './Game.module.css';
import Navbar from '@/components/navbar/navbar';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Player from '@/components/game/player';
import { parseCookies } from 'nookies';

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
  const result = await apiClient.post('/api/game/statusGeral', { game_id: gameId });
  return result.data;
}

const GamePage: React.FC<{ params: { game_id: string } }> = ({ params }) => {
  const gameId = Number(params.game_id);
  const { 'nextauth.token.user': user } = parseCookies();
  console.log(user);
  const [game, setGame] = useState<GameProps | null>(null);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await fetchGameData(gameId);
        setGame(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessageError(error.response?.data.error || 'Erro ao carregar os dados do jogo');
        } else {
          setMessageError('Erro desconhecido');
        }
      }
    };

    loadGame();
  }, [gameId]);

  const handleCloseDialog = () => {
    setMessageError('');
  };

  if (!game) return (<div>No game data available</div>);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Dialog open={!!messageError} onClose={handleCloseDialog}>
        <DialogContent className={styles.dialogConfirmation}>
          {messageError}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button onClick={handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>

      <div className={styles.tableContainer}>
        <div className={styles.playersContainer}>
          {Object.keys(game.hands).map((playerName, index) => (
            <Player
              key={playerName}
              playerName={playerName}
              hand={game.hands[playerName].length}
              wins={playerName === user ? 100 : 0} // Atualize wins conforme necessário
              className={`${playerName === user ? styles.currentUser : styles.player}`}
            />


          ))}
        </div>
        <Table gameId={gameId} className={styles.tableContainer} />
      </div>

      <HandPlayer gameId={gameId} className={styles.handContainer} />
    </div>
  );
};

export default GamePage;
