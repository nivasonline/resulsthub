import { Op, fn, col } from 'sequelize';
import { Student, Subject, sequelize } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/admin/analytics/overview
export const getOverview = asyncHandler(async (req, res) => {
  const totalStudents = await Student.count();
  const publishedResults = await Student.count({ where: { published: true } });
  const pendingResults = totalStudents - publishedResults;

  const totalSubjects = await Subject.count();
  const failedSubjects = await Subject.count({ where: { result: 'FAIL' } });

  const passPercentage =
    totalSubjects === 0 ? 0 : Number((((totalSubjects - failedSubjects) / totalSubjects) * 100).toFixed(2));

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      publishedResults,
      pendingResults,
      passPercentage,
      totalSubjects,
    },
  });
});

// GET /api/admin/analytics/department-stats
export const getDepartmentStats = asyncHandler(async (req, res) => {
  const stats = await Student.findAll({
    attributes: ['department', [fn('COUNT', col('Student.id')), 'studentCount']],
    group: ['department'],
    raw: true,
  });

  res.status(200).json({ success: true, data: stats });
});

// GET /api/admin/analytics/semester-stats
export const getSemesterStats = asyncHandler(async (req, res) => {
  const stats = await Student.findAll({
    attributes: ['semester', [fn('COUNT', col('Student.id')), 'studentCount']],
    group: ['semester'],
    order: [['semester', 'ASC']],
    raw: true,
  });

  res.status(200).json({ success: true, data: stats });
});

// GET /api/admin/analytics/toppers?department=&semester=&limit=10
export const getToppers = asyncHandler(async (req, res) => {
  const where = { published: true };
  if (req.query.department) where.department = req.query.department;
  if (req.query.semester) where.semester = req.query.semester;

  const toppers = await Student.findAll({
    where,
    order: [['sgpa', 'DESC']],
    limit: Number(req.query.limit) || 10,
    attributes: ['id', 'name', 'hallTicket', 'department', 'semester', 'sgpa', 'cgpa'],
  });

  res.status(200).json({ success: true, data: toppers });
});
