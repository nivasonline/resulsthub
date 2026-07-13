import { Search as SearchIcon, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-ink-800/60 border border-white/10 text-mist-100 placeholder:text-mist-400/70 pl-10 pr-9 py-2.5 text-sm outline-none transition-all focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 hover:text-mist-100"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
