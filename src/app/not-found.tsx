import React from 'react';
import styles from '../styles/ErrorPage.module.css';

export default function ErrorPage() {
  return (
    <div className={styles.errorContainer}>
      <h1>
        Erro 404<br />
        Page Not Found
      </h1>
      <p>The link you tried to access is invalid or has already been used.
      </p>
      <img src="/assets/batman.gif" alt="" />
    </div>
  );
};

