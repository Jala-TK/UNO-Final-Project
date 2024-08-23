import type { NextPage } from 'next';
import styles from './Navbar.module.css';
import Router from "next/router";

function handleLink(link: string) {
  Router.push(link);
};

const NavBar: NextPage = () => {
  return (
    <div className={styles.navbar}>
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Room Buttom.svg" onClick={() => handleLink('/games')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Perfil Buttom.svg" onClick={() => handleLink('/profile')} />
      <img className={styles.buttomIcon} alt="" src="/assets/icons/Leave Game Buttom.svg" onClick={() => handleLink('/leave')} />
    </div>
  );
};

export default NavBar;
