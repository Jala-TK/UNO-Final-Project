"use client";

import React, { useState, useEffect } from 'react';
import { getAPIClientNoCache } from '@/services/axios';
import { AxiosError } from 'axios';
import styles from './Game.module.css';
import Navbar from '@/components/navbar/navbar';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Player from '@/components/game/player';
import { parseCookies } from 'nookies';
import { useRouter } from "next/navigation";
import PopUpSettings from '@/components/popup/settings';
import io from 'socket.io-client';
const socket = io();

const apiClient = getAPIClientNoCache();

interface GameStatusProps {
  game_id: number;
  current_player: string;
  direction: string;
  top_card: string;
  hands: {
    [playerName: string]: Card[];
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


// TODO: Popup confirmar entrada no jogo e prontidao;
// TODO: Automatizar prontidao do criador.
// TODO: Popup aguardando jogadores, aguardando todos ficarem prontos, <OK>
// TODO: se todos estiverem prontos inicia automaticamente, se quiser inciar antes pressionar botao começar.
// TODO: ação de começar deve startar o game e dar as cartas. <OK>
// TODO: botão challenge adicionar.
// TODO: verificar quais requisições precisam de no-cache. <OK>
// TODO: botao sair do jogo.
// TODO: score do jogador.
// TODO: som ?!
// TODO: circulo da foto, tempo para jogada. 
// TODO: monte de comprar

const GamePage: React.FC<{ params: { game_id: string } }> = ({ params }) => {
  const gameId = Number(params.game_id);
  const { 'nextauth.token.user': user } = parseCookies();
  const [game, setGame] = useState<GameProps | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatusProps | null>(null);
  const [dealCards, setDealCards] = useState(true);
  const [messageError, setMessageError] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const loadGame = async () => {
      try {
        const gameData = await fetchGameData(gameId);
        if (gameData?.status === 'Waiting for players') {
        }
        setGame(gameData);
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessageError(error.response?.data.error || 'Erro ao carregar os dados do jogo');
        } else {
          setMessageError('Erro desconhecido');
        }
      }
    };

    loadGame();
  }, [gameId && showPopup]);

  useEffect(() => {
    const actionDealCards = async () => {
      try {
        if (game && game.creator == user && !dealCards) {
          await dealerCards(gameId, game?.players || [])
          setDealCards(true);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessageError(error.response?.data.error || 'Erro ao carregar os dados do jogo');
        } else {
          setMessageError('Erro desconhecido');
        }
      }
    };

    actionDealCards();
  }, [game && !showPopup && !dealCards]);

  useEffect(() => {
    // Ouvir o evento gameStatusUpdate
    socket.on('gameStatusUpdate', (data) => {
      console.log('Status do jogo atualizado:', data);
      setGameStatus(data);
    });

    // Limpar os ouvintes ao desmontar o componente
    return () => {
      socket.off('gameStatusUpdate');
    };
  }, []);


  useEffect(() => {
    const loadGameStatus = async () => {
      try {
        const data = await fetchGameStatusData(gameId);
        setGameStatus(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessageError(error.response?.data.error || 'Erro ao carregar os dados do jogo');
        } else {
          setMessageError('Erro desconhecido');
        }
      }
    };

    loadGameStatus();
  }, [gameId && !showPopup]);

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
    if (start) {
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
          onConfirm={(game.creator == user) ? handleConfirm : handleClosePopup}
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
              hand={gameStatus.hands[playerName].length}
              wins={playerName === user ? 100 : 0}
              className={`${playerName === user ? styles.currentUser : styles.player}`}
              currentPlayer={gameStatus.current_player === playerName ? true : false}
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
