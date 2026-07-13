const VARIANTS = {
  success: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  warning: 'bg-amber-400/10 text-amber-300 border-amber-400/25',
  info: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/25',
  neutral: 'bg-white/5 text-mist-300 border-white/10',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
