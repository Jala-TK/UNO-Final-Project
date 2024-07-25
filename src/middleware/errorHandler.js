const errorHandler = (err, req, res, next) => {
  const statusCode = err.code || 500;
  if (statusCode == 500) console.error(err.stack);
  const message = err.message || {
    message: "An error occurred:",
  };

  res.status(statusCode).json({
    error: message,
  });
};

export default errorHandler;
