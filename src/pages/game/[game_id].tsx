import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAPIClient } from '@/services/axios';
import { AxiosError } from 'axios';
import styles from './Game.module.css';
import Navbar from '@/components/navbar/navbar';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Card from '@/components/game/Card';
import { GetServerSideProps } from 'next';
import { User } from '@/context/AuthContext';
import { selectStatusGeral } from '@/services/games/getStatusGeral';
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


export const getServerSideProps: GetServerSideProps<{
  user: User | undefined;
}> = async (ctx) => {
  const gameId = ctx.query.game_id

  const apiClient = getAPIClient(ctx);

  const result = await selectStatusGeral(apiClient, { game_id: Number(gameId) })

  return {
    props: {
      user: undefined,
    },
  }
}

const GamePage: React.FC = async () => {
  const [game, setGame] = useState<GameProps | null>(null);
  const [messageError, setMessageError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiClient = getAPIClient();
  const [gameId, setGameId] = useState<number | null>(null);

  useEffect(() => {
    const id = router.query.id;
    if (typeof id === 'string') {
      setGameId(parseInt(id, 10));
    }
  }, [router.query.id]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (gameId !== null) {
          const result = await apiClient.post('/api/game/statusGeral', { game_id: gameId });
          setGame(result.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };


    fetchGameData();
  }, [gameId]);

  useEffect(() => {

  }, [gameId]);


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

  if (loading) return <div>Loading...</div>;

  if (!game) return <div>No game data available</div>;

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Dialog open={messageError.length > 0} onClose={handleCloseDialog}>
        <DialogContent className={styles.dialogConfirmation}>
          {messageError}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button onClick={handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>

      <div>
        <Player playerId={0} className={styles.player/* Container */} /> {'// TODO: Update to use player response'}

      </div>
      <Table gameId={gameId ?? 0} className={styles.tableGame} />

      <HandPlayer gameId={gameId ?? 0} className={styles.handContainer} />

    </div>
  );
};

export default GamePage;
