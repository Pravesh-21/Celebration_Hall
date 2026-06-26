'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  value: string; // ISO String or YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
}

export function Calendar({ value, onChange, error }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Calculate days in the current month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

  // Get the first day of the month (0 = Sunday, 1 = Monday...)
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate date cells
  const dateCells: (Date | null)[] = [];
  
  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    dateCells.push(null);
  }

  // Actual days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    dateCells.push(new Date(year, month, d));
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (date < today) return; // Disable past dates
    
    // Format as YYYY-MM-DD in local time
    const localYear = date.getFullYear();
    const localMonth = String(date.getMonth() + 1).padStart(2, '0');
    const localDay = String(date.getDate()).padStart(2, '0');
    const dateString = `${localYear}-${localMonth}-${localDay}`;
    
    onChange(dateString);
  };

  const isSelected = (date: Date | null) => {
    if (!date || !value) return false;
    const valDate = new Date(value);
    return (
      date.getDate() === valDate.getDate() &&
      date.getMonth() === valDate.getMonth() &&
      date.getFullYear() === valDate.getFullYear()
    );
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    return date < today;
  };

  return (
    <div className="w-full max-w-[340px] bg-walnut/15 border border-walnut/30 p-4 font-sans select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="text-champagne/60 hover:text-gold p-1 hover:bg-walnut/20 transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeft size={16} />
        </button>
        
        <h4 className="font-serif text-sm font-medium text-champagne tracking-wide">
          {monthNames[month]} {year}
        </h4>
        
        <button
          type="button"
          onClick={handleNextMonth}
          className="text-champagne/60 hover:text-gold p-1 hover:bg-walnut/20 transition-colors"
          aria-label="Next Month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-[10px] uppercase font-medium text-champagne/40 tracking-wider py-1">
            {day}
          </span>
        ))}
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dateCells.map((date, idx) => {
          if (date === null) {
            return <div key={`empty-${idx}`} className="py-2" />;
          }

          const selected = isSelected(date);
          const disabled = isPast(date);

          return (
            <button
              key={`day-${date.getDate()}`}
              type="button"
              disabled={disabled}
              onClick={() => handleDateClick(date)}
              className={`py-1.5 text-xs font-medium transition-all focus:outline-none ${
                selected
                  ? 'bg-gold text-obsidian font-bold'
                  : disabled
                  ? 'text-champagne/20 cursor-not-allowed'
                  : 'text-champagne hover:bg-gold hover:text-obsidian hover:font-bold'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-[11px] text-red-500 mt-2 uppercase tracking-wider">{error}</p>
      )}
    </div>
  );
}
