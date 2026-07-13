import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/upload', label: 'Upload Results', icon: UploadCloud },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-strong border-r border-white/10 flex flex-col z-50 transition-transform duration-300 no-print ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-lg grade-gradient flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-mist-100">ResultHub</span>
        </div>

        <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'grade-gradient text-white shadow-lg shadow-indigo-500/20'
                    : 'text-mist-300 hover:text-mist-100 hover:bg-white/[0.05]'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-medium text-sm">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-mist-100 truncate">{admin?.username}</p>
              <p className="text-xs text-mist-400 capitalize">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
