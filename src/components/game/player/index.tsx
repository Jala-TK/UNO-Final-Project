/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import styles from './Player.module.css';
import { challenge } from '@/services/gameService';
import { GameProps } from '@/types/types';
import { useMessage } from '@/context/MessageContext';
import { handleError } from '@/utils/handleError';
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
        <img className={styles.backgroundIcon} alt="" src="/assets/player/BackGround.svg" />
        {(hand < 2 && (currentUser != playerName)) &&
          (
            <div className={styles.challengeButtom} onClick={handleChallenge}>
              <img className={styles.sirenIcon} alt="" src="/assets/player/siren.svg" />
            </div>
          )}
        <div className={(!currentPlayer) ? styles.profileContainer : `${styles.profileContainer} ${styles.currentPlayer}`}>
          <img className={styles.profileIcon} alt="Profile Picture" src="/assets/player/kainan.jpg" />
        </div>
        <div className={styles.info}>
          <div className={styles.texts}>
            <div className={styles.name}>
              <b className={styles.points}>{playerName}</b>
            </div>
            <div className={styles.scores}>
              <div className={styles.points}>{wins} wins</div>
            </div>
          </div>
          <div className={styles.cards}>
            <img className={styles.cardGameIcon} alt="" src="/assets/player/card-game.svg" />
            <div className={styles.cardGame}>
              <img className={styles.vectorIcon} alt="" src="/assets/player/Vector.svg" />
              <img className={styles.cardGameChild} alt="" src="/assets/player/Rectangle 5.svg" />
              <b className={styles.cartas}>{hand}</b>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Player;
