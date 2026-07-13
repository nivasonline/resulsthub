import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24 no-print">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg grade-gradient flex items-center justify-center">
            <GraduationCap size={14} className="text-white" />
          </div>
          <span className="font-display font-semibold text-mist-200">ResultHub</span>
        </Link>
        <p className="text-sm text-mist-400">
          &copy; {new Date().getFullYear()} ResultHub. Built for students, by the registrar's office.
        </p>
        <div className="flex gap-5 text-sm text-mist-400">
          <Link to="/about" className="hover:text-mist-200 transition-colors">
            About
          </Link>
          <Link to="/search" className="hover:text-mist-200 transition-colors">
            Search Result
          </Link>
          <Link to="/admin/login" className="hover:text-mist-200 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
