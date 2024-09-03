import type { NextPage } from 'next';
import styles from './Deck.module.css';
import { drawCard } from '@/services/cardService';
import { useMessage } from '@/context/MessageContext';


interface DeckProps {
  gameId: number;
  currentPlayer: boolean;
}


const Deck: NextPage<DeckProps> = ({ gameId, currentPlayer }) => {
  const { message, setMessage } = useMessage();

  const handleDoubleClick = async () => {
    if (!currentPlayer) {
      return;
    }
    const draw = await drawCard(gameId);
    if (draw.data.nextPlayer) setMessage(draw.data.message);
  }


  return (
    <div className={styles.deckContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.deckCard} style={{ zIndex: index }}>
          <img alt={`Card ${index + 1}`}
            src={'/assets/rooms/card-monte.png'}
            onClick={() => handleDoubleClick()}
          />
        </div>
      ))}
    </div>
  );
};

export default Deck;
