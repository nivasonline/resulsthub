import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a printable marks-memo PDF matching the on-screen result layout.
 */
export function generateResultPDF(result) {
  const { student, subjects, sgpa, cgpa, percentage, overallResult } = result;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ResultHub University', pageWidth / 2, 50, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Marks Memorandum', pageWidth / 2, 68, { align: 'center' });

  doc.setDrawColor(200);
  doc.line(margin, 82, pageWidth - margin, 82);

  // Student details
  doc.setFontSize(10);
  const detailsY = 105;
  const leftCol = [
    ['Name', student.name],
    ['Hall Ticket No.', student.hallTicket],
    ['Registration No.', student.registrationNumber],
  ];
  const rightCol = [
    ['Department', student.department],
    ['Semester', String(student.semester)],
    ['Section', student.section || '—'],
  ];

  leftCol.forEach(([label, value], i) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, detailsY + i * 16);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), margin + 110, detailsY + i * 16);
  });

  rightCol.forEach(([label, value], i) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, pageWidth / 2 + 10, detailsY + i * 16);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), pageWidth / 2 + 100, detailsY + i * 16);
  });

  // Subjects table
  autoTable(doc, {
    startY: detailsY + 60,
    head: [['Subject', 'Internal', 'External', 'Total', 'Credits', 'Grade', 'Result']],
    body: subjects.map((s) => [
      s.subjectName,
      s.internalMarks,
      s.externalMarks,
      s.total,
      s.credits,
      s.grade,
      s.result,
    ]),
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [30, 27, 75] },
    styles: { fontSize: 9, cellPadding: 6 },
  });

  const finalY = doc.lastAutoTable.finalY + 25;

  // Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`SGPA: ${sgpa}`, margin, finalY);
  doc.text(`CGPA: ${cgpa}`, margin + 110, finalY);
  doc.text(`Percentage: ${percentage}%`, margin + 220, finalY);
  doc.text(`Overall Result: ${overallResult}`, margin + 360, finalY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    'This is a computer-generated document. Verify authenticity via the QR code on the original portal.',
    margin,
    finalY + 30
  );
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, finalY + 44);

  doc.save(`${student.hallTicket}_marks_memo.pdf`);
}
