import * as React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full font-sans">
        <select
          className={`flex h-11 w-full rounded-none border ${
            error ? 'border-red-500' : 'border-walnut/40'
          } bg-walnut/20 px-4 py-2 pr-10 text-sm text-champagne appearance-none cursor-pointer focus-visible:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/45 focus-visible:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-obsidian text-champagne/40">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-obsidian text-champagne py-2">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Gold Arrow Overlay */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {error && (
          <p className="text-[11px] text-red-500 mt-1 uppercase tracking-wider">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
