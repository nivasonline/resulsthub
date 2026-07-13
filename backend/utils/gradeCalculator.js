/**
 * Grade calculation utilities.
 * Centralized here so grading logic is consistent whether marks come from
 * manual entry or Excel import.
 */

// Standard 10-point grading scale. Adjust thresholds to match your university.
const GRADE_SCALE = [
  { min: 90, grade: 'O', point: 10 },
  { min: 80, grade: 'A+', point: 9 },
  { min: 70, grade: 'A', point: 8 },
  { min: 60, grade: 'B+', point: 7 },
  { min: 50, grade: 'B', point: 6 },
  { min: 40, grade: 'C', point: 5 },
  { min: 0, grade: 'F', point: 0 },
];

const PASS_THRESHOLD = 40; // out of 100 total

export function calculateSubjectResult({ internalMarks, externalMarks, credits }) {
  const total = Number(internalMarks) + Number(externalMarks);
  const scale = GRADE_SCALE.find((s) => total >= s.min);
  const grade = scale.grade;
  const gradePoint = scale.point;
  const result = total >= PASS_THRESHOLD ? 'PASS' : 'FAIL';

  return { total, grade, gradePoint, result };
}

/**
 * SGPA = sum(credits * gradePoint) / sum(credits) for a single semester
 */
export function calculateSGPA(subjects) {
  const totalCredits = subjects.reduce((sum, s) => sum + Number(s.credits), 0);
  if (totalCredits === 0) return 0;

  const weightedSum = subjects.reduce(
    (sum, s) => sum + Number(s.credits) * Number(s.gradePoint || 0),
    0
  );

  return Number((weightedSum / totalCredits).toFixed(2));
}

/**
 * CGPA - average of SGPA across all semesters for a student.
 * Accepts an array of { semester, subjects } groups.
 */
export function calculateCGPA(semesterGroups) {
  if (semesterGroups.length === 0) return 0;

  const sgpas = semesterGroups.map((g) => calculateSGPA(g.subjects));
  const avg = sgpas.reduce((sum, val) => sum + val, 0) / sgpas.length;

  return Number(avg.toFixed(2));
}

export function calculatePercentage(subjects) {
  const totalMarks = subjects.reduce((sum, s) => sum + Number(s.total), 0);
  const maxMarks = subjects.length * 100;
  if (maxMarks === 0) return 0;
  return Number(((totalMarks / maxMarks) * 100).toFixed(2));
}

export function getOverallResult(subjects) {
  return subjects.every((s) => s.result === 'PASS') ? 'PASS' : 'FAIL';
}

export { GRADE_SCALE, PASS_THRESHOLD };
