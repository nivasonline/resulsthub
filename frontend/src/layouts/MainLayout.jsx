import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-900 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow bg-indigo-500 w-[500px] h-[500px] -top-40 -left-40" />
      <div className="ambient-glow bg-cyan-400 w-[400px] h-[400px] top-1/3 -right-32" />

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
