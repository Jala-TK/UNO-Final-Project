import type { NextPage } from 'next';
import styles from './UnoButtom.module.css';
import { useMessage } from '@/context/MessageContext';
import { sayUno } from '@/services/gameService';
import { handleError } from '@/utils/handleError';

interface UnoProps {
  gameId: number
}

const UnoButton: NextPage<UnoProps> = ({ gameId }) => {
  const { setMessage } = useMessage();

  const handleUno = async () => {
    try {
      const unoResponse = await sayUno(gameId);
      setMessage(unoResponse.message)
    } catch (error) {
      setMessage(handleError(error))
    }
  }

  return (
    <div className={styles.buttonUno} onClick={handleUno}>
      <img src="/assets/morcego.svg" alt="" />
    </div>
  );
};

export default UnoButton;
