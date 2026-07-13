import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search Result' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 no-print ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl grade-gradient flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-mist-100">ResultHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-mist-100 bg-white/[0.06]' : 'text-mist-300 hover:text-mist-100 hover:bg-white/[0.04]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/admin/login"
            className="px-4 py-2 rounded-lg text-sm font-medium glass text-mist-200 hover:bg-white/[0.08] transition-colors"
          >
            Admin Login
          </Link>
        </div>

        <button
          className="md:hidden text-mist-200 p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-white/10 px-6 py-4 flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'text-mist-100 bg-white/[0.06]' : 'text-mist-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/admin/login" className="px-4 py-2.5 rounded-lg text-sm font-medium text-indigo-300">
            Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}
