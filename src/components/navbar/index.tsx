"use client"
import styles from './Navbar.module.css';
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies } from 'nookies';


export default function NavBar() {
  const { 'nextauth.token.user': user } = parseCookies();
  const router = useRouter()

  function handleLeaveGame() {
    destroyCookie(null, "nextauth.token.uno");

    router.push("/login");
  }
  return (
    <div className={styles.navbar}>
      {user && <p>Hello, {user}!</p>}
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Room Buttom.svg" onClick={() => router.push('/games')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Perfil Buttom.svg" onClick={() => router.push('/profile')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Leave Game Buttom.svg" onClick={() => handleLeaveGame()} />
    </div>
  );
}