'use client'
import React, { useEffect, useState } from "react";
import ProfilePanel from "@/components/panel/profilePanel";
import styles from './Profile.module.css';
import { User } from "@/context/AuthContext";
import { getPerfil } from "@/services/authService";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const user = await getPerfil();
      setUser(user)
      console.log(user)
    }

    fetchPerfil();
  }, [!user]);
  return (
    <div className={styles.containerProfile}>
      <ProfilePanel username={user?.username || ''} email={user?.email || ''} />
    </div>
  );
}

export default Profile;