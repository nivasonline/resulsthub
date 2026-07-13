import asyncHandler from '../utils/asyncHandler.js';
import { loginAdmin } from '../services/authService.js';

// POST /api/admin/login
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await loginAdmin(username, password);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

// GET /api/admin/me
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
});
