import React, { useState } from 'react';
import styles from './SettingsMenu.module.css';
import { GameProps } from '@/types/types';
import { exitGame } from '@/services/gameService';
import { handleError } from '@/utils/handleError';
import { useRouter } from 'next/navigation';
import SliderComponent from '../slider';

interface SettingsMenuProps {
  game: GameProps;
  onVolumeChange: (volume: number) => void;
}

interface InfoProps {
  title: string;
  content: GameProps | string;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ game, onVolumeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [infoDisplayed, setInfoDisplayed] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const router = useRouter();

  const leaveGame = async () => {
    try {
      await exitGame(game.id);
      localStorage.removeItem('game');
    } catch (error) {
      console.log(handleError(error));
    }
  };

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
    if (infoDisplayed) {
      setInfoDisplayed(false);
    }
  };

  const handleInfoButtonClick = (type: string) => {
    setType(type);
    if (type === 'info') {
      setTitle('Info Game');
    } else if (type === 'sound') {
      setTitle('Volume');
    } else if (type === 'leave') {
      setTitle('Leave Game?');
    }
    setInfoDisplayed(true);
  };

  const handleCloseInfo = () => {
    setInfoDisplayed(false);
  };

  const handleLeaveGame = () => {
    console.log('Leaving game...');
    setInfoDisplayed(false);
    leaveGame().then(() => {
      router.push('/games');
    });
  };

  return (
    <div>
      <div className={styles.menuContainer}>
        <button className={styles.iconButton} onClick={handleMainButtonClick}>
          <img src="/assets/icons/Config Button.svg" alt="" />
        </button>
        {isExpanded && (
          <div className={styles.menuItems}>
            <button className={styles.iconButton} onClick={infoDisplayed ? handleCloseInfo : () => handleInfoButtonClick('info')}>
              <img src="/assets/icons/Game Info.svg" alt="" />
            </button>
            <button className={styles.iconButton} onClick={infoDisplayed ? handleCloseInfo : () => handleInfoButtonClick('sound')}>
              <img src="/assets/icons/Sound Buttom.svg" alt="" />
            </button>
            <button className={styles.iconButton} onClick={infoDisplayed ? handleCloseInfo : () => handleInfoButtonClick('leave')}>
              <img src="/assets/icons/Leave Game Buttom.svg" alt="" />
            </button>
          </div>
        )}
      </div>
      {infoDisplayed && (
        <div className={styles.infoCard}>
          <button className={styles.closeButton} onClick={handleCloseInfo}>
            X
          </button>
          <div className={styles.cardContent}>
            <h2>{title}</h2>
            <div className={styles[`${type}`]}>
              {type === 'info' && (
                <>
                  <p>Title: {game.title}</p>
                  <p>Code: {game.id}</p>
                  <p>Max Players: {game.maxPlayers}</p>
                  <p>Creator: {game.creator}</p>
                </>
              )}
              {type === 'sound' && (
                <>
                  <div className={styles.volume}>
                    <SliderComponent onVolumeChange={onVolumeChange} />
                  </div>
                </>
              )}
              {type === 'leave' && (
                <>
                  <div className={styles.buttons}>
                    <button className={styles.buttonYes} onClick={handleLeaveGame}>
                      Yes
                    </button>
                    <button className={styles.buttonNo} onClick={handleCloseInfo}>
                      No
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
