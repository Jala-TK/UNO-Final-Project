// components/InfoDisplay.tsx
import React from 'react';
import styles from './InfoDisplay.module.css';

interface InfoDisplayProps {
  title: string;
  content: string;
  onClose: () => void;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({ title, content, onClose }) => {
  return (
    <div className={styles.infoCard}>
      <button className={styles.closeButton} onClick={onClose}>
        X
      </button>
      <div className={styles.cardContent}>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default InfoDisplay;
