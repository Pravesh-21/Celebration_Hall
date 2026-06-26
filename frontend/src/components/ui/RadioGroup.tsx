import * as React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 font-sans ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex-1 flex items-center justify-between p-4 border cursor-pointer select-none transition-all duration-300 ${
                isSelected
                  ? 'border-gold bg-walnut/25 text-gold'
                  : 'border-walnut/30 bg-walnut/10 hover:border-gold/30 text-champagne'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium tracking-wide">{opt.label}</span>
                {opt.description && (
                  <span className="text-[10px] text-champagne/50 mt-0.5">{opt.description}</span>
                )}
              </div>
              
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only" // hide native but keep keyboard accessible
              />

              {/* Premium Custom Radio Circle */}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'border-gold' : 'border-champagne/40'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-gold animate-scaleIn" />
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 mt-1 uppercase tracking-wider">{error}</p>
      )}
    </div>
  );
}
