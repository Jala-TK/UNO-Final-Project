import type { NextPage } from 'next';
import styles from './Deck.module.css';
import { drawCard } from '@/services/cardService';


interface DeckProps {
  gameId: number;
  currentPlayer: boolean;
}


const Deck: NextPage<DeckProps> = ({ gameId, currentPlayer }) => {

  const handleDoubleClick = async () => {
    if (!currentPlayer) {
      return;
    }
    await drawCard(gameId);
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
