import React, { useEffect } from 'react';
import styles from './MessageBar.module.css';
import { useMessage } from '@/context/MessageContext';

interface MessageBarProps {
  message: string;
}

const MessageBar: React.FC<MessageBarProps> = ({ message }) => {
  const { setMessage } = useMessage();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 20000); // 20 segundos

      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) {
    return null;
  }

  return (
    <div className={styles.messageBar}>
      <p>{message}</p>
    </div>
  );
};

export default MessageBar;
