"use client";
import React from 'react';
import styles from './profilePanel.module.css';
import { usePhoto } from '@/hooks/usePhoto';

export default function ProfilePanel(props: { username: string, email: string }) {
  const photoBlob = usePhoto(props.username);

  return (
    <div className={styles.containerPanel}>
      <div className={styles.containerTitle}>
        <h1>Profile</h1>
      </div>
      <div className={styles.photo}>
        <div className={styles.photoPlaceholder}>
          <img src={photoBlob || "/assets/player/batman-perfil.jpg"} alt="Default" className={styles.defaultPhoto} />
        </div>
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
