export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || [],
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this data already exists',
      field: err.meta?.target?.[0] || 'unknown',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested record was not found',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: statusCode === 500 ? 'Something went wrong' : message,
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
};
