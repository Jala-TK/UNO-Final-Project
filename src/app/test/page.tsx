'use client'

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(); // Assumindo que o servidor está no mesmo domínio

const MyComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log('Mensagem recebida do servidor:', message);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', 'Olá do cliente!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Socket.IO</h1>
      <div>
        {messages.map((message, index) => (

          <div key={index}>
            <b style={{ color: 'white', alignContent: 'center' }}>{message}</b>
            <br />
          </div>
        ))}
      </div>
      <br></br>
      <button onClick={sendMessage}>Enviar Mensagem</button>
    </div>
  );
};

export default MyComponent;
