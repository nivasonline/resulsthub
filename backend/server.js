import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB, sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json({
    route: '/',
    time: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResultHub API is running.',
    time: new Date().toISOString(),
  });
});

app.use(helmet());

app.use(compression());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://resulsthub-five.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log('Registering API routes...');

app.use('/api/admin', authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);

console.log('API routes registered.');

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  await sequelize.sync({
    alter: process.env.NODE_ENV === 'development',
  });

  app.listen(PORT, () => {
    console.log(`🚀 ResultHub API listening on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();

export default app;