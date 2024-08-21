import express from 'express';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import CacheMiddleware from './middleware/cacheMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

const cacheOptions = {
  max: 50,
  maxAge: 2000,
};
const cacheMiddleware = new CacheMiddleware(cacheOptions);
app.use(cacheMiddleware.handleCache.bind(cacheMiddleware));

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('\x1b[32m%s\x1b[0m', 'Conectado ao banco com sucesso.');

    await sequelize.sync();
    console.log('\x1b[32m%s\x1b[0m', 'Database sincronizado');

    app.listen(PORT, () => {
      console.log('\x1b[32m%s\x1b[0m', `Server rodando em localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Não é possível conectar ao banco dados:',
      error,
    );
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
