"use client";

import React, { useState, useEffect } from 'react';
import { getAPIClientNoCache } from '@/services/axios';
import styles from './Game.module.css';
import Navbar from '@/components/navbar/navbar';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Player from '@/components/game/player';
import { parseCookies } from 'nookies';
import { useRouter } from "next/navigation";
import PopUpSettings from '@/components/popup/settings';
import Card from '@/components/game/Card';
import { useSocket } from '@/context/SocketContext';
import { handleError } from '@/utils/handleError';


const apiClient = getAPIClientNoCache();

interface GameStatusProps {
  game_id: number;
  current_player: string;
  direction: string;
  top_card: string;
  hands: {
    [playerName: string]: {
      wins: number;
      cards: Card[];
    };
  };
  turnHistory: any[];
}
interface GameProps {
  id: number;
  title: string;
  status: string;
  maxPlayers: number;
  creator: string;
  players: string[];
}


async function fetchGameStatusData(gameId: number | null): Promise<GameStatusProps | null> {
  const result = await apiClient.post(`/api/game/statusGeral?timestamp=${new Date().getTime()}`, { game_id: gameId });
  return result.data;
}

async function fetchGameData(gameId: number | null): Promise<GameProps | null> {
  const result = await apiClient.post(`/api/games/${gameId}?timestamp=${new Date().getTime()}`);
  return result.data;
}

async function exitGame(gameId: number | null): Promise<boolean> {
  const result = await apiClient.post(`/api/game/leave?timestamp=${new Date().getTime()}`, { game_id: gameId });
  if (result.status === 200) {
    return true;
  }
  return false;
}

async function startGame(gameId: number | null): Promise<boolean> {
  const result = await apiClient.post(`/api/game/start?timestamp=${new Date().getTime()}`, { game_id: gameId });
  if (result.status === 200) {
    return true;
  }
  return false;
}

async function dealerCards(gameId: number | null, players: string[]): Promise<boolean> {
  const result = await apiClient.post(`/api/game/dealCards/${gameId}`, {
    players: players,
    cardsPerPlayer: 7
  });
  if (result.status === 200) {
    return true;
  }
  return false;
}

async function getTopCard(gameId: number | null): Promise<any> {
  const result = await apiClient.post(`/api/game/topCard?timestamp=${new Date().getTime()}`, { game_id: gameId });
  return result.data;

}

async function fetchCardsData(gameId: number | null): Promise<Card[]> {
  const result = await apiClient.post(`/api/game/hand?timestamp=${new Date().getTime()}`, { game_id: gameId });
  return result.data.hand;
}



// TODO: botão challenge adicionar.
// TODO: botao sair do jogo.
// TODO: score do jogador.
// TODO: som ?!
// TODO: circulo da foto, tempo para jogada. 

const GamePage: React.FC<{ params: { game_id: string } }> = ({ params }) => {
  const { socket, isConnected } = useSocket();
  const gameId = Number(params.game_id);
  const { 'nextauth.token.user': user } = parseCookies();
  const [game, setGame] = useState<GameProps | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatusProps | null>(null);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>(false);
  const [topCard, setTopCard] = useState<Card | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [messageError, setMessageError] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const router = useRouter()

  const loadGame = async () => {
    try {
      const gameData = await fetchGameData(gameId);
      setGame(gameData);
    } catch (error) {
      setMessageError(handleError(error));
    }
  };

  const loadGameStatus = async () => {
    try {
      const data = await fetchGameStatusData(gameId);
      setGameStatus(data);
    } catch (error) {
      setMessageError(handleError(error));
    }
  };

  const loadTopCard = async () => {
    try {
      const data = await getTopCard(gameId);
      setTopCard(data.card);
    } catch (error) {
      setMessageError(handleError(error));
    }
  };

  const loadCards = async () => {
    try {
      const data = await fetchCardsData(gameId);
      setCards(data);
    } catch (error) {
      setMessageError(handleError(error));
    }
  };

  const handlerCurrentPlayer = async () => {
    if (gameStatus && gameStatus.current_player) {
      const isCurrentPlayer = gameStatus.current_player === user;
      console.log("currentPlayer", isCurrentPlayer, gameStatus.current_player);
      setIsCurrentPlayer(isCurrentPlayer);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    if (isConnected) {
      loadGame();
      loadGameStatus();
      loadTopCard()
      loadCards();
      console.log("Game is connected");
    }

    const handleUpdate = async (message: any) => {
      if (message?.updateGame === gameId || message === 'updatedGame') {
        console.log('Jogos atualizados', message);
        loadGame();
        loadGameStatus();
        loadTopCard()
      }
      if (message?.updatedHand === 'update' && message?.player === user) {
        console.log('Cartas atualizadas', message);
        loadCards();
      }
    };

    socket.on('update', handleUpdate);

    return () => {
      socket.off('update', handleUpdate);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    handlerCurrentPlayer();
  }, [gameStatus]);

  const handleCloseDialog = () => {
    setMessageError('');
  };

  const handleClosePopup = async () => {
    const exit = await exitGame(gameId);
    if (exit) {
      router.push("/games");
    }
  };

  const handleConfirm = async () => {
    const start = await startGame(gameId);
    const dealer = await dealerCards(gameId, game?.players || [])
    if (start && dealer) {
      setShowPopup(false);
      console.log('Game Started');
    }
  };

  if (!game) return (<div>No game data available</div>);

  if (!gameStatus) {
    return (<div>
      {showPopup && (
        <PopUpSettings
          title={game.title}
          waitingMessage={game.status}
          playerCount={`${game.players.length}/${game.maxPlayers}`}
          buttonText={game.players.length > 1 && game.creator == user ? "Start Game" : "Exit Game"}
          onClose={handleClosePopup}
          onConfirm={(game.players.length > 1 && game.creator) ? handleConfirm : handleClosePopup}
        />
      )}
    </div>
    );
  }

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
          {Object.keys(gameStatus.hands).map((playerName, index) => (
            <Player
              key={playerName}
              playerName={playerName}
              hand={gameStatus.hands[playerName]?.cards?.length || 0}
              wins={gameStatus.hands[playerName]?.wins || 0}
              className={`${playerName === user ? styles.currentUser : styles.player}`}
              currentPlayer={gameStatus.current_player === playerName ? true : false}
            />
          ))}
        </div>
        <Table currentPlayer={isCurrentPlayer} gameId={gameId} topCard={topCard} className={styles.tableContainer} />
      </div>
      <HandPlayer currentPlayer={isCurrentPlayer} gameId={gameId} cards={cards} className={styles.handContainer} />

    </div>
  );
};

export default GamePage;
