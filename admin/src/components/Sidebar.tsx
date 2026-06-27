'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/auth';
import { api } from '@/lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    api.checkHealth().then(setBackendOnline);
    const interval = setInterval(() => api.checkHealth().then(setBackendOnline), 30000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const links = [
    { href: '/', label: 'Dashboard', icon: '⬛' },
    { href: '/queries', label: 'All Queries', icon: '📋' },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">Grandeur Hall</div>
        <div className="sidebar-logo-sub">Admin Console</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? 'active' : ''}`}
          >
            <span style={{ fontSize: '15px' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: '20px' }}>Account</div>
        <button className="sidebar-link" onClick={handleLogout}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </nav>

      {/* Footer Status */}
      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span
            className={`status-dot ${backendOnline === null ? 'offline' : backendOnline ? 'online' : 'offline'}`}
          />
          <span>
            {backendOnline === null
              ? 'Connecting…'
              : backendOnline
              ? 'Backend Online'
              : 'Backend Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
}
