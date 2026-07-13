import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, User, GraduationCap } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { resultService } from '../services/resultService';

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState(searchParams.get('type') || 'hallTicket');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = async (type, value) => {
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const data =
        type === 'hallTicket'
          ? await resultService.getByHallTicket(value.trim())
          : await resultService.getByRegNumber(value.trim());
      setPreview(data);
    } catch (err) {
      setError(err.message || 'No result found. Double-check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    const type = searchParams.get('type') || 'hallTicket';
    if (q) runSearch(type, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(searchType, query);
  };

  const viewFullResult = () => {
    if (!preview) return;
    navigate(`/result/${searchType}/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="px-6 py-16 max-w-2xl mx-auto min-h-[70vh]">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-semibold text-mist-100 mb-3">
          Search your result
        </h1>
        <p className="text-mist-400">Use your hall ticket or registration number.</p>
      </div>

      <Card strong className="p-2 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex glass rounded-xl p-1">
            <button
              type="button"
              onClick={() => setSearchType('hallTicket')}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                searchType === 'hallTicket' ? 'grade-gradient text-white' : 'text-mist-400'
              }`}
            >
              Hall Ticket
            </button>
            <button
              type="button"
              onClick={() => setSearchType('regNumber')}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                searchType === 'regNumber' ? 'grade-gradient text-white' : 'text-mist-400'
              }`}
            >
              Reg. Number
            </button>
          </div>
          <Input
            containerClassName="flex-1"
            icon={Search}
            placeholder={searchType === 'hallTicket' ? 'e.g. 22A91A0501' : 'e.g. REG2026001'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" loading={loading}>
            Search
          </Button>
        </form>
      </Card>

      {loading && <Loader label="Fetching result…" />}

      {!loading && error && (
        <ErrorState
          title="Result not found"
          description={error}
          onRetry={() => runSearch(searchType, query)}
        />
      )}

      {!loading && preview && (
        <Card hover className="p-6 animate-[fade-up_0.3s_ease-out]">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-lg text-mist-100 truncate">
                {preview.student.name}
              </h3>
              <p className="text-sm text-mist-400">
                {preview.student.department} · Semester {preview.student.semester}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-lg font-display font-semibold grade-gradient-text">{preview.sgpa}</p>
              <p className="text-xs text-mist-400 mt-0.5">SGPA</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-lg font-display font-semibold grade-gradient-text">
                {preview.percentage}%
              </p>
              <p className="text-xs text-mist-400 mt-0.5">Percentage</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <p
                className={`text-lg font-display font-semibold ${
                  preview.overallResult === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {preview.overallResult}
              </p>
              <p className="text-xs text-mist-400 mt-0.5">Result</p>
            </div>
          </div>

          <Button className="w-full" icon={ArrowRight} iconPosition="right" onClick={viewFullResult}>
            View Full Marks Memo
          </Button>
        </Card>
      )}

      {!loading && !preview && !error && (
        <div className="flex flex-col items-center text-center text-mist-500 py-12">
          <GraduationCap size={32} className="mb-3 opacity-40" />
          <p className="text-sm">Your result will appear here once you search.</p>
        </div>
      )}

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
