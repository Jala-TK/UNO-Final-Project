import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  const statusCode = err.code || 500;
  if (statusCode == 500) console.error(err.stack);
  const message = err.message || {
    message: 'An error occurred:',
  };

  res.status(statusCode).json({
    error: message,
  });
};

export default errorHandler;
