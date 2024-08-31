/* eslint-disable @next/next/no-img-element */
"use client"
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';
import { useRouter } from "next/navigation";
import { destroyCookie } from 'nookies';


export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter()

  function handleLeaveGame() {
    destroyCookie(null, "nextauth.token.uno");
    router.push("/login");
  }
  return (
    <div className={styles.navbar}>
      <p>{user ? `Hello, ${user.username}!` : 'UNO Batman'}</p>
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Room Buttom.svg" onClick={() => router.push('/games')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Perfil Buttom.svg" onClick={() => router.push('/profile')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Leave Game Buttom.svg" onClick={() => handleLeaveGame()} />
    </div>
  );
}