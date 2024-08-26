import ProfilePanel from "@/components/panel/profilePanel";
import styles from './Profile.module.css';
import NavBar from "@/components/navbar/navbar";

interface ProfileProps {
  redirectRoute?: string;
}

export default function Profile({ redirectRoute }: ProfileProps) {
  return (
    <div className={styles.containerProfile}>
      <NavBar />
      <ProfilePanel username='Taua' email='tauasanto@gmail.com' />
    </div>
  );
}