import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { sequelize, connectDB, Admin } from '../models/index.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await sequelize.sync();

  const username = process.env.ADMIN_SEED_USERNAME || 'admin';
  const password = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';

  const existing = await Admin.findOne({ where: { username } });
  if (existing) {
    console.log(`ℹ️  Admin "${username}" already exists. Skipping seed.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await Admin.create({
    username,
    password: hashedPassword,
    role: 'superadmin',
  });

  console.log(`✅ Seeded admin account -> username: "${username}", password: "${password}"`);
  console.log('⚠️  Change this password immediately after first login.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
