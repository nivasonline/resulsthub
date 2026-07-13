import { verifyToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Admin } from '../models/index.js';

/**
 * Protects routes by requiring a valid Bearer JWT.
 * Attaches the authenticated admin (minus password) to req.admin.
 */
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, 'Not authorized. Token invalid or expired.');
  }

  const admin = await Admin.findByPk(decoded.id, {
    attributes: { exclude: ['password'] },
  });

  if (!admin) {
    throw new ApiError(401, 'Not authorized. Admin no longer exists.');
  }

  req.admin = admin;
  next();
});

/**
 * Restricts access to specific admin roles. Use after `protect`.
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};
