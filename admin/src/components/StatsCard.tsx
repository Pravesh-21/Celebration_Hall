'use client';

import { useEffect, useState } from 'react';

interface StatsCardProps {
  value: number;
  label: string;
  icon: string;
  color: 'gold' | 'green' | 'amber' | 'red';
}

export default function StatsCard({ value, label, icon, color }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplayValue(0); return; }
    const duration = 800;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-value">{displayValue.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
