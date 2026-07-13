import { forwardRef } from 'react';

const Input = forwardRef(
  (
    { label, error, icon: Icon, className = '', containerClassName = '', id, ...props },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-mist-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl bg-ink-800/60 border ${
              error ? 'border-rose-500/50' : 'border-white/10'
            } text-mist-100 placeholder:text-mist-400/70 px-4 py-2.5 ${
              Icon ? 'pl-10' : ''
            } text-sm outline-none transition-all focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
