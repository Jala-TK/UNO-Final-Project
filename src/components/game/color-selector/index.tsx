import React from 'react';
import styles from './ColorSelector.module.css';

interface ColorSelectorProps {
  onSelectColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ onSelectColor }) => {
  return (
    <div className={styles.colorSelector}>
      <button
        className={`${styles.colorButton} ${styles.red}`}
        onClick={() => onSelectColor('red')}
        aria-label="Select Red"
      />
      <button
        className={`${styles.colorButton} ${styles.green}`}
        onClick={() => onSelectColor('green')}
        aria-label="Select Green"
      />
      <button
        className={`${styles.colorButton} ${styles.yellow}`}
        onClick={() => onSelectColor('yellow')}
        aria-label="Select Yellow"
      />
      <button
        className={`${styles.colorButton} ${styles.blue}`}
        onClick={() => onSelectColor('blue')}
        aria-label="Select Blue"
      />
    </div>
  );
};

export default ColorSelector;
