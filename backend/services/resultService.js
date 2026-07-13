import { Student, Subject } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import {
  calculateSGPA,
  calculatePercentage,
  getOverallResult,
} from '../utils/gradeCalculator.js';

const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCachedResult(key) {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.value;
}

function setCachedResult(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

async function buildResultPayload(student) {
  const subjects = student.subjects.map((s) => s.toJSON());

  return {
    student: {
      id: student.id,
      hallTicket: student.hallTicket,
      registrationNumber: student.registrationNumber,
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      department: student.department,
      semester: student.semester,
      section: student.section,
      photoUrl: student.photoUrl,
    },
    subjects,
    sgpa: calculateSGPA(subjects),
    cgpa: student.cgpa || calculateSGPA(subjects),
    percentage: calculatePercentage(subjects),
    overallResult: getOverallResult(subjects),
  };
}

export async function getResultByHallTicket(hallTicket) {
  const cachedResult = getCachedResult(hallTicket);

  if (cachedResult) {
    return cachedResult;
  }

  const student = await Student.findOne({
    where: {
      hallTicket,
      published: true,
    },
    attributes: [
      'id',
      'hallTicket',
      'registrationNumber',
      'name',
      'fatherName',
      'motherName',
      'department',
      'semester',
      'section',
      'photoUrl',
    ],
    include: [{
      model: Subject,
      as: 'subjects',
      attributes: [
        'subjectCode',
        'subjectName',
        'internalMarks',
        'externalMarks',
        'credits',
        'total',
        'grade',
        'gradePoint',
        'result',
      ],
    }],
  });

  if (!student) {
    throw new ApiError(404, 'No published result found for this hall ticket number.');
  }

  const result = await buildResultPayload(student);
  setCachedResult(hallTicket, result);

  return result;
}

export async function getResultByRegNumber(registrationNumber) {
  const cachedResult = getCachedResult(registrationNumber);

  if (cachedResult) {
    return cachedResult;
  }

  const student = await Student.findOne({
    where: {
      registrationNumber,
      published: true,
    },
    attributes: [
      'id',
      'hallTicket',
      'registrationNumber',
      'name',
      'fatherName',
      'motherName',
      'department',
      'semester',
      'section',
      'photoUrl',
    ],
    include: [{
      model: Subject,
      as: 'subjects',
      attributes: [
        'subjectCode',
        'subjectName',
        'internalMarks',
        'externalMarks',
        'credits',
        'total',
        'grade',
        'gradePoint',
        'result',
      ],
    }],
  });

  if (!student) {
    throw new ApiError(404, 'No published result found for this registration number.');
  }

  const result = await buildResultPayload(student);
  setCachedResult(registrationNumber, result);

  return result;
}
