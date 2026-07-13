import ApiError from '../utils/ApiError.js';

/**
 * Converts thrown errors (Sequelize, JWT, ApiError, or unknown) into a
 * consistent JSON error shape, and logs unexpected ones server-side.
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;

    // Sequelize validation / unique constraint errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors?.map((e) => e.message) || [error.message];
      error = new ApiError(400, messages.join(', '));
    } else {
      error = new ApiError(statusCode, error.message || 'Internal Server Error');
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};
