import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Topbar from '../components/dashboard/Topbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { studentService } from '../services/studentService';
import { useToast } from '../context/ToastContext';

const EXPECTED_COLUMNS = [
  'hallTicket', 'registrationNumber', 'name', 'fatherName', 'motherName',
  'department', 'semester', 'section', 'email', 'phone',
  'subjectName', 'internalMarks', 'externalMarks', 'credits',
];

export default function AdminUpload() {
  const { openMobileSidebar } = useOutletContext();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);

  const handleFile = (selected) => {
    if (!selected) return;
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(selected.type)) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls).');
      return;
    }
    setFile(selected);
    setSummary(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const result = await studentService.uploadExcel(file, setProgress);
      setSummary(result);
      toast.success('Excel import completed.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSummary(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Topbar
        title="Upload Results"
        subtitle="Bulk import students and marks from an Excel file"
        onOpenMobile={openMobileSidebar}
      />

      <div className="p-5 lg:p-8 flex-1 max-w-3xl">
        <Card className="p-6 mb-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              dragActive ? 'border-indigo-400 bg-indigo-400/5' : 'border-white/15'
            }`}
          >
            {!file ? (
              <>
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-indigo-300">
                  <UploadCloud size={24} />
                </div>
                <p className="text-mist-100 font-medium mb-1">
                  Drag & drop your Excel file here
                </p>
                <p className="text-sm text-mist-400 mb-5">or click below to browse (.xlsx, .xls — max 5MB)</p>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </>
            ) : (
              <div className="flex items-center justify-between glass rounded-xl p-4 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <FileSpreadsheet size={22} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-mist-100 truncate">{file.name}</p>
                    <p className="text-xs text-mist-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="p-1.5 text-mist-400 hover:text-mist-100 shrink-0"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {file && !summary && (
            <div className="mt-5">
              {uploading && (
                <div className="w-full h-1.5 rounded-full bg-white/5 mb-4 overflow-hidden">
                  <div
                    className="h-full grade-gradient transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <Button className="w-full" onClick={handleUpload} loading={uploading}>
                {uploading ? `Uploading (${progress}%)` : 'Import Results'}
              </Button>
            </div>
          )}
        </Card>

        {summary && (
          <Card className="p-6 mb-6 animate-[fade-up_0.3s_ease-out]">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h3 className="font-display font-semibold text-mist-100">Upload Summary</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <SummaryTile label="Rows Processed" value={summary.totalRows} />
              <SummaryTile label="Students Created" value={summary.studentsCreated} accent="text-emerald-400" />
              <SummaryTile label="Students Updated" value={summary.studentsUpdated} accent="text-cyan-400" />
              <SummaryTile label="Subjects Inserted" value={summary.subjectsInserted} accent="text-indigo-300" />
              <SummaryTile label="Duplicates Updated" value={summary.duplicatesSkipped} accent="text-amber-400" />
              <SummaryTile label="Errors" value={summary.errors.length} accent="text-rose-400" />
            </div>

            {summary.errors.length > 0 && (
              <div className="glass rounded-xl p-4 max-h-48 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2 text-amber-300 text-sm font-medium">
                  <AlertCircle size={14} />
                  Rows skipped
                </div>
                <ul className="text-xs text-mist-400 space-y-1">
                  {summary.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="secondary" className="w-full mt-5" onClick={reset}>
              Upload Another File
            </Button>
          </Card>
        )}

        <Card className="p-6">
          <h3 className="font-medium text-mist-100 mb-3">Expected Excel Columns</h3>
          <p className="text-sm text-mist-400 mb-4">
            One row per subject. Rows sharing the same <code className="text-cyan-300">hallTicket</code> are
            grouped into a single student record.
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPECTED_COLUMNS.map((col) => (
              <span key={col} className="glass px-2.5 py-1 rounded-lg text-xs font-mono text-mist-300">
                {col}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function SummaryTile({ label, value, accent = 'text-mist-100' }) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <p className={`text-lg font-display font-semibold ${accent}`}>{value}</p>
      <p className="text-xs text-mist-400 mt-0.5">{label}</p>
    </div>
  );
}
