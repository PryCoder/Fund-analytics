const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ 
      error: 'Duplicate entry - scheme already in watchlist' 
    });
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }
  
  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'Invalid data format' 
    });
  }
  
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;