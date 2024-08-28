'use client'
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Assumindo que o servidor está no mesmo domínio

const MyComponent = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });

    socket.on('message', (message) => {
      console.log('Mensagem recebida do servidor:', message);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.send('Olá do cliente!');
  };

  return (
    <div>
      <button onClick={sendMessage}>Enviar Mensagem</button>
    </div>
  );
};

export default MyComponent;
