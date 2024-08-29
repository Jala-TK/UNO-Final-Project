import { Server as SocketIOServer } from 'socket.io';

let io;

const initializeSocket = (server) => {
  io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('Cliente conectado via Socket.IO');

    socket.on('message', (message) => {
      io.emit('message', message);
      console.log('Mensagem recebida:', message);
    });

    socket.on('update', (update) => {
      io.emit('update', update);
      console.log('Atualização:', update);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io não está inicializado!');
  }
  return io;
};

export { initializeSocket, getIO };
