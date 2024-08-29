import type { NextPage } from 'next';
import styles from './Table.module.css';
import Pile from '../pile';
import React, { useState } from 'react';
import Card from '@/components/game/Card';
import Deck from '@/components/game/deck';
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
