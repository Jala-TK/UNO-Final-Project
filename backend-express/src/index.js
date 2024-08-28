import express from 'express';
import http from 'http';
import 'dotenv/config';
import { Server as SocketIOServer } from 'socket.io';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import CacheMiddleware from './middleware/cacheMiddleware.js';
import trackingMiddleware from './middleware/trackingMiddleware.js';

const startServer = async () => {
  const PORTHTTP = process.env.PORT || 3000;
  const app = express();
  const server = http.createServer(app);

  const io = new SocketIOServer(server);

  const cacheOptions = {
    max: 50,
    maxAge: 2000,
  };
  const cacheMiddleware = new CacheMiddleware(cacheOptions);

  app.use(trackingMiddleware);
  app.use(cacheMiddleware.handleCache.bind(cacheMiddleware));
  app.use(express.json());
  app.use(errorHandler);
  app.use('/api', routes);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  try {
    await sequelize.authenticate();
    console.log('\x1b[32m%s\x1b[0m', 'Conectado ao banco com sucesso.');

    await sequelize.sync();
    console.log('\x1b[32m%s\x1b[0m', 'Database sincronizado');

    server.listen(PORTHTTP, (err) => {
      if (err) throw err;
      console.log(`Server rodando em http://localhost:${PORTHTTP}`);
    });
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Não é possível conectar ao banco de dados:',
      error,
    );
  }

  return io;
};

const io = startServer();

export { io };
