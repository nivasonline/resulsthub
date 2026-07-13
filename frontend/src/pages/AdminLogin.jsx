import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-ink-900 relative overflow-hidden">
      <div className="ambient-glow bg-indigo-500 w-[450px] h-[450px] -top-32 -left-32" />
      <div className="ambient-glow bg-cyan-400 w-[350px] h-[350px] bottom-0 -right-24" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-200 mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <Card strong className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl grade-gradient flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
              <GraduationCap size={22} className="text-white" />
            </div>
            <h1 className="font-display text-xl font-semibold text-mist-100">Admin Login</h1>
            <p className="text-sm text-mist-400 mt-1">Sign in to manage results</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              icon={User}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {formError && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" loading={loading}>
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
