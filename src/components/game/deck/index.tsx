import type { NextPage } from 'next';
import styles from './Deck.module.css';
import { getAPIClientNoCache } from '@/services/axios';


interface DeckProps {
  gameId: number;
  currentPlayer: boolean;
}


const Deck: NextPage<DeckProps> = ({ gameId, currentPlayer }) => {
  const apiClient = getAPIClientNoCache();

  const handleDoubleClick = async () => {
    if (!currentPlayer) {
      return;
    }
    await apiClient.post(`/api/cards/draw?timestamp=${new Date().getTime()}`, {
      game_id: gameId,
    });

  }


  return (
    <div className={styles.deckContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.deckCard} style={{ zIndex: index }}>
          <img alt={`Card ${index + 1}`}
            src={'/assets/rooms/card-monte.png'}
            onDoubleClick={() => handleDoubleClick()}
          />
        </div>
      ))}
    </div>
  );
};

export default Deck;
