import ProfilePanel from "@/components/panel/profilePanel";
import styles from './Profile.module.css';

interface ProfileProps {
  redirectRoute?: string;
}

export default function Profile({ redirectRoute }: ProfileProps) {
  return (
    <div className={styles.containerProfile}>
      <ProfilePanel username='Taua' email='tauasanto@gmail.com' />
    </div>
  );
}