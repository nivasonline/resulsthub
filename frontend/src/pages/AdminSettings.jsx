import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { User, Shield } from 'lucide-react';
import Topbar from '../components/dashboard/Topbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminSettings() {
  const { openMobileSidebar } = useOutletContext();
  const { admin } = useAuth();
  const toast = useToast();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  // Note: wire this to a PATCH /api/admin/change-password endpoint on the
  // backend (not included in the current API surface) before going live.
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (next !== confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    if (next.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    toast.info('Connect this form to a password-change API endpoint to activate it.');
  };

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your admin account" onOpenMobile={openMobileSidebar} />

      <div className="p-5 lg:p-8 flex-1 max-w-2xl flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={17} className="text-indigo-300" />
            <h3 className="font-display font-semibold text-mist-100">Account</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-mist-400 mb-1">Username</p>
              <p className="text-sm text-mist-100">{admin?.username}</p>
            </div>
            <div>
              <p className="text-xs text-mist-400 mb-1">Role</p>
              <p className="text-sm text-mist-100 capitalize">{admin?.role}</p>
            </div>
            <div>
              <p className="text-xs text-mist-400 mb-1">Last Login</p>
              <p className="text-sm text-mist-100">
                {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString() : '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={17} className="text-indigo-300" />
            <h3 className="font-display font-semibold text-mist-100">Change Password</h3>
          </div>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <Input
              label="Current Password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <Button type="submit" className="self-start mt-1">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
