import bcrypt from 'bcrypt';
import { Admin } from '../models/index.js';
import { signToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export async function loginAdmin(username, password) {
  const admin = await Admin.findOne({ where: { username } });

  if (!admin) {
    throw new ApiError(401, 'Invalid username or password.');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid username or password.');
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = signToken({ id: admin.id, username: admin.username, role: admin.role });

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      lastLogin: admin.lastLogin,
    },
  };
}
