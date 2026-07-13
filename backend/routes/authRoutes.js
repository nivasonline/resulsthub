import { Router } from 'express';
import { body } from 'express-validator';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

export default router;
