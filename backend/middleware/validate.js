import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Runs after express-validator check() chains on a route.
 * Collects any validation failures into a single ApiError.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`);
    return next(new ApiError(400, 'Validation failed', messages));
  }
  next();
};

export default validate;
