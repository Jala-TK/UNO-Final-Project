import type { NextPage } from 'next';
import styles from './Popup.module.css';

interface PopUpSettingsProps {
  title: string;
  waitingMessage?: string;
  playerCount?: string;
  buttonText: string;
  onClose: () => void;
  onConfirm: () => void;
}

const PopUpSettings: NextPage<PopUpSettingsProps> = ({
  title,
  waitingMessage,
  playerCount,
  buttonText,
  onClose,
  onConfirm,
}) => {
  return (
    <div className={styles.popup}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <div className={styles.titleGame}>{title}</div>
      {waitingMessage && <div className={styles.waitingForPlayers}>{waitingMessage}</div>}
      {playerCount && (
        <div className={styles.players}>
          <img className={styles.playersIcon} alt="Players" src="/assets/rooms/Players.svg" />
          <div className={styles.playerCount}>{playerCount}</div>
        </div>
      )}
      <button className={styles.confirmButton} onClick={onConfirm}>
        {buttonText}
      </button>
    </div>
  );
};

export default PopUpSettings;
