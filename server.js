import { parse } from 'url';
import next from 'next';
import express, { json } from 'express';
import 'dotenv/config';
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
import sequelize from './backend-express/src/config/database.js';
import routes from './backend-express/src/routes/index.js';
import errorHandler from './backend-express/src/middleware/errorHandler.js';
import CacheMiddleware from './backend-express/src/middleware/cacheMiddleware.js';

nextApp.prepare().then(async () => {
  const PORTHTTP = process.env.PORTHTTP;
  const app = express();

  const cacheOptions = {
    max: 50,
    maxAge: 2000,
  };
  const cacheMiddleware = new CacheMiddleware(cacheOptions);
  app.use(cacheMiddleware.handleCache.bind(cacheMiddleware));

  app.use(json());
  app.use('/api', routes);
  app.use(errorHandler);

  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  try {
    await sequelize.authenticate();
    console.log('\x1b[32m%s\x1b[0m', 'Conectado ao banco com sucesso.');

    await sequelize.sync();
    console.log('\x1b[32m%s\x1b[0m', 'Database sincronizado');

    app.listen(PORTHTTP, (err) => {
      if (err) throw err;
      console.log(`Server rodando em http://localhost:${PORTHTTP}`);
    });
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Não é possível conectar ao banco dados:',
      error
    );
  }
});
