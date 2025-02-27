import type { NextPage } from 'next';
import styles from './Table.module.css';
import Pile from '../pile';
import React from 'react';
import Deck from '@/components/game/deck';
import { Card } from '@/types/types';

interface TableProps {
  topCard: Card | null;
  className: string
  currentPlayer: boolean;
  gameId: number;
}

const Table: NextPage<TableProps> = ({ gameId, currentPlayer, topCard, className }) => {
  return (
    <div className={className}>
      <div className={styles.tableContainer}>
        <div className={styles.table}>
          <div className={styles.cards}>
            <Pile topCard={topCard} className={styles.monte} />
            <Deck gameId={gameId} currentPlayer={currentPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
