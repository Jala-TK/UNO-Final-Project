import express from 'express';
import http from 'http';
import 'dotenv/config';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import CacheMiddleware from './middleware/cacheMiddleware.js';
import trackingMiddleware from './middleware/trackingMiddleware.js';
import { initializeSocket } from './socket.js';

const startServer = async () => {
  const PORTHTTP = process.env.PORTHTTP || 3000;
  const app = express();
  const server = http.createServer(app);

  const cacheOptions = {
    max: 50,
    maxAge: 2000,
  };

  const cacheMiddleware = new CacheMiddleware(cacheOptions);

  app.use(express.json());
  app.use(cacheMiddleware.handleCache.bind(cacheMiddleware));
  app.use(trackingMiddleware);

  app.use('/api', routes);

  app.use(errorHandler);

  const io = initializeSocket(server);

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

startServer();
