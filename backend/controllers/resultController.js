import asyncHandler from '../utils/asyncHandler.js';
import { getResultByHallTicket, getResultByRegNumber } from '../services/resultService.js';

// GET /api/results/:hallTicket
export const getByHallTicket = asyncHandler(async (req, res) => {
  const data = await getResultByHallTicket(req.params.hallTicket.trim());
  res.status(200).json({ success: true, data });
});

// GET /api/results/reg/:registrationNumber
export const getByRegNumber = asyncHandler(async (req, res) => {
  const data = await getResultByRegNumber(req.params.registrationNumber.trim());
  res.status(200).json({ success: true, data });
});
