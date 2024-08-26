"use client"
import React from 'react';
import styles from './profilePanel.module.css'

export default function ProfilePanel(props: { username: string, email: string }) {

  return (
    <div className={styles.containerPanel}>

      <div className={styles.containerTitle}>
        <h1>Profile</h1>
      </div>
      <div className={styles.containerInfos}>
        <div className={styles.itemBoxQ}>
          <h1 className={styles.textFieldSeparator}>Username: </h1>
          <h1 className={styles.textFieldSeparator}>Email: </h1>
        </div>
        <div className={styles.itemBoxR}>
          <h1 className={styles.textFieldSeparator}>{props.username}</h1>
          <h1 className={styles.textFieldSeparator}>{props.email}</h1>
        </div>
      </div>
    </div>
  );
};