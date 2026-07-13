import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Zap,
  BarChart3,
  FileDown,
  ArrowRight,
  GraduationCap,
  Building2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant results',
    desc: 'Look up any published result in seconds using a hall ticket or registration number.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & secure',
    desc: 'Every memo is tied to an official record with QR-based verification against tampering.',
  },
  {
    icon: FileDown,
    title: 'Download & print',
    desc: 'Export a print-ready marks memo as a PDF, formatted like the official university copy.',
  },
  {
    icon: BarChart3,
    title: 'Built for scale',
    desc: 'Handles bulk Excel imports and thousands of concurrent lookups without breaking a sweat.',
  },
];

const STATS = [
  { label: 'Results processed', value: '48,000+' },
  { label: 'Departments covered', value: '12' },
  { label: 'Avg. lookup time', value: '0.4s' },
  { label: 'Uptime', value: '99.9%' },
];

export default function Home() {
  const [searchType, setSearchType] = useState('hallTicket');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?type=${searchType}&q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-medium text-mist-300 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Results portal now open for Semester 2026
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-mist-100 leading-[1.1] tracking-tight mb-6">
            Your result,
            <br />
            <span className="grade-gradient-text">one search away.</span>
          </h1>

          <p className="text-mist-400 text-base md:text-lg max-w-xl mx-auto mb-10">
            Enter a hall ticket or registration number to pull an official, verifiable marks
            memo — instantly.
          </p>

          {/* Search Card */}
          <Card strong className="p-2 max-w-xl mx-auto text-left">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex glass rounded-xl p-1 sm:w-auto">
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
              <Button type="submit" icon={ArrowRight} iconPosition="right">
                Get Result
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-semibold text-mist-100 mb-3">
            Everything a results day needs
          </h2>
          <p className="text-mist-400 max-w-lg mx-auto">
            From instant lookups to bulk imports, ResultHub is built to handle result day
            without the queue.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} hover className="p-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-medium text-mist-100 mb-2">{title}</h3>
              <p className="text-sm text-mist-400 leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 py-16">
        <Card strong className="max-w-6xl mx-auto p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl md:text-4xl font-semibold grade-gradient-text mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-mist-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center">
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center text-mist-300">
            <GraduationCap size={20} />
          </div>
          <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center text-mist-300">
            <Building2 size={20} />
          </div>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-mist-100 mb-3">
          Registrar's office? Manage results from one dashboard.
        </h2>
        <p className="text-mist-400 max-w-md mx-auto mb-7">
          Import from Excel, publish results in bulk, and track performance across departments.
        </p>
        <Button variant="secondary" onClick={() => (window.location.href = '/admin/login')}>
          Go to Admin Login
        </Button>
      </section>
    </div>
  );
}
