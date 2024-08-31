/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styles from './SettingsMenu.module.css';

interface SettingsMenuProps {
  onButtonClick: (type: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onButtonClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [infoDisplayed, setInfoDisplayed] = useState(false);

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
    if (infoDisplayed) {
      setInfoDisplayed(false);
    }
  };

  const handleInfoButtonClick = (type: string) => {
    onButtonClick(type);
    setInfoDisplayed(true);
  };

  return (
    <div className={styles.menuContainer}>
      <button className={styles.iconButton} onClick={handleMainButtonClick}>
        <img src="/assets/icons/Config Button.svg" alt="" />
      </button>
      {isExpanded && (
        <div className={styles.menuItems}>
          <button className={styles.iconButton} onClick={() => handleInfoButtonClick('info1')}>
            <img src="/assets/icons/Game Info.svg" alt="" />
          </button>
          <button className={styles.iconButton} onClick={() => handleInfoButtonClick('info2')}>
            <img src="/assets/icons/Sound Buttom.svg" alt="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
