import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, error, ...props }, ref) => {
    return (
      <div className="w-full font-sans">
        <input
          type={type}
          className={`flex h-11 w-full rounded-none border ${
            error ? 'border-red-500' : 'border-walnut/40'
          } bg-walnut/20 px-3 py-2 text-sm text-champagne placeholder:text-champagne/30 focus-visible:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/45 focus-visible:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-red-500 mt-1 uppercase tracking-wider">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
