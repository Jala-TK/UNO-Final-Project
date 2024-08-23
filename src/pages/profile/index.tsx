import ProfilePanel from "@/components/panel/profilePanel";
import styles from './Profile.module.css'
export default function Profile({ redirectRoute }: any) {

  return (
    <div className={styles.containerProfile}>
      <ProfilePanel username='Taua' email='tauasanto@gmail.com' />
    </div>
  );
}