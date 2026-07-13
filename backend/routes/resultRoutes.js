import { Router } from 'express';
import { param } from 'express-validator';
import { getByHallTicket, getByRegNumber } from '../controllers/resultController.js';
import validate from '../middleware/validate.js';

const router = Router();

router.get(
  '/reg/:registrationNumber',
  [param('registrationNumber').trim().notEmpty()],
  validate,
  getByRegNumber
);

router.get(
  '/:hallTicket',
  [param('hallTicket').trim().notEmpty()],
  validate,
  getByHallTicket
);

export default router;
