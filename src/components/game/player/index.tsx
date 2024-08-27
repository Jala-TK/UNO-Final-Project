import type { NextPage } from 'next';
import styles from './Player.module.css';

interface PlayerProps {
  playerName: string;
  hand: number;
  wins: number;
  className: string;
}

const Player: NextPage<PlayerProps> = ({ playerName, hand, wins, className }) => {
  return (
    <div className={`${styles.player} ${className}`}>
      <div className={styles.profile}>
        <img className={styles.backgroundIcon} alt="" src="/assets/player/BackGround.svg" />
        <div className={styles.challengeButtom}>
          <img className={styles.sirenIcon} alt="" src="/assets/player/siren.svg" />
        </div>
        <div className={styles.cards}>
          <img className={styles.cardGameIcon} alt="" src="/assets/player/card-game.svg" />
          <div className={styles.cardGame}>
            <img className={styles.vectorIcon} alt="" src="/assets/player/Vector.svg" />
            <img className={styles.cardGameChild} alt="" src="/assets/player/Rectangle 5.svg" />
            <b className={styles.cartas}>{hand}</b>
          </div>
        </div>
        <div className={styles.profileContainer}>
          <img className={styles.backgroundCircle} alt="Background Circle" src="/assets/player/Image.svg" />
          <img className={styles.profileIcon} alt="Profile Picture" src="/assets/player/kainan.jpg" />
        </div>

        <div className={styles.texts}>
          <div className={styles.scores}>
            <div className={styles.points}>{wins} wins</div>
          </div>
          <div className={styles.name}>
            <b className={styles.points}>{playerName}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
