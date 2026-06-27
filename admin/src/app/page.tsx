'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import AuthGuard from '@/components/AuthGuard';
import { api, StatsData, Booking } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.getStats(),
        api.getBookings({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (bookingsRes.success) setRecentBookings(bookingsRes.data);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });
  }

  const venueMap: Record<string, string> = {
    'grand-ballroom': 'Grand Ballroom',
    'crystal-pavilion': 'Crystal Pavilion',
    'garden-estate': 'Garden Estate',
    'royal-suite': 'Royal Suite',
  };

  return (
    <AuthGuard>
      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                Overview of all booking queries · Auto-refreshes every 30s ·{' '}
                Last updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button
              id="refresh-dashboard-btn"
              className="btn btn-ghost"
              onClick={() => { setLoading(true); fetchData(); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23,4 23,10 17,10" />
                <polyline points="1,20 1,14 7,14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="page-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <StatsCard
                value={stats?.total ?? 0}
                label="Total Queries"
                icon="📊"
                color="gold"
              />
              <StatsCard
                value={stats?.pending ?? 0}
                label="Pending"
                icon="⏳"
                color="amber"
              />
              <StatsCard
                value={stats?.confirmed ?? 0}
                label="Confirmed"
                icon="✅"
                color="green"
              />
              <StatsCard
                value={stats?.rejected ?? 0}
                label="Rejected"
                icon="❌"
                color="red"
              />
            </div>

            {/* Two column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>

              {/* Recent Queries Table */}
              <div className="table-card">
                <div className="table-header-bar">
                  <h2>Recent Queries</h2>
                  <Link href="/queries" className="btn btn-ghost" style={{ fontSize: 12 }}>
                    View All →
                  </Link>
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <span className="spinner" />Loading…
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>No queries yet. They'll appear here once users submit bookings.</p>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ref #</th>
                        <th>Guest</th>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr
                          key={b._id}
                          onClick={() => router.push(`/queries/${b._id}`)}
                          id={`recent-row-${b._id}`}
                        >
                          <td><span className="booking-ref">{b.referenceNumber}</span></td>
                          <td>
                            <div className="booking-name">{b.name}</div>
                            <div className="booking-email">{b.email}</div>
                          </td>
                          <td style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                            {b.eventType}
                          </td>
                          <td>
                            <div style={{ color: 'var(--text-primary)', fontSize: 13 }}>
                              {formatDate(b.date)}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                              Received {formatDate(b.createdAt)}
                            </div>
                          </td>
                          <td><StatusBadge status={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Event Type Breakdown */}
              <div className="table-card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                  Events Breakdown
                </h2>
                {!stats || stats.eventTypeBreakdown.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                    No data yet
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {stats.eventTypeBreakdown.map((item) => {
                      const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                      return (
                        <div key={item._id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                              {item._id || 'Unknown'}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              {item.count} ({pct}%)
                            </span>
                          </div>
                          <div style={{
                            height: 4,
                            background: 'var(--surface-4)',
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
                              borderRadius: 2,
                              transition: 'width 0.8s ease',
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
