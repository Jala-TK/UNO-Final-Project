import styles from './Navbar.module.css';
import Router from "next/router";
import { destroyCookie } from 'nookies';


export default function NavBar() {

  function handleLeaveGame() {
    destroyCookie(null, "nextauth.token.uno");

    Router.push("/login");
  }
  return (
    <div className={styles.navbar}>
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Room Buttom.svg" onClick={() => Router.push('/games')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Perfil Buttom.svg" onClick={() => Router.push('/profile')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Leave Game Buttom.svg" onClick={() => handleLeaveGame()} />
    </div>
  );
}