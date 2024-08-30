'use client'
import React, { useEffect, useState } from "react";
import ProfilePanel from "@/components/panel/profilePanel";
import styles from './Profile.module.css';
import NavBar from "@/components/navbar/navbar";
import { getAPIClientNoCache } from "@/services/axios";
import { User } from "@/context/AuthContext";
const apiClient = getAPIClientNoCache()

interface ProfileProps {
  redirectRoute?: string;
}

async function getPerfil(): Promise<User | null> {
  const result = await apiClient.post(`/api/getPerfil`);
  if (result.status === 200) {
    return result.data;
  } else {
    return null;
  }
}

const Profile: React.FC = ({ redirectRoute }: ProfileProps) => {
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
      <NavBar />
      <ProfilePanel username={user?.username || ''} email={user?.email || ''} />
    </div>
  );
}

export default Profile;