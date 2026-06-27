'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const icons = { success: '✓', error: '✕', info: 'ℹ' };

export default function Toast({ message, type, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={`toast ${type}`}>
      <span style={{ fontWeight: 700, fontSize: 15 }}>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
