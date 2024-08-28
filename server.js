import express from 'express';
import http from 'http';
import { parse } from 'url';
import next from 'next';
import 'dotenv/config';
import { Server as SocketIOServer } from 'socket.io';
import sequelize from './backend-express/src/config/database.js';
import routes from './backend-express/src/routes/index.js';
import errorHandler from './backend-express/src/middleware/errorHandler.js';
import CacheMiddleware from './backend-express/src/middleware/cacheMiddleware.js';
import trackingMiddleware from './backend-express/src/middleware/trackingMiddleware.js';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const startServer = async () => {
  await nextApp.prepare();

  const PORTHTTP = process.env.PORTHTTP || 3000;
  const app = express();
  const server = http.createServer(app);

  // Socket.IO Server
  const io = new SocketIOServer(server);

  const cacheOptions = {
    max: 50,
    maxAge: 2000,
  };

  const cacheMiddleware = new CacheMiddleware(cacheOptions);

  app.use(cacheMiddleware.handleCache.bind(cacheMiddleware));
  app.use(trackingMiddleware);
  app.use(errorHandler);
  app.use(express.json());
  app.use('/api', routes);

  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Cliente conectado via Socket.IO');

    socket.on('message', (message) => {
      io.emit('message', message);

      console.log('Mensagem recebida:', message);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
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
      error
    );
  }

  return io;
};

// Start the server and export Socket.IO server
const io = await startServer();

export { io };
