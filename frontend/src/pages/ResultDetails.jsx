import { useParams, useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft, GraduationCap } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { resultService } from '../services/resultService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import { generateResultPDF } from '../utils/pdfGenerator';

export default function ResultDetails() {
  const { type, value } = useParams();
  const navigate = useNavigate();

  const fetcher = () =>
    type === 'hallTicket'
      ? resultService.getByHallTicket(value)
      : resultService.getByRegNumber(value);

  const { data: result, loading, error, refetch } = useFetch(fetcher, [type, value]);

  if (loading) return <Loader fullScreen label="Loading marks memo…" />;

  if (error) {
    return (
      <div className="px-6 py-24 max-w-lg mx-auto">
        <ErrorState title="Couldn't load this result" description={error} onRetry={refetch} />
        <div className="text-center mt-2">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/search')}>
            Back to search
          </Button>
        </div>
      </div>
    );
  }

  const { student, subjects, sgpa, cgpa, percentage, overallResult } = result;
  const verifyUrl = `${window.location.origin}/result/${type}/${value}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
    verifyUrl
  )}`;

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 no-print">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/search')}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
            Print
          </Button>
          <Button icon={Download} onClick={() => generateResultPDF(result)}>
            Download PDF
          </Button>
        </div>
      </div>

      <Card strong className="print-memo p-8 md:p-12">
        {/* Memo header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grade-gradient flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg text-mist-100">
                ResultHub University
              </h1>
              <p className="text-xs text-mist-400">Official Marks Memorandum</p>
            </div>
          </div>
          <img src={qrSrc} alt="Verification QR code" className="w-16 h-16 rounded-lg" />
        </div>

        {/* Student details */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8 text-sm">
          <DetailRow label="Name" value={student.name} />
          <DetailRow label="Department" value={student.department} />
          <DetailRow label="Hall Ticket No." value={student.hallTicket} mono />
          <DetailRow label="Semester" value={student.semester} />
          <DetailRow label="Registration No." value={student.registrationNumber} mono />
          <DetailRow label="Section" value={student.section || '—'} />
        </div>

        {/* Subjects table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10">
                {['Subject', 'Internal', 'External', 'Total', 'Credits', 'Grade', 'Result'].map(
                  (h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-mist-300">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-mist-100">{s.subjectName}</td>
                  <td className="px-4 py-3 text-mist-300 font-mono">{s.internalMarks}</td>
                  <td className="px-4 py-3 text-mist-300 font-mono">{s.externalMarks}</td>
                  <td className="px-4 py-3 text-mist-100 font-mono">{s.total}</td>
                  <td className="px-4 py-3 text-mist-300 font-mono">{s.credits}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.grade === 'F' ? 'danger' : 'info'}>{s.grade}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.result === 'PASS' ? 'success' : 'danger'}>{s.result}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryStat label="SGPA" value={sgpa} />
          <SummaryStat label="CGPA" value={cgpa} />
          <SummaryStat label="Percentage" value={`${percentage}%`} />
          <SummaryStat
            label="Overall Result"
            value={overallResult}
            accent={overallResult === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}
          />
        </div>

        <p className="text-xs text-mist-500 mt-8 text-center">
          This is a computer-generated document. Scan the QR code to verify authenticity.
        </p>
      </Card>
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="text-mist-400">{label}</span>
      <span className={`text-mist-100 font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function SummaryStat({ label, value, accent = 'grade-gradient-text' }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <p className={`text-xl font-display font-semibold ${accent}`}>{value}</p>
      <p className="text-xs text-mist-400 mt-1">{label}</p>
    </div>
  );
}
