/**
 * Global Error Handling Middleware
 * Returns structured JSON responses instead of raw stack traces.
 * Cleans up Mongoose validation and duplicate errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error encountered:', err.message || err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Mongoose Validation Error (Schema-level validation)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // Handle Mongo Duplicate Key Error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

module.exports = errorHandler;
