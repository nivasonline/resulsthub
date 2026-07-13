import { Router } from 'express';
import { body } from 'express-validator';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  togglePublish,
  bulkPublish,
} from '../controllers/studentController.js';
import { uploadExcel } from '../controllers/uploadController.js';
import {
  getOverview,
  getDepartmentStats,
  getSemesterStats,
  getToppers,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js';

const router = Router();

// All routes below require a valid admin JWT
router.use(protect);

// Students CRUD
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);

router.post(
  '/student',
  [
    body('hallTicket').trim().notEmpty().withMessage('Hall ticket is required.'),
    body('registrationNumber').trim().notEmpty().withMessage('Registration number is required.'),
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('department').trim().notEmpty().withMessage('Department is required.'),
    body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8.'),
  ],
  validate,
  createStudent
);

router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.patch('/student/:id/publish', togglePublish);
router.patch('/students/publish-bulk', bulkPublish);

// Excel upload
router.post('/upload', upload.single('file'), uploadExcel);

// Analytics
router.get('/analytics/overview', getOverview);
router.get('/analytics/department-stats', getDepartmentStats);
router.get('/analytics/semester-stats', getSemesterStats);
router.get('/analytics/toppers', getToppers);

export default router;
