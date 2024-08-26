import React from 'react';
import styles from './profilePanel.module.css'

export default function ProfilePanel(props: { username: string, email: string }) {

  return (
    <div className={styles.containerPanel}>
      <div className={styles.containerTitle}>
        <h1>Profile</h1>
      </div>
      <div className={styles.containerInfos}>
        <div className={styles.itemBox}>
          <h1>Username: </h1><h1>{props.username}</h1>
        </div>
        <div className={styles.itemBox}>
          <h1>Email: </h1><h1>{props.email}</h1>
        </div>


      </div>
    </div>
  );
};