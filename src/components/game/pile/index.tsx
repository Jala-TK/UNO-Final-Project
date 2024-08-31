import type { NextPage } from 'next';
import styles from './Pile.module.css';
import { Card } from '@/types/types';

interface PileProps {
  topCard: Card | null;
  className: string;
}

const Pile: NextPage<PileProps> = ({ topCard, className }) => {
  const getWildCardImage = (color: string, isDrawFour: boolean) => {
    const basePath = isDrawFour ? '/assets/cardsColors/+4-' : '/assets/cardsColors/curinga-';
    switch (color) {
      case 'red':
        return `${basePath}vermelho.png`;
      case 'blue':
        return `${basePath}azul.png`;
      case 'green':
        return `${basePath}verde.png`;
      case 'yellow':
        return `${basePath}amarelo.png`;
      default:
        return '';
    }
  };

  const isWildCard = topCard?.value === 'wild';
  const isWildDrawFourCard = topCard?.value === 'wild_draw4';
  const wildCardImage = (isWildCard || isWildDrawFourCard)
    ? getWildCardImage(topCard?.color || '', isWildDrawFourCard)
    : topCard?.image;

  return (
    <div className={className}>
      {topCard && (
        <div key={topCard.id} className={styles.card}>
          <img
            className={styles.imageCard}
            alt={topCard.description}
            src={wildCardImage}
          />
        </div>
      )}
    </div>
  );
};

export default Pile;
