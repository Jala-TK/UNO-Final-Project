"use client";

import React, { useState, useEffect } from 'react';
import styles from './Game.module.css';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Player from '@/components/game/player';
import { parseCookies } from 'nookies';
import { useRouter } from "next/navigation";
import PopUpSettings from '@/components/popup';
import { GameProps, GameStatusProps } from '@/types/types';
import { useSocket } from '@/context/SocketContext';
import { handleError } from '@/utils/handleError';
import {
  fetchGameStatusData,
  fetchGameData,
  exitGame,
  startGame,
  dealerCards,
  getTopCard,
  fetchCardsData
} from '@/services/gameService';

// TODO: botão challenge adicionar.
// TODO: botão gritar uno.
// TODO: botao sair do jogo.
// TODO: score do jogador.
// TODO: som ?!
// TODO: circulo da foto, tempo para jogada. 
// TODO: adicionar cartas que podem jogar
// TODO: adicionar mensagens para o jogador



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
      if (message?.updateGame === gameId || message === 'updatedGame' || message.type === 'drawCards') {
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
          {Object.keys(gameStatus.players).map((playerName, index) => (
            <Player
              key={playerName}
              playerName={playerName}
              hand={gameStatus.players[playerName].cards.length}
              wins={gameStatus.players[playerName].wins}
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
