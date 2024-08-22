import type { NextPage } from 'next';
import styles from './Rooms.module.css';


const RoomsDisponiveis: NextPage = () => {
  return (
    <div className={styles.roomsDisponiveis}>
      <div className={styles.game}>
        <img className={styles.backgroundIcon} alt="" src="/assets/rooms/BackGround.svg" />
        <div className={styles.challengeButtom}>
          <div className={styles.challengeButtomChild} />
          <b className={styles.enter}>Enter</b>
        </div>
        <img className={styles.playersIcon} alt="" src="/assets/rooms/Players.svg" />
        <img className={styles.profileIcon} alt="" src="/assets/rooms/Profile.png" />
        <div className={styles.texts}>
          <div className={styles.players}>
            <div className={styles.nansGame}>3/5</div>
          </div>
          <div className={styles.title}>
            <b className={styles.nansGame}>Nan's Game</b>
          </div>
        </div>
        <div className={styles.id}>
          <div className={styles.div}>#424</div>
        </div>
      </div>
    </div>);
};

export default RoomsDisponiveis;
