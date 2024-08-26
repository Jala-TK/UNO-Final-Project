import type { NextPage } from 'next';
import styles from './Player.module.css';

interface PlayerProps {
  playerId: number; // TODO: Add interface to player response
  className: string
}

const Player: NextPage<PlayerProps> = ({ playerId, className }) => {
  return (
    <div className={className}>
      <div className={styles.player}>
        <div className={styles.profile}>
          <img className={styles.backgroundIcon} alt="" src="/assets/player/BackGround.svg" />
          <div className={styles.challengeButtom}>
            <div className={styles.challengeButtomChild} />
            <div className={styles.textParent}>
              <b className={styles.text}>Challenge</b>
              <img className={styles.sirenIcon} alt="" src="/assets/player/siren.svg" />
            </div>
          </div>
          <div className={styles.cards}>
            <img className={styles.cardGameIcon} alt="" src="/assets/player/card-game.svg" />
            <div className={styles.cardGame}>
              <img className={styles.vectorIcon} alt="" src="/assets/player/Vector.svg" />
              <img className={styles.cardGameChild} alt="" src="/assets/player/Rectangle 5.svg" />
              <b className={styles.cartas}>17</b>
            </div>
          </div>
          <div className={styles.profileContainer}>
            <img className={styles.backgroundCircle} alt="Background Circle" src="/assets/player/Image.svg" />
            <img className={styles.profileIcon} alt="Profile Picture" src="/assets/player/kainan.jpg" />
          </div>


          <div className={styles.texts}>
            <div className={styles.scores}>
              <div className={styles.points}>10 wins</div>
            </div>
            <div className={styles.name}>
              <b className={styles.points}>knX</b>
            </div>
          </div>
        </div>
      </div>
    </div>);
};

export default Player;
