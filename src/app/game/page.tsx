"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Game.module.css';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import HandPlayer from '@/components/game/hand';
import Table from '@/components/game/table';
import Player from '@/components/game/player';
import { useRouter } from "next/navigation";
import PopUpSettings from '@/components/popup';
import { Card, GameProps, GameStatusProps, Scores } from '@/types/types';
import { useSocket } from '@/context/SocketContext';
import { handleError } from '@/utils/handleError';
import {
  fetchGameStatusData,
  fetchGameData,
  exitGame,
  startGame,
  dealerCards,
  getTopCard,
  fetchCardsData,
  fetchCardsPlayableData,
  fetchScoreData,
  skip
} from '@/services/gameService';
import { useMessage } from '@/context/MessageContext';
import MessageBar from '@/components/message-bar';
import UnoButton from '@/components/game/uno';
import { useAuth } from '@/context/AuthContext';
import Podio from '@/components/game/end-game';
import SettingsToogle from '@/components/settings-menu';

// TODO: Circulo da foto, <Tempo para jogada>. 
// TODO: Estilizar componente do player para ficar mais bonito.


const GamePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const gameSession = localStorage.getItem('game') || '';
  if (!gameSession) {
    router.push("/games");
  }
  const gameId = Number(gameSession);
  const [game, setGame] = useState<GameProps | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatusProps | null>(null);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>(false);
  const [topCard, setTopCard] = useState<Card | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [messageError, setMessageError] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [finishGame, setFinishGame] = useState(false);
  const { message, setMessage } = useMessage();
  const [playableCards, setPlayableCards] = useState<Card[]>([]);
  const [scores, setScores] = useState<Scores[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timeLeft, setTimeLeft] = useState(50);


  const loadGame = async () => {
    try {
      const gameData = await fetchGameData(gameId);
      if (gameData.success) {
        setGame(gameData.data);
      }
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const loadGameStatus = async () => {
    try {
      const data = await fetchGameStatusData(gameId);
      if (data.success) {
        const inGame =
          Object.keys(data.data.players)
            .some((playerName) => playerName === user?.username);

        if (inGame) {
          setGameStatus(data.data);
        }
        else {
          router.push("/games");
        }
      }
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const loadTopCard = async () => {
    try {
      const data = await getTopCard(gameId);
      if (data.success) {
        setTopCard(data.data.card);
      }
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const loadCards = async () => {
    try {
      const data = await fetchCardsData(gameId);
      if (data.success) {
        setCards(data.data);
      }
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const loadPlayableCards = async () => {
    try {
      const data = await fetchCardsPlayableData(gameId);
      if (data.success) {
        setPlayableCards(data.data);
      }
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const loadScore = async () => {
    try {
      const scoresData = await fetchScoreData(gameId);
      if (scoresData.success) {
        setScores(scoresData.data);
      }
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const skipTurn = async () => {
    try {
      await skip(gameId);
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const leaveGame = async () => {
    try {
      await exitGame(gameId);
      localStorage.removeItem('game');
    } catch (error) {
      setMessage(handleError(error));
    }
  };

  const handlerCurrentPlayer = async () => {
    if (gameStatus && gameStatus.current_player) {
      const isCurrentPlayer = gameStatus.current_player === user?.username;
      setIsCurrentPlayer(isCurrentPlayer);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    if (isConnected) {
      loadGame();
      loadGameStatus();
      loadTopCard();
      loadCards();
      loadPlayableCards();
      loadScore();
      console.log("Game is connected");
    }

    const handleUpdate = async (message: any) => {
      if (message?.updateGame === gameId || message === 'updatedGame' || message.type === 'drawCards') {
        loadGame();
        loadGameStatus();
        loadTopCard();
        loadScore();
      }
      if (message?.updatedHand === 'update') {
        loadCards();
        loadPlayableCards();
      }

      if (message.type == "winGame" || message === 'winGame') {
        setFinishGame(true);
        loadScore();
        setMessage(`${message.player}, ganhou o jogo!`);
      }
    };

    socket.on('update', handleUpdate);

    return () => {
      socket.off('update', handleUpdate);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    setTimeLeft(50);
    handlerCurrentPlayer();
    setMessage('')
  }, [gameStatus]);

  // TODO: Verificar alternativa para o useEffect.
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    if (isCurrentPlayer) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            skipTurn();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isCurrentPlayer, skipTurn]);

  useEffect(() => {
    if (isCurrentPlayer && timeLeft > 0) {
      setMessage(`You have ${timeLeft} seconds to make a move.`);
    }
  }, [timeLeft, setMessage]);

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
    const dealer = await dealerCards(gameId, game?.players || []);
    if (start && dealer) {
      setShowPopup(false);
    }
  };

  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
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
          buttonText={game.players.length > 1 && game.creator == (user?.username) ? "Start Game" : "Exit Game"}
          onClose={handleClosePopup}
          onConfirm={(game.players.length > 1 && game.creator) ? handleConfirm : handleClosePopup}
        />
      )}
    </div>
    );
  }

  let score = 0;
  Object.keys(scores).forEach((_name) => {
    if (_name === user?.username) {
      score = scores[_name];
    }
  });


  return (
    <div className={styles.pageContainer}>
      {finishGame || gameStatus.status === 'Finished' ? (
        <Podio scores={scores} />
      ) : (
        <>
          {message && <MessageBar message={message} />}
          <Dialog open={!!messageError} onClose={handleCloseDialog}>
            <DialogContent className={styles.dialogConfirmation}>
              {messageError}
            </DialogContent>
            <DialogActions className={styles.dialogConfirmation}>
              <Button onClick={handleCloseDialog}>Ok</Button>
            </DialogActions>
          </Dialog>
          <audio ref={audioRef} autoPlay loop>
            <source src="/assets/sound/batman.mp3" type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
          <div className={styles.tableContainer}>
            <div className={styles.playersContainer}>
              {Object.keys(gameStatus.players).map((playerName, _index) => (
                <Player
                  key={playerName}
                  playerName={playerName}
                  hand={gameStatus.players[playerName].cards.length}
                  wins={gameStatus.players[playerName].wins}
                  className={`${playerName === user?.username ? styles.currentUser : styles.player}`}
                  currentUser={user?.username || ''}
                  game={game}
                  currentPlayer={gameStatus.current_player === playerName ? true : false}
                />
              ))}
            </div>
            <UnoButton gameId={gameId} />
            <Table currentPlayer={isCurrentPlayer} gameId={gameId} topCard={topCard} className={styles.tableContainer} />
            <div className={styles.score}>
              <h4>Score: <span>{score}</span> </h4>
            </div>
          </div>
          <HandPlayer currentPlayer={isCurrentPlayer} gameId={gameId} cards={cards} playableCards={playableCards} className={styles.handContainer} />
          <SettingsToogle game={game} onVolumeChange={handleVolumeChange} />
        </>
      )}
    </div>
  );

};
export default GamePage;
