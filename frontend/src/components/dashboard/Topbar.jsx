import { Menu } from 'lucide-react';

export default function Topbar({ title, subtitle, onOpenMobile, actions }) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/10 no-print">
      <div className="flex items-center justify-between px-5 lg:px-8 h-16">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-mist-300 p-1.5"
            onClick={onOpenMobile}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-display font-semibold text-mist-100 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-mist-400">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
