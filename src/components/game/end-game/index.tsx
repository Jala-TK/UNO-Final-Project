/* eslint-disable @next/next/no-img-element */
import React, { } from 'react';
import styles from './EndGame.module.css';
import { Scores } from '@/types/types';
import router from 'next/router';

interface PodioProps {
  scores: Scores[];
}


const Podio: React.FC<PodioProps> = ({ scores }) => {
  const sortedPlayers = Object.keys(scores).map(name => ({
    name,
    points: scores[name]
  })).sort((a, b) => a.points - b.points);

  function handleCreateGame() {
    router.push('/create-game');
  };

  function handleBack() {
    router.push('/games');
  };


  return (
    <div className={styles.podioContainer}>
      <div className={styles.podio}>
        {sortedPlayers.slice(0, 3).map((player, index) => (
          <div key={index} className={`${styles.podioPosition} ${styles[`podioPosition${index + 1}`]}`}>
            <img src={`/assets/winner/podio-${index + 1}.webp`} alt={`Podio ${index + 1}`} className={styles.podioGif} />
            {index == 0 && <img src="/assets/coroa.png" alt="Coroa" className={styles.crown} />}
            <h2>{player.name}</h2>
            <p>{player.points} pontos</p>
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <button className={styles.backButton} onClick={handleBack}>Games</button>
        <button className={styles.createButton} onClick={handleCreateGame} >Create New Game</button>
      </div>

    </div>
  );
};

export default Podio;
