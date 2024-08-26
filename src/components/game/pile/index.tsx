import type { NextPage } from 'next';
import styles from './Pile.module.css';
import Card from '@/components/game/Card';

interface PileProps {
  topCard: Card;
  className: string;
}

const Pile: NextPage<PileProps> = ({ topCard, className }) => {
  return (
    <div className={className}>
      {(
        <div key={topCard.id} className={styles.card}>
          <img className={styles.imageCard} alt={topCard.description} src={topCard.image} />
        </div>
      )}
    </div>
  );
};

export default Pile;
