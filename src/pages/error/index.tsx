import React from 'react';
import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  return (
    <div className={styles.errorContainer}>
      <h1>Erro 404 - Página Não Encontrada</h1>
      <p>O link que você tentou acessar é inválido ou já foi utilizado.</p>

    </div>
  );
};

