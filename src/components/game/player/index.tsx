/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import styles from './Player.module.css';
import { challenge } from '@/services/gameService';
import { GameProps } from '@/types/types';
import { useMessage } from '@/context/MessageContext';
import { handleError } from '@/utils/handleError';
import { usePhoto } from '@/hooks/usePhoto';
import { useEffect, useState } from 'react';

interface PlayerProps {
  playerName: string;
  hand: number;
  wins: number;
  currentPlayer: boolean;
  game: GameProps
  currentUser: string;
  className: string;
}

const Player: NextPage<PlayerProps> = ({ playerName, hand, wins, currentPlayer, currentUser, game, className }) => {
  const { setMessage } = useMessage();
  const photoBlob = usePhoto(playerName);
  const [showWins, setShowWins] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress + 1) % 100);
    }, 500);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  const handleChallenge = async () => {
    try {
      const challenger = await challenge(game?.id, playerName);
    } catch (error) {
      setMessage(handleError(error))
    }
  }

  return (
    <div className={`${styles.player} ${className}`}>
      <div className={styles.profile}>
        <div
          className={styles.profileContainer}
          onMouseEnter={() => setShowWins(true)}
          onMouseLeave={() => setShowWins(false)}
        >
          {currentPlayer && (
            <svg className={styles.progressCircle} viewBox="0 0 100 100">
              <circle
                className={styles.progressCircleBackground}
                cx="50"
                cy="50"
                r="45"
                strokeWidth="10"
              />
              <circle
                className={styles.progressCircleForeground}
                cx="50"
                cy="50"
                r="45"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
              />
            </svg>
          )}
          <div className={styles.cards}>
            <div className={styles.cardGame}>
              <img className={styles.vectorIcon} alt="" src="/assets/player/Vector.svg" />
              <img className={styles.cardGameChild} alt="" src="/assets/player/Rectangle 5.svg" />
              <b className={styles.cartas}>{hand}</b>
            </div>
          </div>
          <img
            className={`${styles.profileIcon} ${showWins ? styles.profileIconHover : ''}`}
            alt="Profile Picture"
            src={photoBlob || "/assets/player/batman-perfil.jpg"}
          />
          {showWins && (
            <div className={styles.winsOverlay}>
              <div className={styles.winsText}>{wins} wins</div>
            </div>
          )}
          {(hand < 2 && (currentUser != playerName)) &&
            (
              <div className={styles.challengeButton} onClick={handleChallenge}>
                <img className={styles.sirenIcon} alt="" src="/assets/player/siren.svg" />
              </div>
            )}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>
            <b className={styles.points}>{playerName}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
