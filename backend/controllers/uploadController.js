import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { importResultsFromExcel } from '../services/excelService.js';

// POST /api/admin/upload
export const uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded. Attach an Excel file under the "file" field.');
  }

  const summary = await importResultsFromExcel(req.file.path);

  res.status(200).json({
    success: true,
    message: 'Excel import completed.',
    data: summary,
  });
});
