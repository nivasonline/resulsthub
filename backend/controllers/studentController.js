import { Op } from 'sequelize';
import { Student, Subject } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { calculateSubjectResult, calculateSGPA } from '../utils/gradeCalculator.js';

// GET /api/admin/students?page=1&limit=20&search=&department=&semester=&published=
export const getStudents = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const where = {};

  if (req.query.search) {
    const search = req.query.search.trim();
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { hallTicket: { [Op.like]: `%${search}%` } },
      { registrationNumber: { [Op.like]: `%${search}%` } },
    ];
  }

  if (req.query.department) where.department = req.query.department;
  if (req.query.semester) where.semester = req.query.semester;

  if (req.query.published !== undefined && req.query.published !== '') {
    where.published = req.query.published === 'true';
  }

  const { rows, count } = await Student.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: Subject, as: 'subjects' }],
  });

  res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  });
});

// GET /api/admin/students/:id
export const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id, {
    include: [{ model: Subject, as: 'subjects' }],
  });

  if (!student) throw new ApiError(404, 'Student not found.');

  res.status(200).json({
    success: true,
    data: student,
  });
});

// POST /api/admin/student
export const createStudent = asyncHandler(async (req, res) => {
  const { subjects = [], ...studentData } = req.body;

  // Automatically publish every uploaded student
  studentData.published = true;

  const student = await Student.create(studentData);

  if (subjects.length > 0) {
    const preparedSubjects = subjects.map((s) => {
      const { total, grade, gradePoint, result } = calculateSubjectResult(s);

      return {
        ...s,
        studentId: student.id,
        total,
        grade,
        gradePoint,
        result,
      };
    });

    await Subject.bulkCreate(preparedSubjects);

    student.sgpa = calculateSGPA(preparedSubjects);
    await student.save();
  }

  const fullStudent = await Student.findByPk(student.id, {
    include: [{ model: Subject, as: 'subjects' }],
  });

  res.status(201).json({
    success: true,
    message: 'Student created and published successfully.',
    data: fullStudent,
  });
});

// PUT /api/admin/student/:id
export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);

  if (!student) throw new ApiError(404, 'Student not found.');

  const { subjects, ...studentData } = req.body;

  await student.update(studentData);

  if (Array.isArray(subjects)) {
    await Subject.destroy({
      where: {
        studentId: student.id,
      },
    });

    const preparedSubjects = subjects.map((s) => {
      const { total, grade, gradePoint, result } = calculateSubjectResult(s);

      return {
        ...s,
        studentId: student.id,
        total,
        grade,
        gradePoint,
        result,
      };
    });

    if (preparedSubjects.length > 0) {
      await Subject.bulkCreate(preparedSubjects);

      student.sgpa = calculateSGPA(preparedSubjects);
      await student.save();
    }
  }

  const updated = await Student.findByPk(student.id, {
    include: [{ model: Subject, as: 'subjects' }],
  });

  res.status(200).json({
    success: true,
    message: 'Student updated successfully.',
    data: updated,
  });
});

// DELETE /api/admin/student/:id
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);

  if (!student) throw new ApiError(404, 'Student not found.');

  await student.destroy();

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully.',
  });
});

// PATCH /api/admin/student/:id/publish
export const togglePublish = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);

  if (!student) throw new ApiError(404, 'Student not found.');

  student.published = req.body.published ?? !student.published;

  await student.save();

  res.status(200).json({
    success: true,
    message: student.published
      ? 'Result published.'
      : 'Result hidden.',
    data: student,
  });
});

// PATCH /api/admin/students/publish-bulk
export const bulkPublish = asyncHandler(async (req, res) => {
  const { ids = [], published = true } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'Provide an array of student ids.');
  }

  await Student.update(
    { published },
    {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
  );

  res.status(200).json({
    success: true,
    message: `${ids.length} result(s) ${
      published ? 'published' : 'hidden'
    }.`,
  });
});