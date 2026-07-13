import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'grade-gradient text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:brightness-110',
  secondary:
    'glass text-mist-100 hover:bg-white/[0.08] border-white/10',
  ghost: 'text-mist-300 hover:text-mist-100 hover:bg-white/[0.05]',
  danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25',
  outline: 'border border-indigo-400/40 text-indigo-300 hover:bg-indigo-400/10',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon size={16} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon size={16} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
