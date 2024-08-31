'use client'
import React, { } from "react";
import ProfilePanel from "@/components/panel/profilePanel";
import styles from './Profile.module.css';
import { useAuth } from "@/context/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className={styles.containerProfile}>
      <ProfilePanel username={user?.username || ''} email={user?.email || ''} />
    </div>
  );
}

export default Profile;