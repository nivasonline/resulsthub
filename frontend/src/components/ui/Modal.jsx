import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 no-print">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
        onClick={onClose}
      />
      <div
        className={`relative glass-strong w-full ${sizes[size]} rounded-2xl shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col animate-[modal-in_0.25s_ease-out]`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h3 className="text-lg font-display font-semibold text-mist-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-mist-400 hover:text-mist-100 rounded-lg p-1.5 hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-white/10 shrink-0">{footer}</div>}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
