import { Student, Subject } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import {
  calculateSGPA,
  calculatePercentage,
  getOverallResult,
} from '../utils/gradeCalculator.js';

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
  const student = await Student.findOne({
    where: { hallTicket, published: true },
    include: [{ model: Subject, as: 'subjects' }],
  });

  if (!student) {
    throw new ApiError(404, 'No published result found for this hall ticket number.');
  }

  return buildResultPayload(student);
}

export async function getResultByRegNumber(registrationNumber) {
  const student = await Student.findOne({
    where: { registrationNumber, published: true },
    include: [{ model: Subject, as: 'subjects' }],
  });

  if (!student) {
    throw new ApiError(404, 'No published result found for this registration number.');
  }

  return buildResultPayload(student);
}
