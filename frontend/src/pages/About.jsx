import { ShieldCheck, Zap, Users, Server } from 'lucide-react';
import Card from '../components/ui/Card';

const POINTS = [
  {
    icon: Zap,
    title: 'Fast by default',
    desc: 'Indexed lookups mean results resolve in a fraction of a second, even during peak results-day traffic.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure architecture',
    desc: 'JWT-authenticated admin access, hashed credentials, rate limiting, and validated input on every route.',
  },
  {
    icon: Users,
    title: 'Built for registrars',
    desc: 'Bulk Excel import, publish/hide controls, and department-wide analytics in a single dashboard.',
  },
  {
    icon: Server,
    title: 'Reliable infrastructure',
    desc: 'A MySQL-backed system designed to scale from a single department to an entire university.',
  },
];

export default function About() {
  return (
    <div className="px-6 py-20 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl font-semibold text-mist-100 mb-4">
          About <span className="grade-gradient-text">ResultHub</span>
        </h1>
        <p className="text-mist-400 max-w-2xl mx-auto leading-relaxed">
          ResultHub is a modern result management system designed to replace the slow, paper-heavy
          process of publishing academic results. Students get instant, verifiable access to their
          marks. Registrars get a single dashboard to import, publish, and analyze results across
          every department and semester.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-16">
        {POINTS.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-6">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center mb-4">
              <Icon size={20} />
            </div>
            <h3 className="font-medium text-mist-100 mb-2">{title}</h3>
            <p className="text-sm text-mist-400 leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>

      <Card strong className="p-8 md:p-10 text-center">
        <h2 className="font-display text-xl font-semibold text-mist-100 mb-3">
          Have a question about your result?
        </h2>
        <p className="text-mist-400 text-sm max-w-md mx-auto">
          Reach out to your department's examination cell — ResultHub reflects records as
          published by the registrar's office and does not alter grading decisions.
        </p>
      </Card>
    </div>
  );
}
