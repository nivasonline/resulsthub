import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 text-mist-400">
        <GraduationCap size={28} />
      </div>
      <h1 className="font-display text-6xl font-semibold grade-gradient-text mb-3">404</h1>
      <p className="text-mist-300 text-lg mb-2">This page didn't make the cut.</p>
      <p className="text-mist-400 text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button icon={ArrowLeft}>Back to Home</Button>
      </Link>
    </div>
  );
}
