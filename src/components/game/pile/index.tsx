import type { NextPage } from 'next';
import styles from './Pile.module.css';
import { Card } from '@/types/types';
interface PileProps {
  topCard: Card | null;
  className: string;
}


const Pile: NextPage<PileProps> = ({ topCard, className }) => {
  return (
    <div className={className}>
      {(
        <div key={topCard?.id} className={styles.card}>
          <img className={styles.imageCard} alt={topCard?.description} src={topCard?.image} />
        </div>
      )}
    </div>
  );
};

export default Pile;
