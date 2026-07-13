import xlsx from 'xlsx';
import fs from 'fs';
import { Student, Subject, sequelize } from '../models/index.js';
import { calculateSubjectResult } from '../utils/gradeCalculator.js';
import ApiError from '../utils/ApiError.js';

/**
 * Expected Excel columns (case-insensitive, header row required):
 * hallTicket | registrationNumber | name | fatherName | motherName |
 * department | semester | section | email | phone |
 * subjectName | internalMarks | externalMarks | credits
 *
 * One row per subject. Multiple rows can share the same hallTicket to
 * represent multiple subjects for the same student.
 */

function normalizeRow(row) {
  const normalized = {};
  for (const key of Object.keys(row)) {
    normalized[key.trim().toLowerCase()] = row[key];
  }
  return normalized;
}

export async function importResultsFromExcel(filePath) {
  let workbook;
  try {
    workbook = xlsx.readFile(filePath);
  } catch (err) {
    throw new ApiError(400, 'Could not read the uploaded Excel file. Is it corrupted?');
  } finally {
    // Clean up the uploaded file regardless of success/failure downstream
    fs.unlink(filePath, () => {});
  }

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  if (rows.length === 0) {
    throw new ApiError(400, 'The Excel file is empty.');
  }

  const summary = {
    totalRows: rows.length,
    studentsCreated: 0,
    studentsUpdated: 0,
    subjectsInserted: 0,
    duplicatesSkipped: 0,
    errors: [],
  };

  // Group rows by hallTicket so each student is processed once with all their subjects
  const grouped = new Map();
  rows.forEach((raw, index) => {
    const row = normalizeRow(raw);
    const hallTicket = String(row.hallticket || '').trim();
    if (!hallTicket) {
      summary.errors.push(`Row ${index + 2}: missing hallTicket, skipped.`);
      return;
    }
    if (!grouped.has(hallTicket)) grouped.set(hallTicket, []);
    grouped.get(hallTicket).push({ row, index });
  });

  const transaction = await sequelize.transaction();

  try {
    for (const [hallTicket, entries] of grouped.entries()) {
      const first = entries[0].row;

      const [student, created] = await Student.findOrCreate({
        where: { hallTicket },
        defaults: {
          hallTicket,
          registrationNumber: String(first.registrationnumber || '').trim(),
          name: String(first.name || '').trim(),
          fatherName: String(first.fathername || '').trim() || null,
          motherName: String(first.mothername || '').trim() || null,
          department: String(first.department || '').trim(),
          semester: Number(first.semester) || 1,
          section: String(first.section || '').trim() || null,
          email: String(first.email || '').trim() || null,
          phone: String(first.phone || '').trim() || null,
          published: false,
        },
        transaction,
      });

      if (created) {
        summary.studentsCreated++;
      } else {
        summary.studentsUpdated++;
      }

      for (const { row, index } of entries) {
        const subjectName = String(row.subjectname || '').trim();
        if (!subjectName) {
          summary.errors.push(`Row ${index + 2}: missing subjectName, skipped.`);
          continue;
        }

        const internalMarks = Number(row.internalmarks) || 0;
        const externalMarks = Number(row.externalmarks) || 0;
        const credits = Number(row.credits) || 0;

        const { total, grade, gradePoint, result } = calculateSubjectResult({
          internalMarks,
          externalMarks,
          credits,
        });

        const existingSubject = await Subject.findOne({
          where: { studentId: student.id, subjectName },
          transaction,
        });

        if (existingSubject) {
          await existingSubject.update(
            { internalMarks, externalMarks, credits, total, grade, gradePoint, result },
            { transaction }
          );
          summary.duplicatesSkipped++;
        } else {
          await Subject.create(
            {
              studentId: student.id,
              subjectCode: String(row.subjectcode || '').trim() || null,
              subjectName,
              internalMarks,
              externalMarks,
              credits,
              total,
              grade,
              gradePoint,
              result,
            },
            { transaction }
          );
          summary.subjectsInserted++;
        }
      }
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw new ApiError(500, `Import failed and was rolled back: ${err.message}`);
  }

  return summary;
}
